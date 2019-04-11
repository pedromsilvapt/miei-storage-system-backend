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
    [Route("api/storage/{storageId}/product")]
    [ApiController]
    public class StorageProductController : Controller
    {
        public class ProductDTO
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Barcode { get; set; }
            public bool HasExpiryDate { get; set; }
            public int StorageId { get; set; }
            public double? MaxTemperature { get; set; }
            public int? Count { get; set; }
            public DateTime? ClosestExpiryDate { get; set; }

            public static ProductDTO FromModel(Product model, ICollection<ProductItem> items = null)
                => new ProductDTO()
                {
                    Id = model.Id,
                    Name = model.Name,
                    Barcode = model.Barcode,
                    HasExpiryDate = model.HasExpiryDate,
                    StorageId = model.StorageId,
                    MaxTemperature = model.MaxTemperature,
                    Count = items?.Count(),
                    ClosestExpiryDate = items?.Where(s => s.ExpiryDate != null)?.Min(s => s.ExpiryDate)
                };
        }


        private readonly StorageSystemContext context;

        private readonly UserService userService;

        public StorageProductController(StorageSystemContext context, UserService userService)
        {
            this.context = context;
            this.userService = userService;
        }

        protected async Task<Storage> GetStorage(int storageId)
        {
            return await context.Storages
                // Load users
                .Include(s => s.Users)
                .Where(s => s.Id == storageId)
                .FirstOrDefaultAsync();
        }

        protected bool CanUserSeeProducts(User user, Storage storage, ICollection<StorageUser> members)
        {
            // Only allow the owner or other members of the storage to view the storage membership invitations
            return (storage.OwnerId == user.Id) || members.Where(s => s.UserId == user.Id).Count() > 0;
        }

        public class ListQuery
        {
            public int? Skip { get; set; }
            public int? Take { get; set; }
        }

        private List<ProductItem> ListVisibleItems(User user, ICollection<ProductItem> items)
        {
            return items.Where(item => (item.Shared == true) || (item.OwnerId == user.Id)).ToList();
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<ProductDTO>>> ListProducts(int storageId, [FromQuery]ListQuery query)
        {
            Storage storage = await GetStorage(storageId);

            if (storage == null)
            {
                return NotFound();
            }

            User user = await userService.GetUserAsync(this.User);

            if (!CanUserSeeProducts(user, storage, storage.Users))
            {
                return Unauthorized();
            }

            return await context.Products
                // Only retrieve the products that belong to this storage
                .Where(p => p.StorageId == storage.Id)
                // How many records to skip (defaults to 0)
                .Skip(query.Skip ?? 0)
                // How many records to return (defaults to 20)
                .Take(query.Take ?? 20)
                // Sort by name
                .OrderBy(product => product.Name)
                // Join for each product it's items as well
                .Include(p => p.Items)
                .Select(product => ProductDTO.FromModel(product, ListVisibleItems(user, product.Items)))
                .ToListAsync();
        }
    }
}
