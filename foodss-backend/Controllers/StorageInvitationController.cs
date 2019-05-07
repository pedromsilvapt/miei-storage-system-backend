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
    [Route("api/storage/{storageId}/invitation")]
    [ApiController]
    public class StorageInvitationController : Controller
    {
        private readonly StorageSystemContext context;

        private readonly UserService userService;

        private readonly StorageInvitationService invitationService;

        public StorageInvitationController(StorageSystemContext context, UserService userService, StorageInvitationService invitationService)
        {
            this.context = context;
            this.userService = userService;
            this.invitationService = invitationService;
        }

        [HttpGet]
        public async Task<ICollection<StorageInvitationDTO>> ListInvitations(int storageId)
        {
            User user = await userService.GetUserAsync(this.User);

            ICollection<StorageInvitation> invitations = await invitationService.ListInvitations(user, storageId);

            return invitations.Select(StorageInvitationDTO.FromModel).ToList();
        }

        [HttpPost]
        public async Task<StorageInvitationDTO> CreateInvitation(int storageId, StorageInvitationInputDTO input)
        {
            User user = await userService.GetUserAsync(this.User);

            StorageInvitation invitation = await invitationService.CreateInvitation(user, storageId, input.UserEmail);

            return StorageInvitationDTO.FromModel(invitation);
        }

        [HttpDelete("{email}")]
        public async Task RemoveInvitation(int storageId, string email)
        {
            User user = await userService.GetUserAsync(this.User);

            await invitationService.RemoveInvitation(user, storageId, email);
        }
    }
}
