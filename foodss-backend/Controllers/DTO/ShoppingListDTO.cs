using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Controllers.DTO
{
        // Used when creating the pdf file client to the server
        public class ShoppingListDTO
        {
            public int Id { get; set; }
            public int IdUser { get; set; }
            public int IdProduct { get; set; }
            public int Count { get; set; }
            public string ProductName { get; set; }
            public string StorageName { get; set; }

            public static ShoppingListDTO FromModel(ShoppingListItem model) => new ShoppingListDTO() { Id = model.Id, IdUser = model.User.Id, IdProduct = model.Product.Id, Count=model.Count, ProductName = model.Product.Name, StorageName = model.Storage.Name };

        }

    
}
