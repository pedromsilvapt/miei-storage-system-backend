using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
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
    public class ExistingEmailException : Exception
    {
        public ExistingEmailException(string email) : base("Email is already registerd: " + email) { }
    }

    public class UserService
    {
        private StorageSystemContext context;

        private IConfiguration configuration;

        public UserService(IConfiguration configuration, StorageSystemContext context)
        {
            this.configuration = configuration;
            this.context = context;
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

                return Encoding.UTF8.GetString(hashed);
            }
        }

        public async Task<User> Register(string email, string name, string password)
        {
            var existingUser = await context.Users.Where(user => user.Email == email).FirstOrDefaultAsync();

            if (existingUser != null)
            {
                throw new ExistingEmailException(email);
            }

            var (hashed, salt) = HashPassword(password);

            var newUser = new User() { Name = name, Email = email, Password = hashed, Salt = salt };

            await context.AddAsync(newUser);
            
            await context.SaveChangesAsync();

            return newUser;
        }

        public async Task<(User, JwtSecurityToken)?> AuthenticateCredentialsAsync(string email, string password)
        {
            var user = await context.Users
                .Where(u => u.Email == email)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return null;
            }

            // Validate the password
            if (HashPassword(password, user.Salt) != user.Password)
            {
                return null;
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
