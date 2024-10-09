declare namespace Definitions {

     export type SendEmailCodeDto = {
email?: string; type?: string; /* verify code type */
}

     export type EmailSigninDto = {
email?: string; /* email */
code?: string; username?: string; /* username */
password?: string; /* password, 8-64 characters */
inviteCode?: string; /* invite code */
}

     export type UserWithProfile = {
id?: string; name?: string; email?: string; phone?: string; createdAt?: string; updatedAt?: string; avatar?: string; }

     export type BindEmailDto = {
email?: string; code?: string; /* verify code */
password?: string; /* password */
}

     export type ResetPasswordDto = {
email?: string; /* email */
code?: string; /* code */
password?: string; /* password */
}

     export type BindPasswordDto = {
password?: string; /* password */
confirmPassword?: string; /* confirm password */
oldPassword?: string; /* old password */
}

     export type BindUsernameDto = {
username?: string; /* username */
}

     export type UserWithSts = {
putUrl?: string; url?: string; endpoint?: string; key?: string; bucket?: string; }

     export type ChargeProductCreateDto = {
amount?: number; originalAmount?: number; credit?: number; currency?: string; locale?: string; title?: string; tag?: string[]; /* 标签 */
message?: string; state?: string; }

     export type ChargeProductDto = {
id?: string; amount?: number; originalAmount?: number; credit?: number; currency?: string; locale?: string; title?: string; tag?: {}; message?: string; state?: string; createdAt?: string; updatedAt?: string; }

     export type ChargeProductUpdateDto = {
amount?: number; originalAmount?: number; credit?: number; currency?: string; locale?: string; title?: string; tag?: string[]; /* 标签 */
message?: string; state?: string; }

     export type GiftCodeCreateDto = {
code?: string; creditAmount?: number; }

     export type GiftCodeDto = {
id?: string; code?: string; creditAmount?: number; used?: boolean; usedBy?: string; usedAt?: string; transactionId?: string; createdAt?: string; expiredAt?: string; }

     export type GiftCodeUpdateDto = {
code?: string; creditAmount?: number; }

     export type ChargeOrderDto = {
id?: string; userId?: string; amount?: number; credit?: number; phase?: string; channel?: string; currency?: string; paymentAt?: string; result?: {}; createdAt?: string; updatedAt?: string; user?: {}; userInfo?: {}; }

     export type HealthSerialization = {
status?: string; info?: {}; error?: {}; details?: {}; }

}

declare namespace Paths {

    namespace AuthControllerSendCode {
      export type QueryParameters = any;

      export type BodyParameters = Definitions.SendEmailCodeDto;

      export type Responses = any;
    }

    namespace AuthControllerSignin {
      export type QueryParameters = any;

      export type BodyParameters = Definitions.EmailSigninDto;

      export type Responses = any;
    }

    namespace UserControllerUpdateAvatar {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace UserControllerGetAvatar {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace UserControllerBindEmail {
      export type QueryParameters = any;

      export type BodyParameters = Definitions.BindEmailDto;

      export type Responses = any;
    }

    namespace UserControllerResetPassword {
      export type QueryParameters = any;

      export type BodyParameters = Definitions.ResetPasswordDto;

      export type Responses = any;
    }

    namespace UserControllerBindPassword {
      export type QueryParameters = any;

      export type BodyParameters = Definitions.BindPasswordDto;

      export type Responses = any;
    }

    namespace UserControllerBindUsername {
      export type QueryParameters = any;

      export type BodyParameters = Definitions.BindUsernameDto;

      export type Responses = any;
    }

    namespace UserControllerGetProfile {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace UserControllerGetSts {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace ChargeProductControllerFindAll {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace ChargeProductControllerCreate {
      export type QueryParameters = any;

      export type BodyParameters = Definitions.ChargeProductCreateDto;

      export type Responses = any;
    }

    namespace ChargeProductControllerUpdate {
      export type QueryParameters = any;

      export type BodyParameters = Definitions.ChargeProductUpdateDto;

      export type Responses = any;
    }

    namespace ChargeProductControllerDelete {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace GiftCodeControllerFindAll {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace GiftCodeControllerCreate {
      export type QueryParameters = any;

      export type BodyParameters = Definitions.GiftCodeCreateDto;

      export type Responses = any;
    }

    namespace GiftCodeControllerUpdate {
      export type QueryParameters = any;

      export type BodyParameters = Definitions.GiftCodeUpdateDto;

      export type Responses = any;
    }

    namespace GiftCodeControllerDelete {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace ChargeOrderControllerFindAll {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace ChargeOrderControllerFindById {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace ClerkControllerFindAll {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace HealthPublicControllerCheckAws {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace HealthPublicControllerCheckDatabase {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace HealthPublicControllerCheckMemoryHeap {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }

    namespace HealthPublicControllerCheckMemoryRss {
      export type QueryParameters = any;

      export type BodyParameters = any;

      export type Responses = any;
    }


}