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
* Get charge products
*/
export async function ChargeProductControllerFindAll(
  params: Paths.ChargeProductControllerFindAll.BodyParameters,
): Promise<{
    error: string;
    data: Paths.ChargeProductControllerFindAll.Responses
}> {
  // /v1/charge-product
  let _params: { [key: string]: any } = {
    ...params,
  };
  return request.get(`/v1/charge-product`,  {
    params: _params
  });
}

/**
* Create charge product
*/
export async function ChargeProductControllerCreate(
  params: Definitions.ChargeProductCreateDto,
): Promise<{
    error: string;
    data: Definitions.ChargeProductDto
}> {
  // /v1/charge-product
  let _params: { [key: string]: any } = {
    ...params,
  };
  return request.post(`/v1/charge-product`,  {
    ..._params
  });
}

/**
* Update charge product
*/
export async function ChargeProductControllerUpdate(
  params: Definitions.ChargeProductUpdateDto,
): Promise<{
    error: string;
    data: Definitions.ChargeProductDto
}> {
  // /v1/charge-product/{id}
  let _params: { [key: string]: any } = {
    ...params,
  };
  return request.put(`/v1/charge-product/${_params.id}`,  {
    ..._params
  });
}

/**
* Delete charge product
*/
export async function ChargeProductControllerDelete(
  params: Paths.ChargeProductControllerDelete.BodyParameters,
): Promise<{
    error: string;
    data: Paths.ChargeProductControllerDelete.Responses
}> {
  // /v1/charge-product/{id}
  let _params: { [key: string]: any } = {
    ...params,
  };
  return request.delete(`/v1/charge-product/${_params.id}`,  {
    ..._params
  });
}

