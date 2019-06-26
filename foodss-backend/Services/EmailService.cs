using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace StorageSystem.Services
{
    public class EmailService
    {
        public IConfiguration Configuration { get; }

        public EmailService (IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public string GetBaseUrl ()
        {
            return Configuration.GetValue<string>("Email:BaseUrl");
        }

        public bool SendEmail(string email, string name, string subjectaux, string bodyaux)
        {
            string host = Configuration.GetValue<string>("Email:Host");
            int port = Configuration.GetValue<int>("Email:Port");
            string username = Configuration.GetValue<string>("Email:Username");
            string password = Configuration.GetValue<string>("Email:Password");

            using (SmtpClient client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            })
            {
                client.Send(username, email, subjectaux, bodyaux);
            }

            return true;
        }

        public static string GenerateCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 8)
          .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
