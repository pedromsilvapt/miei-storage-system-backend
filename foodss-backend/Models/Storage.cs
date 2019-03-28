using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StorageSystem.Models
{
    public enum StorageType
    {
        Personal,
        Commercial
    }

    public class Storage
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        [Required]
        public StorageType Type { get; set; }
        [Required]
        public int OwnerId { get; set; }

        // Relations
        public User Owner { get; set; }

        [InverseProperty("Storage")]
        public ICollection<Product> Products { get; set; }

        [InverseProperty("Storage")]
        public ICollection<StorageUser> Users { get; set; }

        [InverseProperty("Storage")]
        public ICollection<ShoppingListItem> ShoppingListItems { get; set; }

        [InverseProperty("Storage")]
        public ICollection<StorageInvitation> Invitations { get; set; }
    }
}
