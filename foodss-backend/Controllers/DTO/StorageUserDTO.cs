using StorageSystem.Models;
using System.Collections.Generic;
using System.Linq;

namespace StorageSystem.Controllers.DTO
{
    // Used when viewing one/many storage(s), sent from the server to the client
    public class StorageUserDTO
    {
        public int StorageId { get; set; }
        public int UserId { get; set; }
        
        public static StorageUserDTO FromModel(StorageUser model) => new StorageUserDTO() {
            StorageId = model.StorageId,
            UserId = model.UserId
        };
    }
}
