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
        public DbSet<Storage> Storages { get; set; }
        public DbSet<StorageInvitation> StorageInvitations { get; set; }
        public DbSet<StorageUser> StorageUsers { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserProductPreference> UserProductPreferences { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            StorageInvitation.OnModelCreating(modelBuilder);
            User.OnModelCreating(modelBuilder);
            UserProductPreference.OnModelCreating(modelBuilder);
            StorageUser.OnModelCreating(modelBuilder);
            ProductItem.OnModelCreating(modelBuilder);
        }
    }
}
