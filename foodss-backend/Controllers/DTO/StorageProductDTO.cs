using System;
using StorageSystem.Models;
using System.Collections.Generic;
using System.Linq;

namespace StorageSystem.Controllers.DTO
{
    public class ProductInputDTO
    {
        public string Name { get; set; }
        public string Barcode { get; set; }
        public double? MaxTemperature { get; set; }
    }

    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Barcode { get; set; }
        public int StorageId { get; set; }
        public double? MaxTemperature { get; set; }
        public int? Count { get; set; }
        public DateTime? ClosestExpiryDate { get; set; }

        public int? SharedCount { get; set; }
        public DateTime? SharedClosestExpiryDate { get; set; }

        public int? PrivateCount { get; set; }
        public DateTime? PrivateClosestExpiryDate { get; set; }

        public ICollection<ProductItemDTO> Items { get; set; }

        public static ProductDTO FromModel(Product model, ICollection<ProductItem> items = null, bool includeItems = false)
        {
            int? count = null;
            int? sharedCount = null;
            int? privateCount = null;
            DateTime? closestExpiryDate = null;
            DateTime? sharedClosestExpiryDate = null;
            DateTime? privateClosestExpiryDate = null;
            
            if (items != null)
            {
                sharedCount = 0;
                privateCount = 0;

                foreach (ProductItem item in items)
                {
                    if (item.Shared)
                    {
                        sharedCount++;

                        if (sharedClosestExpiryDate == null || item.ExpiryDate < sharedClosestExpiryDate.Value)
                        {
                            sharedClosestExpiryDate = item.ExpiryDate;
                        }
                    }
                    else
                    {
                        privateCount++;

                        if (privateClosestExpiryDate == null || item.ExpiryDate < privateClosestExpiryDate.Value)
                        {
                            privateClosestExpiryDate = item.ExpiryDate;
                        }
                    }
                }

                count = sharedCount + privateCount;
                
                if (privateClosestExpiryDate != null && (closestExpiryDate == null || privateClosestExpiryDate.Value < closestExpiryDate.Value))
                {
                    closestExpiryDate = privateClosestExpiryDate;
                }

                if (sharedClosestExpiryDate != null)
                {
                    closestExpiryDate = sharedClosestExpiryDate;
                }
            }

            return new ProductDTO()
            {
                Id = model.Id,
                Name = model.Name,
                Barcode = model.Barcode,
                StorageId = model.StorageId,
                MaxTemperature = model.MaxTemperature,

                Count = count,
                ClosestExpiryDate = closestExpiryDate,

                SharedCount = sharedCount,
                SharedClosestExpiryDate = sharedClosestExpiryDate,

                PrivateCount = privateCount,
                PrivateClosestExpiryDate = privateClosestExpiryDate,

                Items = includeItems ? items?.Select(i => ProductItemDTO.FromModel(i))?.ToList() : null
            };
        }
    }
}
