using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.EntityFrameworkCore;
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
    }
}
