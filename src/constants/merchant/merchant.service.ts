/**
 * @Author: Ghan 
 * @Date: 2019-11-08 10:01:17 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-18 14:51:03
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

  public activityInfoList = async (id: any): Promise<HTTPInterface.ResponseArray<any>> => {
    const result = await requestHttp.get(`/activityInfo/list/${id}`);
    return result;
  }

  public merchantList = async (param: any): Promise<HTTPInterface.ResponseResultBase<any>> => {
    if(param.latitude===undefined || param.longitude===undefined){
      delete param.latitude;
      delete param.longitude;
    }
    const result = await requestHttp.get(`${MerchantInterfaceMap.merchantList}${jsonToQueryString(param)}`);
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

  public advertisement = async(params: MerchantInterface.merchantDetailFetchField): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(`${MerchantInterfaceMap.advertisement}/${params.merchantId}`);
    return result;
  }
}

export default new MerchantService();