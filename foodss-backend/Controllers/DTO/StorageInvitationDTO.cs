using System;
using StorageSystem.Models;
using System.Collections.Generic;

namespace StorageSystem.Controllers.DTO
{
    public class StorageInvitationInputDTOComparer : IEqualityComparer<StorageInvitationInputDTO>
    {
        public bool Equals(StorageInvitationInputDTO x, StorageInvitationInputDTO y)
        {
            return String.Equals(x.UserEmail, y.UserEmail);
        }

        public int GetHashCode(StorageInvitationInputDTO obj)
        {
            return obj.UserEmail.GetHashCode();
        }
    }

    public class StorageInvitationInputDTO
    {
        public string UserEmail { get; set; }
    }

    public class StorageInvitationDTO
    {
        public int StorageId { get; set; }
        public int AuthorId { get; set; }
        public string UserEmail { get; set; }
        public UserDTO Author { get; set; }
        public UserDTO User { get; set; }
        public StorageDTO Storage { get; set; }

        public static StorageInvitationDTO FromModel(StorageInvitation model, User user = null)
            => new StorageInvitationDTO() {
                StorageId = model.StorageId,
                AuthorId = model.AuthorId,
                UserEmail = model.UserEmail,
                User = user != null ? UserDTO.FromModel(user) : null,
                Storage = model.Storage != null ? StorageDTO.FromModel(model.Storage) : null,
                Author = model.Author != null ? UserDTO.FromModel(model.Author) : null
            };
    }
}
