/**
 * @Author: Ghan
 * @Date: 2019-11-08 10:01:17
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-06-17 10:16:57
 *
 * @todo [商户相关的接口]
 */

import requestHttp from "../../common/request/request.http";
import { HTTPInterface, jsonToQueryString } from "../index";
import MerchantInterfaceMap, { MerchantInterface } from "./merchant";

class MerchantService {
  public activityInfoList = async (
    id: any
  ): Promise<HTTPInterface.ResponseArray<any>> => {
    const result = await requestHttp.get(`/activityInfo/list/${id}`);
    return result;
  };

  public merchantList = async (): Promise<
    HTTPInterface.ResponseResultBase<any>
  > => {
    const result = await requestHttp.get(
      `${MerchantInterfaceMap.merchantList}`
    );
    return result;
  };

  public merchantInfoDetail = async (
    params: MerchantInterface.merchantDetailFetchField
  ): Promise<
    HTTPInterface.ResponseResultBase<MerchantInterface.MerchantDetail>
  > => {
    const result = await requestHttp.get(
      `${MerchantInterfaceMap.merchantInfoDetail}/${jsonToQueryString(params)}`
    );
    return result;
  };

  public merchantDistance = async (
    params: MerchantInterface.merchantDistanceFetchField
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(
      `${MerchantInterfaceMap.merchantDistance}/${jsonToQueryString(params)}`
    );
    return result;
  };

  public advertisement = async (
    params: MerchantInterface.merchantDetailFetchField
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(
      `${MerchantInterfaceMap.advertisement}/${params.merchantId}`
    );
    return result;
  };
}

export default new MerchantService();
