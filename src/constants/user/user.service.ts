/**
 * @Author: Ghan 
 * @Date: 2019-11-08 10:01:17 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-16 13:54:13
 * 
 * @todo [用户相关的接口]
 * ```js
 * import UserService from 'MemberService';
 * 
 * UserService.xx();
 * ```
 */

import requestHttp from "../../common/request/request.http";
import { HTTPInterface, jsonToQueryString } from '../index';
import { UserInterface } from "./user";

class UserService {

  public addressList = async (): Promise<HTTPInterface.ResponseResultBase<UserInterface.Address[]>> => {
    const result = await requestHttp.get('/api/address/list');
    return result;
  }

  public addressAdd = async (params: UserInterface.Address): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post('/api/address/add', params);
    return result;
  }

  public addressEdit = async (params: UserInterface.Address): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post('/api/address/edit', params);
    return result;
  }

  public userInfoSave = async (params: UserInterface.UserInfo): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post('/api/customer/save', params);
    return result;
  }

  public getAllCoupon = async (): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get('api/coupon/getAllCoupon');
    return result;
  }

  public getAbleToUseCoupon = async (params: any): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post('api/coupon/getAbleToUseCoupon', params);
    return result;
  }

  public getMemberCoupons = async (params: any): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(`api/coupon/getMemberCoupons/${jsonToQueryString(params)}`);
    return result;
  }

  public getMemberExpiredCoupons = async (params: any): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(`api/coupon/getMemberCoupons/${jsonToQueryString(params)}`);
    return result;
  }
}

export default new UserService();