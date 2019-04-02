using Microsoft.EntityFrameworkCore;
using StorageSystem.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Models
{
    public class Seeding
    {
        public static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(new[] {
                new User() { Id = 1, Name = "Pedro M. Silva", Email = "pedro@alunos.uminho.pt", Password = UserService.HashPassword("password", "123"), Salt = "123", Verified = true, VerificationCode = null },
                new User() { Id = 2, Name = "Gustavo Linhares", Email = "gustavo@alunos.uminho.pt", Password = UserService.HashPassword("password", "123"), Salt = "123", Verified = true, VerificationCode = null }
            });

            modelBuilder.Entity<StorageUser>().HasData(new[]{
                new StorageUser(){ UserId = 1, StorageId = 2 },
                new StorageUser(){ UserId = 2, StorageId = 2 },
                new StorageUser(){ UserId = 2, StorageId = 3 }
            });

            modelBuilder.Entity<Storage>().HasData(new[] {
                new Storage() { Id = 1, Name = "Despensa Privada", OwnerId = 1, Shared = true },
                new Storage() { Id = 2, Name = "Despensa Partilhada", OwnerId = 2, Shared = true },
                new Storage() { Id = 3, Name = "Despensa Partilhada", OwnerId = 2, Shared = false }
            });
        }
    }
}
