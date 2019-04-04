using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StorageSystem.Models;

namespace StorageSystem.Controllers
{
    // Used when creating/updating a storage, sent from the client to the server
    public class StorageInputDTO
    {
        public string Name { get; set; }
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

    [Route("api/[controller]")]
    [ApiController]
    public class StorageController : Controller
    {
        private readonly StorageSystemContext context;

        public StorageController(StorageSystemContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<StorageDTO>> GetStorages()
        {
            // Ideally this should be retrieved from some session variable to identify the user who made the request
            var userId = 1;

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
            var userId = 1;

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
            var userId = 1;

            Storage storageModel = new Storage() { Name = storageInput.Name, Shared = false, OwnerId = userId };

            await context.Storages.AddAsync(storageModel);

            await context.SaveChangesAsync();

            return StorageDTO.FromModel(storageModel);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteStorageById(int id)
        {
            var userId = 1;

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
