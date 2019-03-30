using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StorageSystem.Models;

namespace StorageSystem.Controllers
{
    public class StorageDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OwnerId { get; set; }
        public StorageType Type { get; set; }

        public static StorageDTO FromModel(Storage model) => new StorageDTO() { Id = model.Id, Name = model.Name, OwnerId = model.OwnerId, Type = model.Type };
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
    }
}
