// @ts-ignore
/* eslint-disable */
///////////////////////////////////////////////////////////////////////
//                                                                   //
// this file is autogenerated by service-generate                    //
// do not edit this file manually                                    //
//                                                                   //
///////////////////////////////////////////////////////////////////////
/// <reference path = "api-auto.d.ts" />
import request from '@/utils/ajax';

/**
* Send email verify code
*/
export async function AuthControllerSendCode(
  params: Definitions.SendEmailCodeDto,
): Promise<{
    error: string;
    data: Paths.AuthControllerSendCode.Responses
}> {
  // /v1/auth/email/code
  let _params: { [key: string]: any } = {
    ...params,
  };
  return request.post(`/v1/auth/email/code`,  {
    ..._params
  });
}

/**
* Signin by email and verify code
*/
export async function AuthControllerSignin(
  params: Definitions.EmailSigninDto,
): Promise<{
    error: string;
    data: Paths.AuthControllerSignin.Responses
}> {
  // /v1/auth/email/signin
  let _params: { [key: string]: any } = {
    ...params,
  };
  return request.post(`/v1/auth/email/signin`,  {
    ..._params
  });
}

