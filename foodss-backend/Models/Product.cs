using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StorageSystem.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }
        [MaxLength(200)]
        public string Barcode { get; set; }
        [Required]
        public bool HasExpiryDate { get; set; }
        [Required]
        public int StorageId { get; set; }

        // Relations

        [InverseProperty("Products")]
        public Storage Storage { get; set; }

        [InverseProperty("Product")]
        public ICollection<ProductItem> Items { get; set; }

        [InverseProperty("Product")]
        public ICollection<ShoppingListItem> ShoppingListItems { get; set; }

        [InverseProperty("Product")]
        public ICollection<UserProductPreference> Preferences { get; set; }
    }
}
