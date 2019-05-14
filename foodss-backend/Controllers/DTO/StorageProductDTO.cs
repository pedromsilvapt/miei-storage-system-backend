using System;
using StorageSystem.Models;
using System.Collections.Generic;
using System.Linq;

namespace StorageSystem.Controllers.DTO
{
    public class ProductInputDTO
    {
        public int Id { get; set; }
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

        public ICollection<ProductItemDTO> Items { get; set; }

        public static ProductDTO FromModel(Product model, ICollection<ProductItem> items = null, bool includeItems = false)
            => new ProductDTO()
            {
                Id = model.Id,
                Name = model.Name,
                Barcode = model.Barcode,
                StorageId = model.StorageId,
                MaxTemperature = model.MaxTemperature,
                Count = items?.Count(),
                ClosestExpiryDate = items?.Count > 0 ? items?.DefaultIfEmpty()?.Min(s => s.ExpiryDate) : null,
                Items = includeItems ? items?.Select(i => ProductItemDTO.FromModel(i))?.ToList() : null
            };
    }
}
