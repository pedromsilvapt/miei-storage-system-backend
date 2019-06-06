using StorageSystem.Models;
using System.Collections.Generic;
using System.Linq;

namespace StorageSystem.Controllers.DTO
{
    // Used when creating/updating a storage, sent from the client to the server
    public class StorageInputDTO
    {
        public string Name { get; set; }

        public ICollection<StorageInvitationInputDTO> Invitations;
    }

    // Used when viewing one/many storage(s), sent from the server to the client
    public class StorageDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OwnerId { get; set; }
        public bool Shared { get; set; }

        public List<ProductDTO> Products;

        public static StorageDTO FromModel(Storage model, List<ProductDTO> products = null) => new StorageDTO() {
            Id = model.Id,
            Name = model.Name,
            OwnerId = model.OwnerId,
            Shared = model.Shared,
            Products = products
        };
    }
}
