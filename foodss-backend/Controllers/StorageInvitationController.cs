using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StorageSystem.Architecture.Exception;
using StorageSystem.Controllers.DTO;
using StorageSystem.Models;
using StorageSystem.Services;

namespace StorageSystem.Controllers
{

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/storage/{storageId}/invitation")]
    [ApiController]
    public class StorageInvitationController : Controller
    {
        public class StorageInvitationInputDTOComparer : IEqualityComparer<StorageInvitationInputDTO>
        {
            public bool Equals(StorageInvitationInputDTO x, StorageInvitationInputDTO y)
            {
                return String.Equals(x.UserEmail, y.UserEmail);
            }

            public int GetHashCode(StorageInvitationInputDTO obj)
            {
                return obj.UserEmail.GetHashCode();
            }
        }

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
        public async Task<ICollection<StorageInvitationDTO>> ListInvitations(int storageId)
        {
            Storage storage = await GetStorage(storageId);

            if (storage == null)
            {
                throw new StorageNotFoundException();
            }

            User user = await userService.GetUserAsync(this.User);

            if (!CanUserSeeInvitations(user, storage, storage.Users))
            {
                throw new UnauthorizedStorageAccessException();
            }

            return storage.Invitations
                .Select(invitation => StorageInvitationDTO.FromModel(invitation))
                .ToList();
        }

        [HttpPost]
        public async Task<StorageInvitationDTO> CreateInvitation(int storageId, StorageInvitationInputDTO input)
        {
            Storage storage = await GetStorage(storageId);

            if (storage == null)
            {
                throw new StorageNotFoundException();
            }

            User user = await userService.GetUserAsync(this.User);

            if (!CanUserSeeInvitations(user, storage, storage.Users))
            {
                throw new UnauthorizedStorageAccessException();
            }

            // If we try to invite an email already associated with an account...
            User emailOwner = await context.Users
                .Where(u => u.Email == input.UserEmail)
                .FirstOrDefaultAsync();

            // Now the storage users are available through the property storage.Users
            // If the user exist and is already a member of the storage, we cannot invite him/her
            if (emailOwner != null && storage.Users.Where(u => u.UserId == emailOwner.Id).Count() > 0)
            {
                throw new InviteExistingStorageMemberException();
            }

            StorageInvitation invitation = storage.Invitations
                .Where(i => i.UserEmail == input.UserEmail)
                .FirstOrDefault();

            // If the invitation already exists, then this is a successful no-op
            if (invitation == null)
            {
                invitation = new StorageInvitation() { StorageId = storageId, UserEmail = input.UserEmail };

                await context.StorageInvitations.AddAsync(invitation);

                // Adding an invitation to a storage that was not marked as shared before always makes it shared
                if (storage.Shared == false)
                {
                    storage.Shared = true;

                    context.Storages.Update(storage);
                }

                await context.SaveChangesAsync();
            }

            return StorageInvitationDTO.FromModel(invitation);
        }

        [HttpDelete("{email}")]
        public async Task RemoveInvitation(int storageId, string email)
        {
            Storage storage = await GetStorage(storageId);

            if (storage == null)
            {
                throw new StorageNotFoundException();
            }

            User user = await userService.GetUserAsync(this.User);

            if (!CanUserSeeInvitations(user, storage, storage.Users))
            {
                throw new UnauthorizedStorageAccessException();
            }

            StorageInvitation invitation = storage.Invitations
                .Where(i => i.UserEmail == email)
                .FirstOrDefault();

            // If the invitation is null, then it already doesn't exist in the database
            // And since we're trying to remove it here, that means objective accomplished
            if (invitation != null)
            {
                context.StorageInvitations.Remove(invitation);

                // If there is only one invitation in this storage, and we are removing it,
                // and if there are no active users as well, then we can consider this storage as not shared anymore
                if (storage.Invitations.Count <= 1 && storage.Users.Count == 0)
                {
                    storage.Shared = false;

                    context.Storages.Update(storage);
                }

                await context.SaveChangesAsync();
            }
        }
    }
}
