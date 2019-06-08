using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StorageSystem.Controllers.DTO;
using StorageSystem.Models;
using StorageSystem.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/city")]
    [ApiController]
    public class CityController : Controller
    {
        protected CityService cityService;

        protected UserService userService;

        public CityController(CityService cityService, UserService userService)
        {
            this.cityService = cityService;
            this.userService = userService;
        }

        [HttpGet("{id}")]
        public async Task<CityDTO> Get(int id)
        {
            //await cityService.ImportFile(@"C:\Users\PedroSilva\source\repos\miei-foodss-backend\foodss-backend\city.list.json");

            City city = await cityService.Get(id);

            return CityDTO.FromModel(city);
        }

        public class SearchQuery
        {
            public string Name { get; set; }
            public string Country { get; set; }
        }

        [HttpGet("search")]
        public async Task<List<CityDTO>> Search(int id, [FromQuery]SearchQuery query)
        {
            ICollection<City> cities = null;

            if (!String.IsNullOrEmpty(query.Name) && !String.IsNullOrEmpty(query.Country))
            {
                cities = await cityService.Search(query.Name, query.Country);
            }
            else if (!String.IsNullOrEmpty(query.Name))
            {
                cities = await cityService.SearchByName(query.Name);
            }
            else if (!String.IsNullOrEmpty(query.Country))
            {
                cities = await cityService.SearchByCountry(query.Country);
            }

            if (cities == null)
            {
                return new List<CityDTO>();
            }

            return cities.Select(city => CityDTO.FromModel(city)).ToList();
        }
    }
}
