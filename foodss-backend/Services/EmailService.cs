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
        public static bool SendEmail(string email, string name, string subjectaux, string bodyaux)
        {


            using (SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential("projetoaasi@gmail.com", "stdlib.h"),
                EnableSsl = true
            })
            {
                client.Send("projetoaasi@gmail.com", email, subjectaux, bodyaux);
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
