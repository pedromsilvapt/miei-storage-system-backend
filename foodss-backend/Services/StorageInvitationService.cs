using Microsoft.EntityFrameworkCore;
using StorageSystem.Architecture.Exception;
using StorageSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Services
{
    public class StorageInvitationService
    {
        public StorageSystemContext Context { get; protected set; }

        private StorageService storageService;

        public StorageInvitationService(StorageSystemContext context, StorageService storageService)
        {
            this.Context = context;
            this.storageService = storageService;
        }

        protected async Task<Storage> GetStorage(User user, int storageId)
        {
            Storage storage = await storageService.GetStorage(user.Id, storageId);

            await Context.Entry(storage).Collection(s => s.Invitations).LoadAsync();

            return storage;
        }

        public async Task<ICollection<StorageInvitation>> ListInvitations(User user, int storageId)
        {
            Storage storage = await GetStorage(user, storageId);

            return storage.Invitations.ToList();
        }

        public async Task<Dictionary<string, User>> ListInvitationsUsers(ICollection<StorageInvitation> invitations)
        {
            ICollection<string> emails = invitations.Select(i => i.UserEmail).ToList();

            return await Context.Users
                // We select only the users whose emails belong to the 
                .Where(user => emails.Contains(user.Email))
                // Transform the result into a dictionary grouped by the users' emails
                .ToDictionaryAsync(u => u.Email);
        }

        public async Task<StorageInvitation> CreateInvitation(User user, int storageId, string email)
        {
            Storage storage = await GetStorage(user, storageId);

            // If we try to invite an email already associated with an account...
            User emailOwner = await Context.Users
                .Where(u => u.Email == email)
                .FirstOrDefaultAsync();

            // Now the storage users are available through the property storage.Users
            // If the user exist and is already a member of the storage, we cannot invite him/her
            if (emailOwner != null && storage.Users.Where(u => u.UserId == emailOwner.Id).Count() > 0)
            {
                throw new InviteExistingStorageMemberException();
            }

            StorageInvitation invitation = storage.Invitations
                .Where(i => i.UserEmail == email)
                .FirstOrDefault();

            // If the invitation already exists, then this is a successful no-op
            if (invitation == null)
            {
                invitation = new StorageInvitation() { StorageId = storageId, AuthorId = user.Id, UserEmail = email };

                await Context.StorageInvitations.AddAsync(invitation);

                // Adding an invitation to a storage that was not marked as shared before always makes it shared
                if (storage.Shared == false)
                {
                    storage.Shared = true;

                    Context.Storages.Update(storage);
                }

                await Context.SaveChangesAsync();
            }

            return invitation;
        }

        public async Task RemoveInvitation(User user, int storageId, string email)
        {
            Storage storage = await GetStorage(user, storageId);

            StorageInvitation invitation = storage.Invitations
                .Where(i => i.UserEmail == email)
                .FirstOrDefault();

            // If the invitation is null, then it already doesn't exist in the database
            // And since we're trying to remove it here, that means objective accomplished
            if (invitation != null)
            {
                Context.StorageInvitations.Remove(invitation);

                // If there is only one invitation in this storage, and we are removing it,
                // and if there are no active users as well, then we can consider this storage as not shared anymore
                if (storage.Invitations.Count <= 1 && storage.Users.Count == 0)
                {
                    storage.Shared = false;

                    Context.Storages.Update(storage);
                }

                await Context.SaveChangesAsync();
            }
        }
    }
}
