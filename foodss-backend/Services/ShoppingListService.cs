using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.EntityFrameworkCore;
using StorageSystem.Architecture.Exception;
using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Services
{
    public class ShoppingListService
    {
    
        
        public StorageSystemContext Context { get; protected set; }

        public ShoppingListService(StorageSystemContext context)
        {
            this.Context = context;
        }

        public async Task<ShoppingListItem> UpdateShoppingListItem(ShoppingListItem shoppingListItem)
        {
            ShoppingListItem shoppingListItemPersisted = await Context.ShoppingListItems.FindAsync(shoppingListItem.Id);

            if (shoppingListItemPersisted == null)
            {
                throw new ShoppingListItemNotFoundException();
            }

            if (shoppingListItem.Count < 0)
            {
                throw new InvalidCountException();
            }

            shoppingListItemPersisted.Count = shoppingListItem.Count;
            Context.ShoppingListItems.Update(shoppingListItemPersisted);
            await Context.SaveChangesAsync();
            return shoppingListItemPersisted;
        }

        public async Task<List<ShoppingListItem>> ShoppingLists(int userId)
        {
            
            ICollection<int> listIds = await Context.ShoppingListItems
                    .Where(l => l.User.Id == userId)
                    .Select(l => l.Id)
                    .ToListAsync();

            return await Context.ShoppingListItems
                 .Include(i => i.Product)
                 .Include(a=>a.Storage)
                 .Include(b=>b.User)
                 .Where(p => p.OwnerId == userId || listIds.Contains(p.Id))
                 .ToListAsync();
        }

        public async Task DeleteShoppingListItem(int userId, int id)
        {
            ShoppingListItem shoppingListItem = await Context.ShoppingListItems.FindAsync(id);

            if (shoppingListItem == null)
            {
                throw new ShoppingListItemNotFoundException();
            }

            // Let's assume only the owner can delete a storage
            if (shoppingListItem.OwnerId != userId)
            {
                throw new UnauthorizedShoppingListAccessException();
            }

            Context.ShoppingListItems.Remove(shoppingListItem);

            await Context.SaveChangesAsync();
        }
    }
}
