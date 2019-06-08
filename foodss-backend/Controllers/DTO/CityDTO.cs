using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Controllers.DTO
{
    public class CityDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        
        public CoordinatesDTO Coordinates { get; set; }

        public static CityDTO FromModel(City city) => new CityDTO
        {
            Id = city.Id,
            Name = city.Name,
            Country = city.Country,
            Coordinates = new CoordinatesDTO
            {
                Latitude = city.CoordinatesLatitude,
                Longitude = city.CoordinatesLongitude
            }
        };
    }

    public class CoordinatesDTO
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

}
