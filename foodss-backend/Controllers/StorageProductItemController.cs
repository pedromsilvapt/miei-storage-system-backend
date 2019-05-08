using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StorageSystem.Controllers.DTO;
using StorageSystem.Models;
using StorageSystem.Services;

namespace StorageSystem.Controllers
{

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/storage/{storageId}/product/{productId}/item")]
    [ApiController]
    public class StorageProductItemController : Controller
    {
        private readonly StorageSystemContext context;

        private readonly UserService userService;

        private readonly StorageProductItemService itemService;

        public StorageProductItemController(StorageSystemContext context, UserService userService, StorageProductItemService itemService)
        {
            this.context = context;
            this.userService = userService;
            this.itemService = itemService;
        }

        protected async Task<Product> GetProduct(int productId)
        {
            return await context.Products
                .Where(p => p.Id == productId)
                .FirstOrDefaultAsync();
        }

        public class ListQuery
        {
            public int? Skip { get; set; }
            public int? Take { get; set; }
        }

        [HttpGet]
        public async Task<ICollection<ProductItemDTO>> ListProductItems(int storageId, int productId, [FromQuery]ListQuery query)
        {
            User user = await userService.GetUserAsync(this.User);

            ICollection<ProductItem> items = await itemService.ListProductItems(user, storageId, productId, query.Skip ?? 0, query.Take ?? 20);

            return items
                .Select(ProductItemDTO.FromModel)
                .ToList();
        }

        [HttpGet("{id}")]
        public async Task<ProductItemDTO> DetailsProductItem(int storageId, int productId, int id)
        {
            User user = await userService.GetUserAsync(this.User);

            ProductItem item = await itemService.GetProductItem(user, storageId, productId, id);

            return ProductItemDTO.FromModel(item);
        }

        [HttpPost]
        public async Task<ICollection<ProductItemDTO>> CreateProductItem(int storageId, int productId, ProductItemInputDTO input)
        {
            User user = await userService.GetUserAsync(this.User);

            ICollection<ProductItem> items = await itemService.CreateProductItem(user, storageId, productId, input.Shared, input.ExpiryDate, input.Quantity ?? 1);

            return items.Select(ProductItemDTO.FromModel).ToList();
        }

        [HttpPost("{id}/consume")]
        public async Task<ProductItemDTO> ConsumeProductItem (int storageId, int productId, int id)
        {
            User user = await userService.GetUserAsync(this.User);

            ConsumedProductItem item = await itemService.ConsumeProductItem(user, storageId, productId, id);

            return ProductItemDTO.FromModel(item);
        }

        [HttpDelete("{id}")]
        public async Task RemoveProductItem(int storageId, int productId, int id)
        {
            User user = await userService.GetUserAsync(this.User);

            await itemService.RemoveProductItem(user, storageId, productId, id);
        }
    }
}
