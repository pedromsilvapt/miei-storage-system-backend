using Microsoft.EntityFrameworkCore;
using StorageSystem.Architecture.Exception;
using StorageSystem.Controllers.DTO;
using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Services
{
    public class StorageService
    {
        public StorageSystemContext Context { get; protected set; }

        private readonly WeatherService weatherService;

        private readonly EmailService emailService;

        public StorageService(StorageSystemContext context, WeatherService weatherService, EmailService emailService)
        {
            this.Context = context;
            this.weatherService = weatherService;
            this.emailService = emailService;
        }

        public async Task<List<Storage>> ListStorages(int userId)
        {
            // We query the pivot table to get the storage id's associated with the user
            ICollection<int> storageIds = await Context.StorageUsers
                    .Where(storage => storage.UserId == userId)
                    .Select(storage => storage.StorageId)
                    .ToListAsync();

            return await Context.Storages
                .Where(storage => storage.OwnerId == userId || storageIds.Contains(storage.Id))
                .ToListAsync();
        }

        public async Task<Storage> GetStorage(int userId, int id, bool includeOwner = false, bool includeCity = false)
        {
            Storage storage = await Context.Storages
                .Include(s => s.Users)
                .ConditionalInclude(s => s.Owner, includeOwner)
                .ConditionalInclude(s => s.City, includeCity)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (storage == null)
            {
                throw new StorageNotFoundException();
            }

            // If the user is neither the owner of the storage, nor is he inside the user's collection, we return an error
            if ((storage.OwnerId != userId) && (storage.Users.FirstOrDefault(u => u.UserId == userId) == null))
            {
                throw new UnauthorizedStorageAccessException();
            }

            return storage;
        }

        public async Task<Storage> CreateStorage(User owner, string name, ICollection<string> invitations = null, int? city = null)
        {
            using (var transaction = await Context.Database.BeginTransactionAsync())
            {
                bool shared = invitations.Count > 0;

                Storage storageModel = new Storage() { Name = name, Shared = shared, OwnerId = owner.Id, CityId = city };

                await Context.Storages.AddAsync(storageModel);

                if (invitations != null)
                {
                    invitations = invitations.Distinct().ToList();

                    foreach (string invitationInput in invitations)
                    {
                        if (invitationInput == owner.Email)
                        {
                            transaction.Rollback();

                            throw new InviteSelfException();
                        }

                        StorageInvitation invitation = new StorageInvitation() { StorageId = storageModel.Id, AuthorId = owner.Id, UserEmail = invitationInput };

                        emailService.SendEmail(invitation.UserEmail,owner.Name, "Convite para partilha de dispensa - Storage System ", "Recebeu um novo convite de "+owner.Name+" para a partilha de dispensa "+ name + ".  " +
                            "Faça login para ver: " + emailService.GetBaseUrl() + "/#/login");
                        await Context.StorageInvitations.AddAsync(invitation);
                    }
                }

                await Context.SaveChangesAsync();

                transaction.Commit();

                return storageModel;
            }
        }

        public async Task<Storage> UpdateStorage(int userId, int id, string name, int? city = null)
        {
            Storage storage = await Context.Storages.FindAsync(id);

            if (storage == null)
            {
                throw new StorageNotFoundException();
            }

            // TODO Decide if only the owner should be able to edit a storage, or any member of the storage can edit it as well
            if (storage.OwnerId != userId)
            {
                throw new UnauthorizedStorageAccessException();
            }

            // TODO There should be further input validation, such as a minimum length for the name attribute
            // in order to prevent empty storage names ""
            storage.Name = name;

            storage.CityId = city;

            Context.Storages.Update(storage);

            await Context.SaveChangesAsync();

            return storage;
        }

        public async Task<List<Product>> GetStorageWeatherReport(int userId, int id) {
            return await GetStorageWeatherReport(await GetStorage(userId, id));
        }

        public async Task<List<Product>> GetStorageWeatherReport(Storage storage)
        {
            if (storage.CityId == null)
            {
                return new List<Product>();
            }

            if ((storage.LastWeatherForecastTemperature == null)
             || (storage.LastWeatherForecast == null)
             || (storage.LastWeatherForecast.Value.Date != DateTime.Today))
            {
                storage.LastWeatherForecastTemperature = await weatherService.GetNextDaysMaxTemperatureForecast(storage.CityId.Value, 3);
                storage.LastWeatherForecast = DateTime.Now;

                Context.Storages.Update(storage);
                await Context.SaveChangesAsync();
            }

            return await Context.Products
                .Where(prod => prod.StorageId == storage.Id && prod.MaxTemperature != null && prod.MaxTemperature < storage.LastWeatherForecastTemperature)
                .ToListAsync();
        }
        
        public async Task DeleteStorage(int userId, int id)
        {
            Storage storage = await Context.Storages.FindAsync(id);

            if (storage == null)
            {
                throw new StorageNotFoundException();
            }

            // Let's assume only the owner can delete a storage
            if (storage.OwnerId != userId)
            {
                throw new UnauthorizedStorageAccessException();
            }

            Context.Storages.Remove(storage);

            await Context.SaveChangesAsync();
        }

        public async Task<List<User>> ListStorageUsers(int userId, int id)
        {
            Storage storage = await GetStorage(userId, id);

            if (storage == null)
            {
                throw new StorageNotFoundException();
            }

            return await Context.StorageUsers
                .Where(u => u.StorageId == storage.Id)
                .Include(s => s.User)
                .Select(s => s.User)
                .ToListAsync();
        }

        public async Task DeleteStorageUser(int userId, int id, int member)
        {
            Storage storage = await GetStorage(userId, id);

            if (storage == null)
            {
                throw new StorageNotFoundException();
            }

            // Let's assume only the owner can delete a storage's member
            if (storage.OwnerId != userId && userId != member)
            {
                throw new UnauthorizedStorageAccessException();
            }

            StorageUser user = await Context.StorageUsers.Where(s => s.StorageId == storage.Id && s.UserId == member).FirstOrDefaultAsync();

            if (user != null)
            {
                Context.StorageUsers.Remove(user);

                await Context.SaveChangesAsync();
            }
        }
    }
}
