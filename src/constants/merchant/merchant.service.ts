/**
 * @Author: Ghan 
 * @Date: 2019-11-08 10:01:17 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-01 18:33:24
 * 
 * @todo [盘点相关的接口]
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

  public merchantInfoDetail = async (params): Promise<HTTPInterface.ResponseResultBase<MerchantInterface.MerchantDetail>> => {
    const result = await requestHttp.get(`${MerchantInterfaceMap.merchantInfoDetail}/${jsonToQueryString(params)}`);
    return result;
  }

  public merchantList = async (): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(`${MerchantInterfaceMap.merchantList}`);
    return result;
  }

  public addressList = async (): Promise<HTTPInterface.ResponseResultBase<MerchantInterface.Address[]>> => {
    const result = await requestHttp.get('/api/address/list');
    return result;
  }

  public addressAdd = async (params: Partial<MerchantInterface.Address>): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post('/api/address/add', params);
    return result;
  }

  public addressEdit = async (params: Partial<MerchantInterface.Address>): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post('/api/address/edit', params);
    return result;
  }

  public wxUserInfoSave = async (params: Partial<MerchantInterface.WxUserInfo>): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post('/api/save', params);
    return result;
  }
}

export default new MerchantService();