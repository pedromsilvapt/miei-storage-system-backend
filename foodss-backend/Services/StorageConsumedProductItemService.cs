using Microsoft.EntityFrameworkCore;
using StorageSystem.Architecture.Exception;
using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Services
{
    public class StorageConsumedProductItemService
    {
        public StorageSystemContext Context { get; protected set; }

        private readonly StorageProductService productService;

        private readonly StorageService storageService;


        public StorageConsumedProductItemService(StorageSystemContext context, StorageProductService productService, StorageService storageService)
        {
            this.Context = context;
            this.productService = productService;
            this.storageService = storageService;
        }

        public bool CanUserSeeItem(User user, ConsumedProductItem item)
        {
            return (item.Shared == true) || (item.OwnerId == user.Id);
        }

        public async Task<ICollection<ConsumedProductItem>> ListConsumedProductItems(User user, int storageId, int productId, int skip = 0, int take = 0)
        {
            Product product = await productService.GetProduct(user, storageId, productId);

            return await Context.ConsumedProductItems
                .Where(p => (p.ProductId == product.Id) && CanUserSeeItem(user, p))
                // How many records to skip (defaults to 0)
                .Skip(skip)
                // How many records to return (defaults to 20)
                .Take(take)
                .ToListAsync();
        }

        public async Task<ICollection<ConsumedProductItem>> ListConsumedItems(User user, int storageId, int skip = 0, int take = 0)
        {
            Storage storage = await storageService.GetStorage(user.Id, storageId);

            return await Context.ConsumedProductItems
                .Where(p => CanUserSeeItem(user, p))
                // How many records to skip (defaults to 0)
                .Skip(skip)
                // How many records to return (defaults to 20)
                .Take(take)
                .ToListAsync();
        }

        public async Task<ConsumedProductItem> GetConsumedProductItem(User user, int storageId, int productId, int id)
        {
            Product product = await productService.GetProduct(user, storageId, productId);

            ConsumedProductItem item = await Context.ConsumedProductItems
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

        public async Task RemoveConsumedProductItem(User user, int storageId, int productId, int id)
        {
            ConsumedProductItem item = await GetConsumedProductItem(user, storageId, productId, id);

            Context.ConsumedProductItems.Remove(item);

            await Context.SaveChangesAsync();
        }
    }
}
