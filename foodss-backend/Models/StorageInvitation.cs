﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StorageSystem.Models
{
    public class StorageInvitation
    {
        [Required]
        public int StorageId { get; set; }
        [Required]
        [MaxLength(254)]
        [RegularExpression(@"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]
        public string UserEmail { get; set; }

        // Relations
        [InverseProperty("Invitations")]
        public Storage Storage { get; set; }

        [InverseProperty("Invitations")]
        public User User { get; set; }

        public static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StorageInvitation>()
                .HasOne<User>()
                .WithMany(u => u.Invitations)
                .HasPrincipalKey("Email")
                .HasForeignKey("UserEmail");

            modelBuilder.Entity<StorageInvitation>()
                .HasKey(invitation => new { invitation.StorageId, invitation.UserEmail });
        }
    }
}