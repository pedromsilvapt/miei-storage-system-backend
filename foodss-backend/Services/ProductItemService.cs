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
                .Where(l => l.OwnerId == user.Id && (DateTime.Now - l.ExpiryDate).TotalDays <= 7)
                .ToListAsync();
        }
    }
}
