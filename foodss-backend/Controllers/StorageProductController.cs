using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StorageSystem.Controllers.DTO;
using StorageSystem.Models;
using StorageSystem.Services;

namespace StorageSystem.Controllers
{

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/storage/{storageId}/product")]
    [ApiController]
    public class StorageProductController : Controller
    {
        private readonly StorageSystemContext context;

        private readonly UserService userService;

        private readonly StorageProductService productService;

        public StorageProductController(StorageSystemContext context, UserService userService, StorageProductService productService)
        {
            this.context = context;
            this.userService = userService;
            this.productService = productService;
        }

        public class ListQuery
        {
            public int? Skip { get; set; }
            public int? Take { get; set; }
            public bool? IncludeItems { get; set; }
        }

        [HttpGet]
        public async Task<ICollection<ProductDTO>> ListProducts(int storageId, [FromQuery]ListQuery query)
        {
            User user = await userService.GetUserAsync(this.User);

            ICollection<Product> products = await productService.ListProducts(user, storageId, query.Skip ?? 0, query.Take ?? 20);

            return products
                .Select(product => ProductDTO.FromModel(product, productService.ListVisibleItems(user, product.Items), query.IncludeItems ?? false))
                .ToList();
        }

        public class DetailsQuery
        {
            public bool? IncludeItems { get; set; }
        }

        [HttpGet("{id}")]
        public async Task<ProductDTO> DetailsProduct(int storageId, int id, [FromQuery]DetailsQuery query)
        {
            User user = await userService.GetUserAsync(this.User);

            Product product = await productService.GetProduct(user, storageId, id);

            var items = productService.ListVisibleItems(user, product.Items);

            return ProductDTO.FromModel(product, items, query.IncludeItems ?? false);
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
        public async Task<ICollection<ProductDTO>> SearchProducts(int storageId, [FromQuery]SearchQuery query)
        {
            User user = await userService.GetUserAsync(this.User);

            ICollection<Product> products = query.Barcode != null
                ? await productService.SearchProductsByBarcode(user, storageId, query.Barcode)
                : await productService.SearchProductsByName(user, storageId, query.Name, query.Skip ?? 0, query.Take ?? 20);

            return products
                .Select(product => ProductDTO.FromModel(product, productService.ListVisibleItems(user, product.Items), query.IncludeItems ?? false))
                .ToList();
        }

        [HttpPost]
        public async Task<ProductDTO> CreateProduct(int storageId, ProductInputDTO input)
        {
            User user = await userService.GetUserAsync(this.User);

            Product product = await productService.CreateProduct(
                user, 
                storageId, 
                input.Name, 
                input.Barcode, 
                input.HasExpiryDate, 
                input.MaxTemperature
            );

            return ProductDTO.FromModel(product);
        }

        [HttpDelete("{id}")]
        public async Task RemoveProduct(int storageId, int id)
        {
            User user = await userService.GetUserAsync(this.User);

            await productService.RemoveProduct(user, storageId, id);
        }
    }
}
