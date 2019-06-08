using Microsoft.EntityFrameworkCore;
using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StorageSystem.Architecture.Exception;
using RestSharp;
using System.IO;
using RestSharp.Serialization.Json;

namespace StorageSystem.Services
{
    public class CityService
    {
        public StorageSystemContext Context { get; set; }

        public CityService(StorageSystemContext context)
        {
            Context = context;
        }

        public async Task<List<City>> SearchByName(string name)
        {
            return await Context.Cities
                .Where(city => city.Name.Contains(name))
                .ToListAsync();
        }
        public async Task<List<City>> SearchByCountry(string country)
        {
            return await Context.Cities
                .Where(city => city.Country == country)
                .ToListAsync();
        }
        public async Task<List<City>> Search(string name, string country)
        {
            return await Context.Cities
                .Where(city => city.Name.Contains(name) && city.Country == country)
                .ToListAsync();
        }

        public async Task<City> Get(int id)
        {
            City city = await Context.Cities
                .Where(c => c.Id == id)
                .FirstOrDefaultAsync();

            if (city == null)
            {
                throw new CityNotFoundException();
            }

            return city;
        }

        public async Task ImportFile(string file)
        {
            string contents = await File.ReadAllTextAsync(file);

            await ImportJson(contents);
        }

        public async Task ImportJson(string json)
        {
            var response = new RestResponse { Content = json };

            var serializer = new JsonSerializer();

            List<ForecastCityDTO> cities = serializer.Deserialize<List<ForecastCityDTO>>(response);

            int count = 0;
            foreach (ForecastCityDTO city in cities)
            {
                count++;

                await Context.Cities.AddAsync(city.ToModel());

                if (count >= 10000)
                {
                    await Context.SaveChangesAsync();

                    count = 0;
                }
            }

            if (count > 0)
            {
                await Context.SaveChangesAsync();
            }
        }
    }
}
