using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StorageSystem.Architecture
{
    public enum ApiErrorCode
    {
        INCORRECT_EMAIL_OR_PASSWORD,
        EMAIL_NOT_VERIFIED,
        EMAIL_ALREADY_INFORMED,
        NOT_AUTHENTICATED,
        USER_NOT_FOUND,
        STORAGE_NOT_FOUND,
        UNAUTHORIZED_STORAGE_ACCESS,
        UNAUTHORIZED_SHOPPING_LIST_ACCESS,
        PRODUCT_NOT_FOUND,
        PRODUCT_EXPIRY_DATE_MISMATCH,
        PRODUCT_REMOVAL,
        DUPLICATED_BARCODE,
        INVITE_EXISTING_STORAGE_MEMBER,
        INVITE_SELF,
        CITY_NOT_FOUND,
        SHOPPING_LIST_ITEM_NOT_FOUND,
        INVALID_COUNT
    }
}
