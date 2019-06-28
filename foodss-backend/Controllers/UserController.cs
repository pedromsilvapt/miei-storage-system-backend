using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StorageSystem.Models;
using StorageSystem.Services;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using StorageSystem.Controllers.DTO;
using StorageSystem.Architecture;
using StorageSystem.Architecture.Exception;
using System.Collections.Generic;

namespace StorageSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly StorageSystemContext context;

        private readonly UserService userService;

        public UserController(StorageSystemContext context, UserService userService)
        {
            this.context = context;
            this.userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<UserDTO> Authenticate(CredentialsDTO credentials)
        {
            var result = await userService.AuthenticateCredentialsAsync(credentials.Email, credentials.Password);

            var (user, token) = result.Value;

            return UserSessionDTO.FromModel(user, token.RawData);
        }


        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<UserDTO> RegisterUser(UserRegistrationDTO user)
        {
            var userModel = await userService.Register(user.Email, user.Name, user.Password);

            return UserDTO.FromModel(userModel);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public async Task<UserDTO> UpdateUser(UserUpdateDTO user)
        {
            var userId = this.userService.GetUserId(this.User);

            var userModel = await userService.Update(userId, user.Name, user.Password);

            return UserDTO.FromModel(userModel);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("session")]
        public async Task<UserDTO> GetCurrentSession()
        {
            User user = await userService.GetUserAsync(this.User);

            return UserDTO.FromModel(user);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("invitation")]
        public async Task<ICollection<StorageInvitationDTO>> ListInvitations()
        {
            User user = await userService.GetUserAsync(this.User);

            List<StorageInvitation> invitations = await userService.ListInvitations(user);

            return invitations.Select(i => StorageInvitationDTO.FromModel(i)).ToList();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("invitation/{storage}/accept")]
        public async Task<StorageUserDTO> AcceptInvitation(int storage)
        {
            User user = await userService.GetUserAsync(this.User);

            StorageUser storageUser = await userService.AcceptInvitation(user, storage);

            return StorageUserDTO.FromModel(storageUser);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("invitation/{storage}/reject")]
        public async Task RejectInvitation(int storage)
        {
            User user = await userService.GetUserAsync(this.User);

            await userService.RejectInvitation(user, storage);
        }

        [AllowAnonymous]
        [HttpGet("{id}/verify/{code}")]
        public async Task<ActionResult> VerifyUser(int id, string code)
        {
            User user = await userService.VerifyUser(id, code);

            return View("ConfirmEmail");
        }
    }
}
