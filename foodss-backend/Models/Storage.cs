using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StorageSystem.Models
{
    public class Storage
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        [Required]
        public bool Shared { get; set; }
        [Required]
        public int OwnerId { get; set; }
        public int? CityId { get; set; }
        public DateTime? LastWeatherForecast { get; set; }
        public float? LastWeatherForecastTemperature { get; set; }

        // Relations
        public User Owner { get; set; }

        public City City { get; set; }

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
