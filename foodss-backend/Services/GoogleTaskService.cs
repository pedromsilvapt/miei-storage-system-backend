using Google.Apis.Auth.OAuth2;
using Google.Apis.Tasks.v1;
using Google.Apis.Tasks.v1.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using StorageSystem.Controllers.DTO;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Auth.OAuth2.Flows;

namespace StorageSystem.Services
{
    public class GoogleTaskService
    {
        static string[] Scopes = { TasksService.Scope.Tasks};
        static string ApplicationName = "Google Tasks API .NET Quickstart";
        public async Task<int> TransferTask(int idUser, string code, List<ShoppingListDTO> products)
        {
            //UserCredential credential;
            
            //using (var stream =
            //    new FileStream("credentials.json", FileMode.Open, FileAccess.Read))
            //{
            //    // The file token.json stores the user's access and refresh tokens, and is created
            //    // automatically when the authorization flow completes for the first time.
            //    string credPath = "token.json";
            //    credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
            //        GoogleClientSecrets.Load(stream).Secrets,
            //        Scopes,
            //        idUser.ToString(),
            //        CancellationToken.None,
            //        new FileDataStore(credPath, true)).Result;
            //    Console.WriteLine("Credential file saved to: " + credPath);
            //}

            //TokenResponse response = null;

            // Use the code exchange flow to get an access and refresh token.
            IAuthorizationCodeFlow flow =
                new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = new ClientSecrets()
                    {
                        ClientId = "840458515587-f6ga1e7rk9k9b3ojcv9fh0lthvt1ka9n",
                        ClientSecret = "CO7il0cwzM51X1HAtcuKh85t"
                    },
                    Scopes = Scopes
                });

            TokenResponse response = await flow.ExchangeCodeForTokenAsync("", code, "postmessage", CancellationToken.None);
            TokenResponse token = new TokenResponse
            {
                AccessToken = response.AccessToken,
                RefreshToken = response.RefreshToken
            };

            UserCredential credential = new UserCredential(flow, "me", token);
            bool success = credential.RefreshTokenAsync(CancellationToken.None).Result;

            token = credential.Token;

            // Create Google Tasks API service.
            var service = new TasksService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName,
            });

            // Define parameters of request.

            TaskList list = new TaskList { Title = "Lista Compras" +" " + DateTime.Now };
            list = service.Tasklists.Insert(list).Execute();

            foreach (ShoppingListDTO product in products)
            {
                Google.Apis.Tasks.v1.Data.Task g = new Google.Apis.Tasks.v1.Data.Task { Title = product.ProductName};
                string note = 
                g.Notes = "Storage Name: " + product.StorageName + "   " + "Quantity of products to buy: " + product.Count.ToString();
                g = service.Tasks.Insert(g, list.Id).Execute();

            }

            return 1;
        }

    }
}
