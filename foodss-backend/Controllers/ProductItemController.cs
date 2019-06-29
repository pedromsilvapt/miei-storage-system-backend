using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StorageSystem.Controllers.DTO;
using StorageSystem.Models;
using StorageSystem.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductItemController : Controller
    {
        private readonly StorageSystemContext context;

        private readonly UserService userService;
        private readonly ProductItemService itemService;
        private readonly StorageProductService storageProductService;

        public ProductItemController(StorageSystemContext context, UserService userService,
            ProductItemService itemService, StorageProductService storageProductService)
        {
            this.context = context;
            this.userService = userService;
            this.itemService = itemService;
            this.storageProductService = storageProductService;
        }

        [HttpGet("near-expiring-date")]
        public async Task<List<ProductItemDTO>> getProductsNearExpiringDate()
        {
            User user = await userService.GetUserAsync(this.User);

            ICollection<ProductItem> productItems = await itemService.ListProductItemsNearExpiringDate(user);

            return productItems.Select(ProductItemDTO.FromModel).ToList();
        }

        [HttpGet("all")]
        public async Task<List<ProductItemDTO>> GetRegisteredProductItems()
        {
            ICollection<ProductItem> productItems = await itemService.GetRegisteredProductItems();
            return productItems.Select(ProductItemDTO.FromModel).ToList();
        }

        [HttpGet("consumed")]
        public async Task<List<ConsumedProductItem>> GetConsumedProductItems()
        {
            return await itemService.GetConsumedProductItems();
        }

        [HttpGet("amount")]
        public async Task<int> GetProductsRegisteredAmount()
        {
            int amount = await itemService.GetProductsRegisteredAmount();
            return amount;
        }

        [HttpGet("amount-expiring")]
        public async Task<int> GetProductsExpiringAmount()
        {
            User user = await userService.GetUserAsync(this.User);
            return await itemService.GetProductsExpiringAmount(user);
        }

        [HttpGet("amount-expired")]
        public async Task<int> GetProductsExpiredAmount()
        {
            User user = await userService.GetUserAsync(this.User);
            return await itemService.GetProductsExpiredAmount(user);
        }
    }
}
