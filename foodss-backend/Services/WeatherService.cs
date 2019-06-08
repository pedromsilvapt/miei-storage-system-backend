using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RestSharp;
using RestSharp.Deserializers;
using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Services
{
    public class WeatherService
    {
        public StorageSystemContext Context { get; set; }

        protected RestClient client;

        protected string key;

        public WeatherService(StorageSystemContext context, IConfiguration configuration)
        {
            Context = context;
            client = new RestClient("https://openweathermap.org");
            key = configuration.GetValue<string>("Security:OpenWeatherMapKey");
        }

        public async Task<ForecastFiveDayDTO> GetFiveDayForecast(int id)
        {
            var request = new RestRequest("data/2.5/forecast", Method.GET);

            request.AddParameter("id", id);
            request.AddParameter("appid", this.key);
            request.AddParameter("units", "metric");

            IRestResponse<ForecastFiveDayDTO> response = await client.ExecuteTaskAsync<ForecastFiveDayDTO>(request);

            return response.Data;
        }

        public async Task<float> GetFiveDayMaxTemperatureForecast(int id)
        {
            ForecastFiveDayDTO forecast = await GetFiveDayForecast(id);

            return forecast.List.Select(hour => hour.Main.TemperatureMax).Max();
        }

        public async Task<ForecastFiveDayDTO> GetNextDaysForecast(int id, int days)
        {
            ForecastFiveDayDTO forecast = await GetFiveDayForecast(id);

            DateTime threshold = DateTime.Now.Date.AddDays(days).AddTicks(-1);

            return new ForecastFiveDayDTO
            {
                City = forecast.City,
                Code = forecast.Code,
                Error = forecast.Error,
                List = forecast.List.Where(hour => hour.Date <= threshold).ToList()
            };
        }

        public async Task<float> GetNextDaysMaxTemperatureForecast(int id, int days)
        {
            ForecastFiveDayDTO forecast = await GetNextDaysForecast(id, days);

            return forecast.List.Select(hour => hour.Main.TemperatureMax).Max();
        }
    }

    public class ForecastFiveDayDTO
    {
        public string Error { get; set; }
        [DeserializeAs(Name = "cod")]
        public string Code { get; set; }
        public ForecastCityDTO City { get; set; }
        public List<ForecastDetailsDTO> List { get; set; }
    }

    public class ForecastCityDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        [DeserializeAs(Name = "coord")]
        public ForecastCoordinatesDTO Coordinates { get; set; }

        public City ToModel() => new City
        {
            Id = this.Id,
            Name = this.Name,
            Country = this.Country,
            CoordinatesLatitude = this.Coordinates.Latitude,
            CoordinatesLongitude = this.Coordinates.Longitude
        };
    }

    public class ForecastCoordinatesDTO
    {
        [DeserializeAs(Name = "lat")]
        public double Latitude { get; set; }
        [DeserializeAs(Name = "lon")]
        public double Longitude { get; set; }
    }

    public class ForecastDetailsDTO
    {
        [DeserializeAs(Name = "dt")]
        public DateTime Date { get; set; }
        public ForecastDetailsMainDTO Main { get; set; }
    }

    public class ForecastDetailsMainDTO
    {
        [DeserializeAs(Name = "temp")]
        public float Temperature { get; set; }
        [DeserializeAs(Name = "temp_max")]
        public float TemperatureMax { get; set; }
        [DeserializeAs(Name = "temp_min")]
        public float TemperatureMin { get; set; }
    }
}
