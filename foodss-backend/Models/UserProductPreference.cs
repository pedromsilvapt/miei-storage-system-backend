using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StorageSystem.Models
{
    public class UserProductPreference
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        public int MinCount { get; set; }

        // Relations

        [InverseProperty("Preferences")]
        public User User { get; set; }

        [InverseProperty("Preferences")]
        public Product Product { get; set; }

        public static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserProductPreference>()
                .HasKey(user => new { user.UserId, user.ProductId });
        }
    }
}
