using StorageSystem.Models;
using System.Collections.Generic;

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

        public static StorageDTO FromModel(Storage model) => new StorageDTO() { Id = model.Id, Name = model.Name, OwnerId = model.OwnerId, Shared = model.Shared };
    }
}
