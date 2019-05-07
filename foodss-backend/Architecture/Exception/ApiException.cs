using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Architecture.Exception
{
    public class ApiException : System.Exception
    {
        public int StatusCode { get; set; }

        public ApiException(int statusCode, string message) : base(message)
        {
            this.StatusCode = statusCode;
        }
    }

    /* Generic API Exceptions */
    public class BadRequestException : ApiException
    {
        public BadRequestException(string message) : base(400, message) { }
    }

    public class UnauthorizedException : ApiException
    {
        public UnauthorizedException(string message) : base(401, message) { }
    }

    public class NotFoundException : ApiException
    {
        public NotFoundException(string message) : base(404, message) { }
    }

    public class InternalErrorException : ApiException
    {
        public InternalErrorException(string message) : base(500, message) { }
    }

    /* Specific API Exceptions */
    public class ExistingEmailException : BadRequestException
    {
        public ExistingEmailException() : base(ApiErrorCode.EMAIL_ALREADY_INFORMED.ToString()) { }
    }

    public class EmailNotVerifiedException : BadRequestException
    {
        public EmailNotVerifiedException() : base(ApiErrorCode.EMAIL_NOT_VERIFIED.ToString()) { }
    }

    public class IncorrectEmailOrPasswordException : BadRequestException
    {
        public IncorrectEmailOrPasswordException() : base(ApiErrorCode.INCORRECT_EMAIL_OR_PASSWORD.ToString()) { }
    }

    public class UserNotFoundException : NotFoundException
    {
        public UserNotFoundException() : base(ApiErrorCode.USER_NOT_FOUND.ToString()) { }
    }

    public class StorageNotFoundException : NotFoundException
    {
        public StorageNotFoundException() : base(ApiErrorCode.STORAGE_NOT_FOUND.ToString()) { }
    }

    public class UnauthorizedStorageAccessException : UnauthorizedException
    {
        public UnauthorizedStorageAccessException() : base(ApiErrorCode.UNAUTHORIZED_STORAGE_ACCESS.ToString()) { }
    }

    public class ProductNotFoundException : NotFoundException
    {
        public ProductNotFoundException() : base(ApiErrorCode.PRODUCT_NOT_FOUND.ToString()) { }
    }

    public class ProductExpiryDateMismatchException : BadRequestException
    {
        public ProductExpiryDateMismatchException() : base(ApiErrorCode.PRODUCT_EXPIRY_DATE_MISMATCH.ToString()) { }
    }

    public class ProductRemovalException : BadRequestException
    {
        public ProductRemovalException() : base(ApiErrorCode.PRODUCT_REMOVAL.ToString()) { }
    }

    public class DuplicatedBarcodeException : BadRequestException
    {
        public DuplicatedBarcodeException() : base(ApiErrorCode.DUPLICATED_BARCODE.ToString()) { }
    }

    public class InviteExistingStorageMemberException : BadRequestException
    {
        public InviteExistingStorageMemberException() : base(ApiErrorCode.INVITE_EXISTING_STORAGE_MEMBER.ToString()) { }
    }

    public class InviteSelfException : BadRequestException
    {
        public InviteSelfException() : base(ApiErrorCode.INVITE_SELF.ToString()) { }
    }
}
