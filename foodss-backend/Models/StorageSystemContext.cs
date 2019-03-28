using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace StorageSystem.Models
{
    public class StorageSystemContext : DbContext
    {
        public StorageSystemContext(DbContextOptions<StorageSystemContext> options)
            : base(options)
        { }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductItem> ProductItems { get; set; }
        public DbSet<ShoppingListItem> ShoppingListItems { get; set; }
        public DbSet<Storage> Storage { get; set; }
        public DbSet<StorageInvitation> StorageInvitation { get; set; }
        public DbSet<StorageUser> StorageUser { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<UserProductPreferences> UserProductPreferences { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            Models.StorageInvitation.OnModelCreating(modelBuilder);
            Models.User.OnModelCreating(modelBuilder);
            Models.UserProductPreferences.OnModelCreating(modelBuilder);
            Models.StorageUser.OnModelCreating(modelBuilder);
            Models.ProductItem.OnModelCreating(modelBuilder);
        }
    }
}
