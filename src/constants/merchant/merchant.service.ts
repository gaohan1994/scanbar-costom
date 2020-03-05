/**
 * @Author: Ghan 
 * @Date: 2019-11-08 10:01:17 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-03 17:11:13
 * 
 * @todo [商户相关的接口]
 * ```js
 * import MemberService from 'MemberService';
 * 
 * MemberService.xx();
 * ```
 */

import requestHttp from "../../common/request/request.http";
import { HTTPInterface, jsonToQueryString } from '../index';
import MerchantInterfaceMap, { MerchantInterface } from "./merchant";

class MerchantService {

  public merchantList = async (): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(`${MerchantInterfaceMap.merchantList}`);
    return result;
  }

  public merchantInfoDetail = async (params: MerchantInterface.merchantDetailFetchField): Promise<HTTPInterface.ResponseResultBase<MerchantInterface.MerchantDetail>> => {
    const result = await requestHttp.get(`${MerchantInterfaceMap.merchantInfoDetail}/${jsonToQueryString(params)}`);
    return result;
  }

  public merchantDistance = async (params: MerchantInterface.merchantDistanceFetchField): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(`${MerchantInterfaceMap.merchantDistance}/${jsonToQueryString(params)}`);
    return result;
  }
}

export default new MerchantService();