using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Controllers.DTO
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

        public static UserDTO FromModel(User model) => new UserDTO() { Id = model.Id, Name = model.Name, Email = model.Email };
    }

    public class UserSessionDTO : UserDTO
    {
        public string Token { get; set; }

        public static UserSessionDTO FromModel(User model, string token = null) => new UserSessionDTO() { Id = model.Id, Name = model.Name, Email = model.Email, Token = token };
    }

    public class UserRegistrationDTO
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
    }

    public class UserUpdateDTO
    {
        public string Name { get; set; }
        public string Password { get; set; }
    }
}
