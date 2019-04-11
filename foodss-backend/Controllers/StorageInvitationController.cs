using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StorageSystem.Models;
using StorageSystem.Services;

namespace StorageSystem.Controllers
{

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/storage/{storageId}/invitation")]
    [ApiController]
    public class StorageInvitationController : Controller
    {
        public class StorageInvitationInputDTO
        {
            public string UserEmail { get; set; }
        }

        public class StorageInvitationDTO
        {
            public int StorageId { get; set; }
            public string UserEmail { get; set; }
            public UserDTO User { get; set; }

            public static StorageInvitationDTO FromModel(StorageInvitation model)
                => new StorageInvitationDTO() { StorageId = model.StorageId, UserEmail = model.UserEmail, User = model.User != null ? UserDTO.FromModel(model.User) : null };
        }


        private readonly StorageSystemContext context;

        private readonly UserService userService;

        public StorageInvitationController(StorageSystemContext context, UserService userService)
        {
            this.context = context;
            this.userService = userService;
        }

        protected async Task<Storage> GetStorage(int storageId)
        {
            return await context.Storages
                // Load users
                .Include(s => s.Users)
                // As well as invitations
                .Include(s => s.Invitations)
                // And while we're at it, load each invitation's users as well (if they exist)
                .ThenInclude(i => i.User)
                .Where(s => s.Id == storageId)
                .FirstOrDefaultAsync();
        }

        protected bool CanUserSeeInvitations(User user, Storage storage, ICollection<StorageUser> members)
        {
            // Only allow the owner or other members of the storage to view the storage membership invitations
            return (storage.OwnerId == user.Id) || members.Where(s => s.UserId == user.Id).Count() > 0;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<StorageInvitationDTO>>> ListInvitations(int storageId)
        {
            Storage storage = await GetStorage(storageId);

            if (storage == null)
            {
                return NotFound();
            }

            User user = await userService.GetUserAsync(this.User);

            if (!CanUserSeeInvitations(user, storage, storage.Users))
            {
                return Unauthorized();
            }

            return storage.Invitations
                .Select(invitation => StorageInvitationDTO.FromModel(invitation))
                .ToList();
        }

        [HttpPost]
        public async Task<ActionResult<StorageInvitationDTO>> CreateInvitation(int storageId, StorageInvitationInputDTO input)
        {
            Storage storage = await GetStorage(storageId);

            if (storage == null)
            {
                return NotFound();
            }

            User user = await userService.GetUserAsync(this.User);

            if (!CanUserSeeInvitations(user, storage, storage.Users))
            {
                return Unauthorized();
            }

            // If we try to invite an email already associated with an account...
            User emailOwner = await context.Users
                .Where(u => u.Email == input.UserEmail)
                .FirstOrDefaultAsync();

            // Now the storage users are available through the property storage.Users
            // If the user exist and is already a member of the storage, we cannot invite him/her
            if (emailOwner != null && storage.Users.Where(u => u.UserId == emailOwner.Id).Count() > 0)
            {
                return BadRequest();
            }

            StorageInvitation invitation = storage.Invitations
                .Where(i => i.UserEmail == input.UserEmail)
                .FirstOrDefault();

            // If the invitation already exists, then this is a successful no-op
            if (invitation == null)
            {
                invitation = new StorageInvitation() { StorageId = storageId, UserEmail = input.UserEmail };

                context.StorageInvitations.Add(invitation);

                await context.SaveChangesAsync();
            }

            return StorageInvitationDTO.FromModel(invitation);
        }

        [HttpDelete("{email}")]
        public async Task<ActionResult> RemoveInvitation(int storageId, string email)
        {
            Storage storage = await GetStorage(storageId);

            if (storage == null)
            {
                return NotFound();
            }

            User user = await userService.GetUserAsync(this.User);

            if (!CanUserSeeInvitations(user, storage, storage.Users))
            {
                return Unauthorized();
            }
            
            StorageInvitation invitation = storage.Invitations
                .Where(i => i.UserEmail == email)
                .FirstOrDefault();

            // If the invitation is null, then it already doesn't exist in the database
            // And since we're trying to remove it here, that means objective accomplished
            if (invitation != null)
            {
                context.StorageInvitations.Remove(invitation);

                await context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}
