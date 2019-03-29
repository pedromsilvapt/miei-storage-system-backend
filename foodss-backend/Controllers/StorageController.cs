using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StorageSystem.Models;

namespace StorageSystem.Controllers
{
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
        public async Task<ActionResult<IEnumerable<Object>>> GetStorages()
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
                .Select(storage => new { storage.Id, storage.Name, storage.OwnerId, storage.Type })
                .ToListAsync();
        }

    }
}
