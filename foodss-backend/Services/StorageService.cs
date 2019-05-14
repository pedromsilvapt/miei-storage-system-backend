using Microsoft.EntityFrameworkCore;
using StorageSystem.Architecture.Exception;
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

        public StorageService(StorageSystemContext context)
        {
            this.Context = context;
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

        public async Task<Storage> GetStorage(int userId, int id)
        {
            Storage storage = await Context.Storages
                .Include(s => s.Users)
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

        public async Task<Storage> CreateStorage(User owner, string name, ICollection<string> invitations = null)
        {
            using (var transaction = await Context.Database.BeginTransactionAsync())
            {
                bool shared = invitations.Count > 0;

                Storage storageModel = new Storage() { Name = name, Shared = shared, OwnerId = owner.Id };

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

                        StorageInvitation invitation = new StorageInvitation() { StorageId = storageModel.Id, UserEmail = invitationInput };

                        await Context.StorageInvitations.AddAsync(invitation);
                    }
                }

                await Context.SaveChangesAsync();

                transaction.Commit();

                return storageModel;
            }
        }

        public async Task<Storage> UpdateStorage(int userId, int id, string name)
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

            Context.Storages.Update(storage);

            await Context.SaveChangesAsync();

            return storage;
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
    }
}
