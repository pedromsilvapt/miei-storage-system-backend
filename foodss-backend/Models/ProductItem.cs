﻿using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StorageSystem.Models
{
    public class ProductItem
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
        public int AvailableCount { get; set; }
        public int ConsumedCount { get; set; }

        // Relations
        [InverseProperty("Items")]
        public User Owner { get; set; }

        [InverseProperty("Items")]
        public Product Product { get; set; }

        public static void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Unfortunately we cannot set a default value with annotations
            modelBuilder.Entity<ProductItem>().Property(p => p.ConsumedCount).HasDefaultValue(0);
        }
    }
}