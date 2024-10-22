﻿using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StorageSystem.Models
{
    public class ConsumedProductItem
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        public int OwnerId { get; set; }
        [Required]
        public bool Shared { get; set; }
        public DateTime ExpiryDate { get; set; }
        [Required]
        public DateTime AddedDate { get; set; }
        public DateTime ConsumedDate { get; set; }

        // Relations
        [InverseProperty("ConsumedItems")]
        public User Owner { get; set; }

        [InverseProperty("ConsumedItems")]
        public Product Product { get; set; }
    }
}
