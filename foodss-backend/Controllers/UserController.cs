using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StorageSystem.Models;
using StorageSystem.Services;

namespace StorageSystem.Controllers
{
    public class CredentialsDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UserDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }

        public static UserDTO FromModel(User model, string token = null) => new UserDTO() { Id = model.Id, Name = model.Name, Email = model.Email, Token = token };
    }

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
        public async Task<ActionResult<UserDTO>> Authenticate(CredentialsDTO credentials)
        {
            var result = await userService.AuthenticateCredentialsAsync(credentials.Email, credentials.Password);

            if (result == null)
            {
                return Unauthorized(new { message = "Wrong email or password." });
            }

            var (user, token) = result.Value;

            return UserDTO.FromModel(user, token.RawData);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("session")]
        public async Task<ActionResult<UserDTO>> GetCurrentSession()
        {
            User user = await userService.GetUserAsync(this.User);

            return UserDTO.FromModel(user);
        }
    }
}
