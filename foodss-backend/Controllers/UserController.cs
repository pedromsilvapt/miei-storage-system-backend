using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StorageSystem.Models;
using StorageSystem.Services;
using System.Linq;
using Microsoft.EntityFrameworkCore;

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

    public class UserRegistrationDTO
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
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


        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> RegisterUser(UserRegistrationDTO user)
        {
            try
            {
                var userModel = await userService.Register(user.Email, user.Name, user.Password);

                return UserDTO.FromModel(userModel);
            }
            catch (ExistingEmailException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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
