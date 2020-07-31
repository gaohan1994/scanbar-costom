/*
 * @Author: centerm.gaozhiying
 * @Date: 2020-03-03 17:13:16
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-07-29 10:42:45
 */
import requestHttp from "../common/request/request.http";
import {
  ResponseCode,
  UserService,
  UserInterfaceMap,
  UserInterface,
  jsonToQueryString
} from "../constants";
import { store } from "../app";
import { MerchantInterface } from '../constants';

class UserAction {
  /**
   * @todo h5验证码
   *
   * @memberof UserAction
   */
  public h5Code = async (dispatch, param) => {
    const result = await UserService.h5Code(param);
    return result;
  };
  /**
   * @todo h5登录
   *
   * @memberof UserAction
   */
  public h5Login = async (dispatch, param) => {
    const result = await UserService.h5Login(param);
    return result;
  };
  /**
   * @todo 获取收货地址列表
   *
   * @memberof UserAction
   */
  public addressList = async (dispatch: any, param: any) => {
    const result = await UserService.addressList(param);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_ADDRESS_LIST,
        payload: result.data
      });
    }
    return result;
  };

  /**
   * 修改收货地址
   *
   * @memberof UserAction
   */
  public addressEdit = async (params: any) => {
    const result = await UserService.addressEdit(params);
    return result;
  };

  /**
   * @todo 添加收货地址
   *
   * @memberof UserAction
   */
  public addressAdd = async (params: any) => {
    const result = await UserService.addressAdd(params);
    return result;
  };

  /**
   * @todo 删除收货地址
   *
   * @memberof UserAction
   */
  public addressDelete = async (params: any) => {
    const result = await requestHttp.delete(
      `/api/address/remove/${params.id}`,
      ""
    );
    return result;
  };

  /**
   * @todo 存储用户信息
   *
   * @memberof UserAction
   */
  public userInfoSave = async (params: any) => {
    const result = await UserService.userInfoSave(params);
    return result;
  };
  /**
   * @todo 获取用户的优惠券 0-未使用 1-已使用
   *
   * @memberof UserAction
   */
  public getMemberCoupons = async (
    dispatch,
    params?: UserInterface.FetchMemberCoupons
  ) => {
    const result = await UserService.getMemberCoupons(params);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_COUPONS,
        payload: {
          couponList: result.data.rows
        }
      });
    }
    return result;
  };

  /**
   * @todo 获取用户已过期的优惠券 0-未使用 1-已使用
   *
   * @memberof UserAction
   */
  public getMemberExpiredCoupons = async (
    dispatch,
    params?: UserInterface.FetchMemberCoupons
  ) => {
    const result = await UserService.getMemberExpiredCoupons(params);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_COUPONS,
        payload: {
          couponList: result.data.rows
        }
      });
    }
    return result;
  };
  /**
   * @todo 获取用户的优惠券 0-未使用 1-已使用 分页加载
   *
   * @memberof UserAction
   */
  public getMemberCouponsMore = async (
    dispatch,
    params?: UserInterface.FetchMemberCoupons
  ) => {
    const result = await UserService.getMemberCoupons(params);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_COUPONS_MORE,
        payload: {
          couponList: result.data.rows
        }
      });
    }
    return result;
  };

  /**
   * @todo 获取用户已过期的优惠券 0-未使用 1-已使用 分页加载
   *
   * @memberof UserAction
   */
  public getMemberExpiredCouponsMore = async (
    dispatch,
    params?: UserInterface.FetchMemberCoupons
  ) => {
    const result = await UserService.getMemberExpiredCoupons(params);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_COUPONS_MORE,
        payload: {
          couponList: result.data.rows
        }
      });
    }
    return result;
  };

  /**
   * @todo 获取用户可领优惠券，领券中心
   *
   * @memberof UserAction
   */
  public getWaitForObtainCoupons = async dispatch => {
    const result = await UserService.getWaitForObtainCoupons();
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_COUPONS_CENTER,
        payload: {
          couponListCenter: result.data.rows
        }
      });
    }
    return result;
  };
  /**
   * @todo 领取优惠券
   *
   * @memberof UserAction
   */
  public obtainCoupon = async () => {
    const result = await UserService.obtainCoupon();
    return result;
  };

  /**
   * @todo 领取手动领取的优惠券
   *
   * @memberof UserAction
   */
  public GetobtainCoupons = async (param: any) => {
    const result = await UserService.GetobtainCoupons(param);
    return result;
  };
  /**
   * @todo 获取会员等级信息
   *
   * @memberof UserAction
   */
  public getMemberInfo = async (dispatch: any, currentMerchantDetail: MerchantInterface.MerchantDetail) => {
    const result = await UserService.getMemberInfo(currentMerchantDetail.id);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_MEMBER_INFO,
        payload: {
          memberInfo: result.data
        }
      });
    }
    return result;
  };

  public getMyMemberCard = async (param: any) => {
    const result = await requestHttp.get(`/memberInfo/getMyMemberCard`, param);
    return result;
  };

  public getMerchantAttention = async (params?: any) => {
    const address = store.getState().user.indexAddress;
    if (address && address.longitude) {
      const result = await requestHttp.get(
        `/merchantInfo/getMerchantAttention${jsonToQueryString({
          longitude: address.longitude,
          latitude: address.latitude,
          ...params
        })}`
      );
      return result;
    }
    return {};
  };

  public obtainMerchantCoupon = async (merchantId: number) => {
    const result = await UserService.obtainMerchantCoupon(merchantId);
    if (result.code === ResponseCode.success) {
      return {
        success: true,
        result: result.data
      }
    } else {
      return {
        success: false,
        result: result.msg
      }
    }
  };

  public obtainMerchantCoupons = async (params: any) => {
    const result = await UserService.obtainMerchantCoupons(params);
    if (result.code === ResponseCode.success) {
      return {
        success: true,
        result: result.data
      }
    } else {
      return {
        success: false,
        result: result.msg
      }
    }
  };

  public getMyAvailableCoupon = async (
    dispatch,
    params?: any
  ) => {
    const result = await UserService.getMyAvailableCoupon(params);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_COUPONS,
        payload: {
          couponList: result.data.rows
        }
      });
    }
    return result;
  }

  public getMyAvailableCouponMore = async (
    dispatch,
    params?: any
  ) => {
    const result = await UserService.getMyAvailableCoupon(params);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_COUPONS_MORE,
        payload: {
          couponList: result.data.rows
        }
      });
    }
    return result;
  }

  public countMyMemberCardAndCoupon = async (dispatch: any) => {
    const result = await UserService.countMyMemberCardAndCoupon();
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_MEMBER_COUNT,
        payload: {
          memberCount: result.data
        }
      });
    }
    return result;
  };
}

export default new UserAction();
