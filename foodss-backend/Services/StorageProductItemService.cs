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
            Product product = await productService.GetProduct(user, storageId, productId, false);

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
            Product product = await productService.GetProduct(user, storageId, productId, false);

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

        public async Task<ICollection<ProductItem>> CreateProductItem(User user, int storageId, int productId, bool shared, DateTime expiryDate, int quantity)
        {
            expiryDate = expiryDate
                // Get only the "date" part of the DateTime (so hours, minutes and seconds are all zero)
                .Date
                // Then go to (the start of) the next day
                .AddDays(1)
                // And finally go back one tick (the smallest time unite represented in a DateTime) to and up with
                // The very end of the day of the expiry date
                .AddTicks(-1);

            Product product = await productService.GetProduct(user, storageId, productId);

            var now = DateTime.Now;

            // Do not accept expiry dates that are before now
            if ((expiryDate != null) && (DateTime.Compare(expiryDate, now) <= 0))
            {
                throw new ProductExpiryDateMismatchException();
            }

            ICollection<ProductItem> items = Enumerable.Range(0, quantity).Select(n => new ProductItem()
            {
                ProductId = product.Id,
                OwnerId = user.Id,
                Shared = shared,
                ExpiryDate = expiryDate,
                AddedDate = now
            }).ToList();

            await Context.ProductItems.AddRangeAsync(items);

            await Context.SaveChangesAsync();

            return items.ToList();
        }

        public async Task<ConsumedProductItem> ConsumeProductItem(User user, int storageId, int productId, int id)
        {
            ProductItem item = await GetProductItem(user, storageId, productId, id);

            ConsumedProductItem consumedItem = new ConsumedProductItem()
            {
                ProductId = item.ProductId,
                OwnerId = item.OwnerId,
                Shared = item.Shared,
                ExpiryDate = item.ExpiryDate,
                AddedDate = item.AddedDate,
                ConsumedDate = DateTime.Now
            };

            using (var transaction = await Context.Database.BeginTransactionAsync())
            {
                Context.ProductItems.Remove(item);

                await Context.ConsumedProductItems.AddAsync(consumedItem);

                await Context.SaveChangesAsync();

                transaction.Commit();
            }

            return consumedItem;
        }

        public async Task RemoveProductItem(User user, int storageId, int productId, int id)
        {
            ProductItem item = await GetProductItem(user, storageId, productId, id);

            Context.ProductItems.Remove(item);

            await Context.SaveChangesAsync();
        }
    }
}
