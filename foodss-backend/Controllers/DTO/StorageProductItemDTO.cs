using System;
using StorageSystem.Models;
using System.ComponentModel.DataAnnotations;

namespace StorageSystem.Controllers.DTO
{
    public class ProductItemInputDTO
    {
        public bool Shared { get; set; }

        public DateTime ExpiryDate { get; set; }
        [Range(1, int.MaxValue)]
        public int? Quantity { get; set; }
    }

    public class ProductItemDTO
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int OwnerId { get; set; }
        public bool Shared { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime AddedDate { get; set; }
        public DateTime? ConsumedDate { get; set; }

        public static ProductItemDTO FromModel(ProductItem model)
            => new ProductItemDTO()
            {
                Id = model.Id,
                ProductId = model.ProductId,
                OwnerId = model.OwnerId,
                Shared = model.Shared,
                ExpiryDate = model.ExpiryDate,
                AddedDate = model.AddedDate,
                ConsumedDate = null
            };

        public static ProductItemDTO FromModel(ConsumedProductItem model)
            => new ProductItemDTO()
            {
                Id = model.Id,
                ProductId = model.ProductId,
                OwnerId = model.OwnerId,
                Shared = model.Shared,
                ExpiryDate = model.ExpiryDate,
                AddedDate = model.AddedDate,
                ConsumedDate = model.ConsumedDate
            };
    }
}
