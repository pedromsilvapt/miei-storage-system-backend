using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Architecture.Exception
{
    public class ApiException
    {
    }

    public class ExistingEmailException : System.Exception
    {
        public ExistingEmailException() : base(ApiErrorCode.EMAIL_ALREADY_INFORMED.ToString()) { }
    }

    public class EmailNotVerifiedException : System.Exception
    {
        public EmailNotVerifiedException() : base(ApiErrorCode.EMAIL_NOT_VERIFIED.ToString()) { }
    }

    public class IncorrectEmailOrPasswordException : System.Exception
    {
        public IncorrectEmailOrPasswordException() : base(ApiErrorCode.INCORRECT_EMAIL_OR_PASSWORD.ToString()) { }
    }
}
