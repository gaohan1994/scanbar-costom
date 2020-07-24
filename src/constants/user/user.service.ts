/**
 * @Author: Ghan
 * @Date: 2019-11-08 10:01:17
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-07-23 15:41:41
 *
 * @todo [用户相关的接口]
 * ```js
 * import UserService from 'MemberService';
 *
 * UserService.xx();
 * ```
 */

import requestHttp from "../../common/request/request.http";
import { HTTPInterface, jsonToQueryString } from "../index";
import { UserInterface } from "./user";

class UserService {
  public h5Code = async (
    params: any
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(
      `/customer/getCode?phone=${params.phone}`
    );
    return result;
  };

  public h5Login = async (
    params: any
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post("/customer/login", params);
    return result;
  };

  public addressList = async (): Promise<
    HTTPInterface.ResponseResultBase<UserInterface.Address[]>
  > => {
    const result = await requestHttp.get("/api/address/list");
    return result;
  };

  public addressAdd = async (
    params: UserInterface.Address
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post("/api/address/add", params);
    return result;
  };

  public addressEdit = async (
    params: UserInterface.Address
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post("/api/address/edit", params);
    return result;
  };

  public userInfoSave = async (
    params: UserInterface.UserInfo
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post("/api/customer/save", params);
    return result;
  };

  public getMemberCoupons = async (
    params?: any
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(
      `/api/coupon/getMemberCoupons${jsonToQueryString(params)}`
    );
    return result;
  };
  public getWaitForObtainCoupons = async (): Promise<
    HTTPInterface.ResponseResultBase<any>
  > => {
    const result = await requestHttp.get(`/api/coupon/getWaitForObtainCoupons`);
    return result;
  };

  public getMemberExpiredCoupons = async (
    params?: any
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(
      `/api/coupon/getMemberExpiredCoupons${jsonToQueryString(params)}`
    );
    return result;
  };

  public obtainCoupon = async (): Promise<
    HTTPInterface.ResponseResultBase<any>
  > => {
    const result = await requestHttp.get(`/api/coupon/obtainCoupon`);
    return result;
  };
  public GetobtainCoupons = async (
    param: any
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post(`/api/coupon/obtainCoupons`, param);
    return result;
  };
  public getMemberInfo = async (
    merchantId: number
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(
      `/api/memberInfo/getMemberInfo/${merchantId}`
    );
    return result;
  };
  public obtainMerchantCoupon = async (merchantId: number): Promise<
    HTTPInterface.ResponseResultBase<any>
  > => {
    const result = await requestHttp.get(`/api/coupon/obtainCoupon/${merchantId}`);
    return result;
  };
  public getMyAvailableCoupon = async (
    params?: any
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(
      `/api/coupon/getMyAvailableCoupon${jsonToQueryString(params)}`
    );
    return result;
  };
  public countMyMemberCardAndCoupon = async ( ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.get(
      `/api/memberInfo/countMyMemberCardAndCoupon`
    );
    return result;
  };
  public obtainCoupons = async (
    params: any
  ): Promise<HTTPInterface.ResponseResultBase<any>> => {
    const result = await requestHttp.post("/api/coupon/obtainCoupons", params);
    return result;
  };
}

export default new UserService();
