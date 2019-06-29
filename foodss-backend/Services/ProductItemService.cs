using Microsoft.EntityFrameworkCore;
using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Services
{
    public class ProductItemService
    {
        public StorageSystemContext Context { get; protected set; }

        public ProductItemService(StorageSystemContext context)
        {
            this.Context = context;
        }

        public async Task<List<ProductItem>> ListProductItemsNearExpiringDate(User user)
        {
            return await Context.ProductItems
                .Include(i => i.Product)
                .Where(l => l.OwnerId == user.Id && (l.ExpiryDate - DateTime.Now).TotalDays <= 7)
                .ToListAsync();
        }

        public async Task<List<ProductItem>> GetRegisteredProductItems()
        {
            return await Context.ProductItems.Include(i => i.Product).ToListAsync();
        }

        public async Task<List<ConsumedProductItem>> GetConsumedProductItems()
        {
            return await Context.ConsumedProductItems.ToListAsync();
        }

        public async Task<int> GetProductsRegisteredAmount()
        {
            return await Context.ProductItems.CountAsync();
        }

        public async Task<int> GetProductsExpiringAmount(User user)
        {
            if (user == null)
            {
                throw new UnauthorizedAccessException();
            }

            return await Context.ProductItems
                .Include(i => i.Product)
                .Where(l => l.OwnerId == user.Id && (l.ExpiryDate - DateTime.Now).TotalDays <= 7 && (l.ExpiryDate - DateTime.Now).TotalDays >= 0)
                .CountAsync();
        }

        public async Task<int> GetProductsExpiredAmount(User user)
        {
            if (user == null)
            {
                throw new UnauthorizedAccessException();
            }

            return await Context.ProductItems
                .Include(i => i.Product)
                .Where(l => l.OwnerId == user.Id && (l.ExpiryDate - DateTime.Now).TotalDays < 0)
                .CountAsync();
        }
    }
}
