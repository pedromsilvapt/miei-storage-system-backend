using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StorageSystem.Architecture.Exception;
using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace StorageSystem.Services
{
    public class UserService
    {
        private StorageSystemContext context;

        private IConfiguration configuration;

        private readonly EmailService emailService;

        public UserService(IConfiguration configuration, StorageSystemContext context, EmailService emailService)
        {
            this.configuration = configuration;
            this.context = context;
            this.emailService = emailService;
        }

        public static (string, string) HashPassword(string password)
        {
            // Generate a random string with six characters
            string salt = Guid.NewGuid().ToString().Substring(0, 6);

            string hashed = HashPassword(password, salt);

            return (hashed, salt);
        }

        public static string HashPassword(string password, string salt)
        {
            using (SHA256 mySHA256 = SHA256.Create())
            {
                var salted = Encoding.UTF8.GetBytes(salt + password);

                var hashed = mySHA256.ComputeHash(salted);

                return Convert.ToBase64String(hashed);
            }
        }

        public async Task<User> Register(string email, string name, string password)
        {
            var existingUser = await context.Users.Where(user => user.Email == email).FirstOrDefaultAsync();

            if (existingUser != null)
            {
                throw new ExistingEmailException();
            }

            var (hashed, salt) = HashPassword(password);
            string code = EmailService.GenerateCode();
            var newUser = new User() { Name = name, Email = email, Password = hashed, Salt = salt, VerificationCode=code };

            await context.AddAsync(newUser);
            
            await context.SaveChangesAsync();

            emailService.SendEmail(email, name, "Ativação de Conta", "Confirme o seu endereço de email clicando na ligação : " + emailService.GetBaseUrl() + "/api/User/" + newUser.Id+ "/verify/"+code);

            return newUser;
        }

        public async Task<List<StorageInvitation>> ListInvitations(User user)
        {
            return await context.StorageInvitations
                .Where(invitation => invitation.UserEmail == user.Email)
                .Include(invitation => invitation.Storage)
                .ToListAsync();
        }

        public async Task<User> VerifyUser(int id, string code)
        {
            User user = await context.Users
                .Where(u => (u.Id == id) && (u.Verified == false) && (u.VerificationCode == code))
                .FirstOrDefaultAsync();

            if (user == null)
            {
                throw new UserNotFoundException();
            }

            user.VerificationCode = null;
            user.Verified = true;

            context.Update(user);

            await context.SaveChangesAsync();

            return user;
        }

        public async Task<(User, JwtSecurityToken)?> AuthenticateCredentialsAsync(string email, string password)
        {
            var user = await context.Users.Where(u => u.Email == email).FirstOrDefaultAsync();

            if (user == null)
            {
                throw new IncorrectEmailOrPasswordException();
            }
            else if (HashPassword(password, user.Salt) != user.Password)
            {
                throw new IncorrectEmailOrPasswordException();
            }
            else if (!user.Verified)
            {
                throw new EmailNotVerifiedException();
            }

            var secret = configuration.GetValue<string>("Security:JwtSecret");

            // A whole lot of mumbo jumbo required to create a JsonWebToken
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            return (user, tokenHandler.CreateJwtSecurityToken(tokenDescriptor));
        }

        public int? TryGetUserId(ClaimsPrincipal claims)
        {
            Claim claim = claims.FindFirst(ClaimTypes.NameIdentifier);

            if (claim != null)
            {
                return int.Parse(claim.Value);
            }
            else
            {
                return null;
            }
        }

        public int GetUserId(ClaimsPrincipal claims)
        {
            return int.Parse(claims.FindFirstValue(ClaimTypes.NameIdentifier));
        }

        public Task<User> GetUserAsync(ClaimsPrincipal claims)
        {
            var id = GetUserId(claims);

            return context.Users.FindAsync(id);
        }
    }
}
