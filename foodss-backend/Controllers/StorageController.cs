using System;
using System.Collections.Generic;
using System.Linq;
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
    [Route("api/[controller]")]
    [ApiController]
    public class StorageController : Controller
    {
        private readonly StorageSystemContext context;

        private readonly UserService userService;

        private readonly StorageService storageService;

        private readonly StorageProductService productService;

        public StorageController(StorageSystemContext context, UserService userService, StorageService storageService, StorageProductService productService)
        {
            this.context = context;
            this.userService = userService;
            this.storageService = storageService;
            this.productService = productService;
        }

        public class ListQuery
        {
            public int? SkipProducts { get; set; }
            public int? TakeProducts { get; set; }
            public bool? IncludeProducts { get; set; }
        }

        [HttpGet]
        public async Task<ICollection<StorageDTO>> ListStorages([FromQuery] ListQuery query)
        {
            User user = await userService.GetUserAsync(this.User);

            ICollection<Storage> storages = await storageService.ListStorages(user.Id);

            bool includeProducts = query.IncludeProducts ?? false;

            if (includeProducts)
            {
                // This will execute N + 1 queries. The implications of such thing are understood, and a conscious decision to
                // make it this way was made. This because we want to select only N products for each storage, and doing so would
                // be hard, and non-idiomatic in the context of the ORM used throughout the application (EF Core)
                foreach (Storage storage in storages)
                {
                    storage.Products = await productService.ListProducts(user, storage, query.SkipProducts ?? 0, query.TakeProducts ?? int.MaxValue);
                }
            }

            return storages
                .Select(storage => StorageDTO.FromModel(
                    storage,
                    includeProducts
                        ? storage.Products?.Select(p => ProductDTO.FromModel(p, productService.ListVisibleItems(user, p.Items), includeProducts))?.ToList()
                        : null
                ))
                .ToList();
        }

        public class DetailsQuery
        {
            public bool? IncludeProducts { get; set; }
            public bool? IncludeOwner { get; set; }
            public bool? IncludeCity { get; set; }
        }

        [HttpGet("{id}")]
        public async Task<StorageDTO> FindStorageById(int id, [FromQuery] DetailsQuery query)
        {
            User user = await userService.GetUserAsync(this.User);

            Storage storage = await storageService.GetStorage(user.Id, id, query.IncludeOwner ?? false, query.IncludeCity ?? false);

            bool includeProducts = query.IncludeProducts ?? false;

            if (includeProducts)
            {
                storage.Products = await productService.ListProducts(user, storage, 0, int.MaxValue);
            }

            return StorageDTO.FromModel(
                storage, 
                includeProducts
                        ? storage.Products?.Select(p => ProductDTO.FromModel(p, productService.ListVisibleItems(user, p.Items), includeProducts))?.ToList()
                        : null
            );
        }

        [HttpGet("weather")]
        public async Task<List<ProductDTO>> FindStorageWeatherReport()
        {
            int userId = userService.GetUserId(this.User);
            List<StorageDTO> Storageweather = new List<StorageDTO>();
           ICollection <Storage> storages = await storageService.ListStorages(userId);

            List<Product> products = await storageService.GetStorageWeatherReport(storages);
           
            return products.Select(p=>ProductDTO.FromModel(p)).ToList();

        }

        [HttpPost]
        public async Task<StorageDTO> CreateStorage(StorageInputDTO storageInput)
        {
            User user = await userService.GetUserAsync(this.User);

            ICollection<string> invitations = storageInput.Invitations
                ?.Select(invitation => invitation.UserEmail)
                ?.ToList();

            Storage storage = await storageService.CreateStorage(user, storageInput.Name, invitations, storageInput.City?.Id);

            return StorageDTO.FromModel(storage);
        }

        [HttpPost("{id}")]
        public async Task<StorageDTO> UpdateStorage(int id, StorageInputDTO storageInput)
        {
            int userId = userService.GetUserId(this.User);

            Storage storage = await storageService.UpdateStorage(userId, id, storageInput.Name, storageInput.City?.Id);

            return StorageDTO.FromModel(storage);
        }

        [HttpDelete("{id}")]
        public async Task DeleteStorage(int id)
        {
            int userId = userService.GetUserId(this.User);

            await storageService.DeleteStorage(userId, id);
        }

        [HttpGet("{id}/user")]
        public async Task<ICollection<UserDTO>> ListUsers(int id)
        {
            User user = await userService.GetUserAsync(this.User);

            List<User> users = await storageService.ListStorageUsers(user.Id, id);

            return users
                .Select(u => UserDTO.FromModel(u))
                .ToList();
        }

        [HttpDelete("{id}/user/{member}")]
        public async Task DeleteUser(int id, int member)
        {
            User user = await userService.GetUserAsync(this.User);

            await storageService.DeleteStorageUser(user.Id, id, member);
        }
    }
}
