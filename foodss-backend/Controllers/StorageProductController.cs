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
using static StorageSystem.Controllers.StorageProductItemController;

namespace StorageSystem.Controllers
{

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/storage/{storageId}/product")]
    [ApiController]
    public class StorageProductController : Controller
    {
        public class ProductInputDTO
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Barcode { get; set; }
            public bool HasExpiryDate { get; set; }
            public double? MaxTemperature { get; set; }
        }

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

            public ICollection<ProductItemDTO> Items { get; set; }

            public static ProductDTO FromModel(Product model, ICollection<ProductItem> items = null, bool includeItems = false)
                => new ProductDTO()
                {
                    Id = model.Id,
                    Name = model.Name,
                    Barcode = model.Barcode,
                    HasExpiryDate = model.HasExpiryDate,
                    StorageId = model.StorageId,
                    MaxTemperature = model.MaxTemperature,
                    Count = items?.Count(),
                    ClosestExpiryDate = items?.Where(s => s.ExpiryDate != null)?.Min(s => s.ExpiryDate),
                    Items = includeItems ? items?.Select(i => ProductItemDTO.FromModel(i))?.ToList() : null
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
            public bool? IncludeItems { get; set; }
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
                .Select(product => ProductDTO.FromModel(product, ListVisibleItems(user, product.Items), query.IncludeItems ?? false))
                .ToListAsync();
        }

        public class DetailsQuery
        {
            public bool? IncludeItems { get; set; }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> DetailsProduct(int storageId, int id, [FromQuery]DetailsQuery query)
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

            ProductDTO product = await context.Products
               // Only retrieve the products that belong to this storage
               .Where(p => (p.StorageId == storage.Id) && (p.Id == id))
               // Join for each product it's items as well
               .Include(p => p.Items)
               .Select(p => ProductDTO.FromModel(p, ListVisibleItems(user, p.Items), query.IncludeItems ?? false))
               .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        public class SearchQuery
        {
            public int? Skip { get; set; }
            public int? Take { get; set; }
            public bool? IncludeItems { get; set; }
            public string Barcode { get; set; }
            public string Name { get; set; }
        }

        [HttpGet("search")]
        public async Task<ActionResult<ICollection<ProductDTO>>> SearchProducts(int storageId, [FromQuery]SearchQuery query)
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

            // Search by barcode has precedence: if a barcode is provided, only items that match that barcode are returned
            if (query.Barcode != null)
            {
                return await context.Products
                    .Where(p => (p.StorageId == storage.Id) && (p.Barcode == query.Barcode))
                    .Include(p => p.Items)
                    // Since there can be no two products with the same barcode, we can limit our search to one item only
                    .Take(1)
                    .Select(product => ProductDTO.FromModel(product, ListVisibleItems(user, product.Items), query.IncludeItems ?? false))
                    .ToListAsync();
            }
            else
            {
                return await context.Products
                    .Where(p => (p.StorageId == storage.Id) && p.Name.ToLower().Contains(query.Name.ToLower()))
                    .Include(p => p.Items)
                    // How many records to skip (defaults to 0)
                    .Skip(query.Skip ?? 0)
                    // How many records to return (defaults to 20)
                    .Take(query.Take ?? 20)
                    .Select(product => ProductDTO.FromModel(product, ListVisibleItems(user, product.Items), query.IncludeItems ?? false))
                    .ToListAsync();
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductDTO>> CreateProduct(int storageId, ProductInputDTO input)
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

            // If we try to invite an email already associated with an account...
            Product existingBarcode = await context.Products
                .Where(p => (p.StorageId == storage.Id) && (p.Barcode == input.Barcode))
                .FirstOrDefaultAsync();

            // Now the storage users are available through the property storage.Users
            if (existingBarcode != null)
            {
                return BadRequest(new { message = "Duplicated barcode." });
            }

            Product product = new Product()
            {
                StorageId = storage.Id,
                Name = input.Name,
                Barcode = input.Barcode,
                HasExpiryDate = input.HasExpiryDate,
                MaxTemperature = input.MaxTemperature
            };

            await context.Products.AddAsync(product);

            await context.SaveChangesAsync();

            return ProductDTO.FromModel(product);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveProduct(int storageId, int id)
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

            Product product = await context.Products
                .Where(i => (i.Id == id) && (i.StorageId == storage.Id))
                .Include(p => p.Items)
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            if (product.Items.Where(i => i.ConsumedDate != null).Count() > 0)
            {
                return BadRequest(new { message = "Cannot delete product: still has unconsumed items left." });
            }

            context.Products.Remove(product);

            await context.SaveChangesAsync();

            return Ok();
        }
    }
}
