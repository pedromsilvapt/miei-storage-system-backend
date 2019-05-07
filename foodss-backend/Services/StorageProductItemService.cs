using Microsoft.EntityFrameworkCore;
using StorageSystem.Architecture.Exception;
using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Services
{
    public class StorageProductItemService
    {
        public StorageSystemContext Context { get; protected set; }

        private readonly StorageProductService productService;

        public StorageProductItemService(StorageSystemContext context, StorageProductService productService)
        {
            this.Context = context;
            this.productService = productService;
        }

        public bool CanUserSeeItem(User user, ProductItem item)
        {
            return (item.Shared == true) || (item.OwnerId == user.Id);
        }

        public async Task<ICollection<ProductItem>> ListProductItems(User user, int storageId, int productId, int skip = 0, int take = 0)
        {
            Product product = await productService.GetProduct(user, storageId, productId);

            return await Context.ProductItems
                .Where(p => (p.ProductId == product.Id) && CanUserSeeItem(user, p))
                // How many records to skip (defaults to 0)
                .Skip(skip)
                // How many records to return (defaults to 20)
                .Take(take)
                .ToListAsync();
        }

        public async Task<ProductItem> GetProductItem(User user, int storageId, int productId, int id)
        {
            Product product = await productService.GetProduct(user, storageId, productId);

            ProductItem item = await Context.ProductItems
                .Where(i => (i.Id == id) && (i.ProductId == product.Id))
                .FirstOrDefaultAsync();

            if (item == null)
            {
                throw new ProductNotFoundException();
            }

            if (!CanUserSeeItem(user, item))
            {
                throw new UnauthorizedStorageAccessException();
            }

            return item;
        }

        public async Task<ICollection<ProductItem>> CreateProductItem(User user, int storageId, int productId, bool shared, DateTime? expiryDate, int quantity)
        {
            Product product = await productService.GetProduct(user, storageId, productId);

            bool productHasExpiryDate = product.HasExpiryDate;
            bool itemHasExpiryDate = expiryDate != null;

            if (productHasExpiryDate != itemHasExpiryDate)
            {
                throw new ProductExpiryDateMismatchException();
            }

            var now = DateTime.Now;

            // Do not accept expiry dates that are before now
            if ((expiryDate != null) && (DateTime.Compare(expiryDate.Value, now) <= 0))
            {
                throw new ProductExpiryDateMismatchException();
            }

            ICollection<ProductItem> items = Enumerable.Range(0, quantity).Select(n => new ProductItem()
            {
                ProductId = product.Id,
                OwnerId = user.Id,
                Shared = shared,
                ExpiryDate = expiryDate,
                AddedDate = now,
                ConsumedDate = null
            }).ToList();

            await Context.ProductItems.AddRangeAsync(items);

            await Context.SaveChangesAsync();

            return items.ToList();
        }

        public async Task RemoveProductItem(User user, int storageId, int productId, int id)
        {
            ProductItem item = await GetProductItem(user, storageId, productId, id);

            Context.ProductItems.Remove(item);

            await Context.SaveChangesAsync();
        }
    }
}
