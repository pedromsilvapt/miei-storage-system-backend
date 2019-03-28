using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StorageSystem.Models
{
    public class ShoppingListItem
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int StorageId { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        public int OwnerId { get; set; }
        [Required]
        public int Count { get; set; }

        // Relations
        [InverseProperty("ShoppingListItems")]
        public Storage Storage { get; set; }

        [InverseProperty("ShoppingListItems")]
        public Product Product { get; set; }

        [InverseProperty("ShoppingListItems")]
        public User User { get; set; }
    }
}
