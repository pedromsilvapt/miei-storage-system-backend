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

        public StorageController(StorageSystemContext context, UserService userService, StorageService storageService)
        {
            this.context = context;
            this.userService = userService;
            this.storageService = storageService;
        }

        [HttpGet]
        public async Task<ICollection<StorageDTO>> GetStorages()
        {
            int userId = userService.GetUserId(this.User);

            ICollection<Storage> storages = await storageService.ListStoragesForUser(userId);

            return storages
                .Select(StorageDTO.FromModel)
                .ToList();
        }

        [HttpGet("{id}")]
        public async Task<StorageDTO> FindStorageById(int id)
        {
            int userId = userService.GetUserId(this.User);

            Storage storage = await storageService.GetStorage(userId, id);

            return StorageDTO.FromModel(storage);
        }

        [HttpPost]
        public async Task<StorageDTO> CreateStorage(StorageInputDTO storageInput)
        {
            User user = await userService.GetUserAsync(this.User);

            ICollection<string> invitations = storageInput.Invitations
                ?.Select(invitation => invitation.UserEmail)
                ?.ToList();

            Storage storage = await storageService.CreateStorage(user, storageInput.Name, invitations);

            return StorageDTO.FromModel(storage);
        }

        [HttpPost("{id}")]
        public async Task<StorageDTO> UpdateStorage(int id, StorageInputDTO storageInput)
        {
            int userId = userService.GetUserId(this.User);

            Storage storage = await storageService.UpdateStorage(userId, id, storageInput.Name);

            return StorageDTO.FromModel(storage);
        }

        [HttpDelete("{id}")]
        public async Task DeleteStorage(int id)
        {
            int userId = userService.GetUserId(this.User);

            await storageService.DeleteStorage(userId, id);
        }
    }
}
