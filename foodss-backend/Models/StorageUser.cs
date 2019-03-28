using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StorageSystem.Models
{
    public class StorageUser
    {
        [Required]
        public int UserId { get; set; }
        [Required]

        public int StorageId { get; set; }

        // Relations
        [InverseProperty("Storages")]
        public User User { get; set; }

        [InverseProperty("Users")]
        public Storage Storage { get; set; }

        public static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StorageUser>()
                .HasKey(storage => new { storage.StorageId, storage.UserId });
        }
    }
}
