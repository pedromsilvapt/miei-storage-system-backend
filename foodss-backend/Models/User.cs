using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StorageSystem.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }
        [Required]
        [MaxLength(254)]
        [RegularExpression(@"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]
        public string Email { get; set; }
        [Required]
        [MaxLength(264)]
        public string Password { get; set; }
        [Required]
        [MaxLength(8)]
        public string Salt { get; set; }

        public ICollection<StorageInvitation> Invitations { get; set; }

        [InverseProperty("Owner")]
        public ICollection<ProductItem> Items { get; set; }

        [InverseProperty("User")]
        public ICollection<StorageUser> Storages { get; set; }

        [InverseProperty("User")]
        public ICollection<ShoppingListItem> ShoppingListItems { get; set; }

        [InverseProperty("User")]
        public ICollection<UserProductPreference> Preferences { get; set; }


        public static void OnModelCreating(ModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<User>();

            entity.HasAlternateKey("Email");
            entity.HasMany<StorageInvitation>()
                .WithOne(i => i.User)
                .HasForeignKey("UserEmail")
                .HasPrincipalKey("Email");
        }
    }
}
