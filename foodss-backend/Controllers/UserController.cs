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
        public async Task<ActionResult<UserDTO>> Authenticate(CredentialsDTO credentials)
        {
            var result = await userService.AuthenticateCredentialsAsync(credentials.Email, credentials.Password);

            var (user, token) = result.Value;

            return UserSessionDTO.FromModel(user, token.RawData);
        }


        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> RegisterUser(UserRegistrationDTO user)
        {
            var userModel = await userService.Register(user.Email, user.Name, user.Password);

            return UserDTO.FromModel(userModel);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("session")]
        public async Task<ActionResult<UserDTO>> GetCurrentSession()
        {
            User user = await userService.GetUserAsync(this.User);

            return UserDTO.FromModel(user);
        }

        [AllowAnonymous]
        [HttpGet("{id}/verify/{code}")]
        public async Task<ActionResult<UserDTO>> VerifyUser(int id, string code)
        {
            User user = await context.Users
                .Where(u => (u.Id == id) && (u.Verified == false) && (u.VerificationCode == code))
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return BadRequest();
            }

            user.VerificationCode = null;
            user.Verified = true;

            context.Update(user);

            await context.SaveChangesAsync();

            return UserDTO.FromModel(user);
        }
    }
}
