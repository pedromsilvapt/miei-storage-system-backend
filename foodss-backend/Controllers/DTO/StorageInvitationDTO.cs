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
        public string UserEmail { get; set; }
        public UserDTO User { get; set; }

        public static StorageInvitationDTO FromModel(StorageInvitation model)
            => new StorageInvitationDTO() { StorageId = model.StorageId, UserEmail = model.UserEmail, User = model.User != null ? UserDTO.FromModel(model.User) : null };
    }
}
