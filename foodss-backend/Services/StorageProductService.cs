﻿using Microsoft.EntityFrameworkCore;
using StorageSystem.Architecture.Exception;
using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Services
{
    public class StorageProductService
    {
        public StorageSystemContext Context { get; protected set; }

        private readonly StorageService storageService;

        public StorageProductService(StorageSystemContext context, StorageService storageService)
        {
            this.Context = context;
            this.storageService = storageService;
        }

        public List<ProductItem> ListVisibleItems(User user, ICollection<ProductItem> items)
        {
            return items.Where(item => (item.Shared == true) || (item.OwnerId == user.Id)).ToList();
        }

        public async Task<ICollection<Product>> ListProducts(User user, Storage storage, int skip = 0, int take = 0)
        {
            return await Context.Products
                // Only retrieve the products that belong to this storage
                .Where(p => p.StorageId == storage.Id)
                // How many records to skip (defaults to 0)
                .Skip(skip)
                // How many records to return (defaults to 20)
                .Take(take)
                // Sort by name
                .OrderBy(product => product.Name)
                // Join for each product it's items as well
                .Include(p => p.Items)
                .ToListAsync();
        }

        public async Task<ICollection<Product>> ListProducts(User user, int storageId, int skip = 0, int take = 20)
        {
            Storage storage = await storageService.GetStorage(user.Id, storageId);

            return await ListProducts(user, storage, skip, take);
        }

        public async Task<Product> GetProduct(User user, int storageId, int id)
        {
            Storage storage = await storageService.GetStorage(user.Id, storageId);

            Product product = await Context.Products
               // Only retrieve the products that belong to this storage
               .Where(p => (p.StorageId == storage.Id) && (p.Id == id))
               // Join for each product it's items as well
               .Include(p => p.Items)
               .FirstOrDefaultAsync();

            if ((product == null) || (product.StorageId != storage.Id))
            {
                throw new ProductNotFoundException();
            }

            return product;
        }

        public async Task<ICollection<Product>> SearchProductsByBarcode(User user, int storageId, string barcode)
        {
            Storage storage = await storageService.GetStorage(user.Id, storageId);

            // When the string is null or empty, we don't need to query the database and can simply return an empty list
            if (barcode == null || barcode == "")
            {
                return new List<Product>();
            }

            return await Context.Products
                    .Where(p => (p.StorageId == storage.Id) && (p.Barcode == barcode))
                    .Include(p => p.Items)
                    // Since there can be no two products with the same barcode, we can limit our search to one item only
                    .Take(1)
                    .ToListAsync();
        }

        public async Task<ICollection<Product>> SearchProductsByName(User user, int storageId, string name, int skip = 0, int take = 20)
        {
            Storage storage = await storageService.GetStorage(user.Id, storageId);

            // When the string is null or empty, we don't need to query the database and can simply return an empty list
            if (name == null || name == "")
            {
                return new List<Product>();
            }

            return await Context.Products
                    .Where(p => (p.StorageId == storage.Id) && p.Name.ToLower().Contains(name.ToLower()))
                    .Include(p => p.Items)
                    // How many records to skip (defaults to 0)
                    .Skip(skip)
                    // How many records to return (defaults to 20)
                    .Take(take)
                    .ToListAsync();
        }

        public async Task<Product> CreateProduct(User user, int storageId, string name, string barcode, bool hasExpiryDate, double? maxTemperature)
        {
            Storage storage = await storageService.GetStorage(user.Id, storageId);

            // If we try to invite an email already associated with an account...
            Product existingBarcode = await Context.Products
                .Where(p => (p.StorageId == storage.Id) && (p.Barcode == barcode))
                .FirstOrDefaultAsync();

            // Now the storage users are available through the property storage.Users
            if (existingBarcode != null)
            {
                throw new DuplicatedBarcodeException();
            }

            Product product = new Product()
            {
                StorageId = storage.Id,
                Name = name,
                Barcode = barcode,
                HasExpiryDate = hasExpiryDate,
                MaxTemperature = maxTemperature
            };

            await Context.Products.AddAsync(product);

            await Context.SaveChangesAsync();

            return product;
        }

        public async Task RemoveProduct(User user, int storageId, int id)
        {
            Storage storage = await storageService.GetStorage(user.Id, storageId);

            Product product = await Context.Products
                .Where(i => (i.Id == id) && (i.StorageId == storage.Id))
                .Include(p => p.Items)
                .FirstOrDefaultAsync();

            if (product == null)
            {
                throw new ProductNotFoundException();
            }

            if (product.Items.Count() > 0)
            {
                throw new ProductRemovalException();
            }

            Context.Products.Remove(product);

            await Context.SaveChangesAsync();
        }
    }
}