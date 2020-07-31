/**
 * @Author: Ghan
 * @Date: 2019-11-08 10:01:17
 * @Last Modified by: centerm.gaozhiyingerm.gaozhiying
 * @Last Modified time: 2020-07-24 10:51:13
 *
 * @todo [商户相关的接口]
 */

import requestHttp from "../../common/request/request.http";
import { HTTPInterface, jsonToQueryString } from "../index";
import MerchantInterfaceMap, { MerchantInterface } from "./merchant";
import { BASE_PARAM } from "../../common/util/config";

class MerchantService {
  public activityInfoList = async (
    id: any
  ): Promise<HTTPInterface.ResponseArray<any>> => {
    const result = await requestHttp.get(
      `/api/activityInfo/list/${BASE_PARAM.institutionCode}/${id}`
    );
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

  public advertisement = async (): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(
      `${MerchantInterfaceMap.advertisement}/${BASE_PARAM.institutionCode}`
    );
    return result;
  };
}

export default new MerchantService();
