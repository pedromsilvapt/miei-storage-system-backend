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
    [Route("api/storage/{storageId}/product/{productId}/consumed")]
    [ApiController]
    public class StorageConsumedProductItemController : Controller
    {
        private readonly StorageSystemContext context;

        private readonly UserService userService;

        private readonly StorageConsumedProductItemService itemService;

        public StorageConsumedProductItemController(StorageSystemContext context, UserService userService, StorageConsumedProductItemService itemService)
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
        public async Task<ICollection<ProductItemDTO>> ListConsumedProductItems(int storageId, int productId, [FromQuery]ListQuery query)
        {
            User user = await userService.GetUserAsync(this.User);

            ICollection<ConsumedProductItem> items = await itemService.ListConsumedProductItems(user, storageId, productId, query.Skip ?? 0, query.Take ?? 20);

            return items
                .Select(ProductItemDTO.FromModel)
                .ToList();
        }

        [HttpGet("{id}")]
        public async Task<ProductItemDTO> DetailsConsumedProductItem(int storageId, int productId, int id)
        {
            User user = await userService.GetUserAsync(this.User);

            ConsumedProductItem item = await itemService.GetConsumedProductItem(user, storageId, productId, id);

            return ProductItemDTO.FromModel(item);
        }

        [HttpDelete("{id}")]
        public async Task RemoveConsumedProductItem(int storageId, int productId, int id)
        {
            User user = await userService.GetUserAsync(this.User);

            await itemService.RemoveConsumedProductItem(user, storageId, productId, id);
        }
    }
}
