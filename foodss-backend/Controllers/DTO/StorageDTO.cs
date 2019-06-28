using StorageSystem.Models;
using System.Collections.Generic;
using System.Linq;

namespace StorageSystem.Controllers.DTO
{
    // Used when creating/updating a storage, sent from the client to the server
    public class StorageInputDTO
    {
        public string Name { get; set; }

        public ICollection<StorageInvitationInputDTO> Invitations { get; set; }

        public StorageCityInputDTO City { get; set; }
    }

    public class StorageCityInputDTO
    {
        public int Id { get; set; }
    }

    // Used when viewing one/many storage(s), sent from the server to the client
    public class StorageDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OwnerId { get; set; }
        public bool Shared { get; set; }
        public int? CityId { get; set; }
        public float? CityTemperature { get; set; }
        public UserDTO Owner { get; set; }
        public CityDTO City { get; set; }

        public List<ProductDTO> Products;

        public static StorageDTO FromModel(Storage model, List<ProductDTO> products = null) => new StorageDTO() {
            Id = model.Id,
            Name = model.Name,
            Owner = model.Owner != null ? UserDTO.FromModel(model.Owner) : null,
            OwnerId = model.OwnerId,
            Shared = model.Shared,
            Products = products,
            CityId = model.CityId,
            City = model.City != null ? CityDTO.FromModel(model.City) : null,
            CityTemperature = model.LastWeatherForecastTemperature
        };
    }
}
