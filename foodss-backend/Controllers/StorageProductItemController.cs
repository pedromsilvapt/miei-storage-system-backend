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
    [Route("api/storage/{storageId}/product/{productId}")]
    [ApiController]
    public class StorageProductItemController : Controller
    {
        public class ProductItemDTO
        {
            public int Id { get; set; }
            public int ProductId { get; set; }
            public int OwnerId { get; set; }
            public bool Shared { get; set; }
            public DateTime? ExpiryDate { get; set; }
            public DateTime AddedDate { get; set; }
            public DateTime? ConsumedDate { get; set; }

            public static ProductItemDTO FromModel(ProductItem model)
                => new ProductItemDTO()
                {
                    Id = model.Id,
                    ProductId = model.ProductId,
                    OwnerId = model.OwnerId,
                    Shared = model.Shared,
                    ExpiryDate = model.ExpiryDate,
                    AddedDate = model.AddedDate,
                    ConsumedDate = model.ConsumedDate
                };
        }


        private readonly StorageSystemContext context;

        private readonly UserService userService;

        public StorageProductItemController(StorageSystemContext context, UserService userService)
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

        protected async Task<Product> GetProduct(int productId)
        {
            return await context.Products
                .Where(p => p.Id == productId)
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

        private bool CanUserSeeItem(User user, ProductItem item)
        {
            return (item.Shared == true) || (item.OwnerId == user.Id);
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<ProductItemDTO>>> ListProductItems(int storageId, int productId, [FromQuery]ListQuery query)
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

            Product product = await GetProduct(productId);

            if ((product == null) || (product.StorageId != storage.Id))
            {
                return NotFound();
            }

            return await context.ProductItems
                .Where(p => (p.ProductId == product.Id) && CanUserSeeItem(user, p))
                .Select(item => ProductItemDTO.FromModel(item))
                // How many records to skip (defaults to 0)
                .Skip(query.Skip ?? 0)
                // How many records to return (defaults to 20)
                .Take(query.Take ?? 20)
                .ToListAsync();
        }

    }
}
