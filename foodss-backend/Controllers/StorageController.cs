using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StorageSystem.Models;
using StorageSystem.Services;
using static StorageSystem.Controllers.StorageInvitationController;

namespace StorageSystem.Controllers
{
    // Used when creating/updating a storage, sent from the client to the server
    public class StorageInputDTO
    {
        public string Name { get; set; }

        public ICollection<StorageInvitationInputDTO> Invitations;
    }

    // Used when viewing one/many storage(s), sent from the server to the client
    public class StorageDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OwnerId { get; set; }
        public bool Shared { get; set; }

        public static StorageDTO FromModel(Storage model) => new StorageDTO() { Id = model.Id, Name = model.Name, OwnerId = model.OwnerId, Shared = model.Shared };
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class StorageController : Controller
    {
        private readonly StorageSystemContext context;

        private readonly UserService userService;

        public StorageController(StorageSystemContext context, UserService userService)
        {
            this.context = context;
            this.userService = userService;
        }

        [HttpGet]
        public async Task<IEnumerable<StorageDTO>> GetStorages()
        {
            int userId = userService.GetUserId(this.User);

            // We query the pivot table to get the storage id's associated with the user
            ICollection<int> storageIds = await context.StorageUsers
                    .Where(storage => storage.UserId == userId)
                    .Select(storage => storage.StorageId)
                    .ToListAsync();

            return await context.Storages
                .Where(storage => storage.OwnerId == userId || storageIds.Contains(storage.Id))
                .Select(storage => StorageDTO.FromModel(storage))
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StorageDTO>> FindStorageById(int id)
        {
            int userId = userService.GetUserId(this.User);

            Storage storage = await context.Storages
                .Include(s => s.Users)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (storage == null)
            {
                return NotFound();
            }

            // If the user is neither the owner of the storage, nor is he inside the user's collection, we return an error
            if ((storage.OwnerId != userId) && (storage.Users.FirstOrDefault(u => u.UserId == userId) == null))
            {
                return this.Unauthorized();
            }

            return StorageDTO.FromModel(storage);
        }

        [HttpPost]
        public async Task<ActionResult<StorageDTO>> CreateStorage(StorageInputDTO storageInput)
        {
            User user = await userService.GetUserAsync(this.User);

            using (var transaction = context.Database.BeginTransaction())
            {
                bool shared = storageInput.Invitations.Count > 0;

                Storage storageModel = new Storage() { Name = storageInput.Name, Shared = shared, OwnerId = user.Id };

                await context.Storages.AddAsync(storageModel);

                if (storageInput.Invitations != null)
                {
                    storageInput.Invitations = storageInput.Invitations.Distinct(new StorageInvitationInputDTOComparer()).ToList();

                    foreach (StorageInvitationInputDTO invitationInput in storageInput.Invitations)
                    {
                        if (invitationInput.UserEmail == user.Email)
                        {
                            transaction.Rollback();

                            return BadRequest(new { message = "Can't create invitation for yourself." });
                        }

                        StorageInvitation invitation = new StorageInvitation() { StorageId = storageModel.Id, UserEmail = invitationInput.UserEmail };

                        await context.StorageInvitations.AddAsync(invitation);
                    }
                }

                await context.SaveChangesAsync();

                transaction.Commit();

                return StorageDTO.FromModel(storageModel);
            }
        }

        [HttpPost("{id}")]
        public async Task<ActionResult<StorageDTO>> UpdateStorage(int id, StorageInputDTO storageInput)
        {
            int userId = userService.GetUserId(this.User);

            Storage storageModel = await context.Storages.FindAsync(id);

            if (storageModel == null)
            {
                return NotFound();
            }

            // TODO Decide if only the owner should be able to edit a storage, or any member of the storage can edit it as well
            if (storageModel.OwnerId != userId)
            {
                return Unauthorized();
            }

            // TODO There should be further input validation, such as a minimum length for the name attribute
            // in order to prevent empty storage names ""
            storageModel.Name = storageInput.Name;

            context.Storages.Update(storageModel);

            await context.SaveChangesAsync();

            return StorageDTO.FromModel(storageModel);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteStorageById(int id)
        {
            int userId = userService.GetUserId(this.User);

            Storage storage = await context.Storages.FindAsync(id);

            if (storage == null)
            {
                return NotFound();
            }

            // Let's assume only the owner can delete a storage
            if (storage.OwnerId != userId)
            {
                return Unauthorized();
            }

            context.Storages.Remove(storage);

            await context.SaveChangesAsync();

            return Ok();
        }
    }
}
