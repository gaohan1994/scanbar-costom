/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-03-03 17:13:16 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-18 16:57:04
 */
import requestHttp from "../common/request/request.http";
import { ResponseCode, UserService, UserInterfaceMap, UserInterface } from "../constants";
// import { store } from "../app";

class UserAction {
  
  /**
   * @todo 变动明细More
   *
   * @memberof UserAction
   */
  public getBalanceChangeMore = async (dispatch, param) => {
    const result = await UserService.getBalanceChange(param);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_BALANCECHANGEMORE,
        payload: result.data
      });
      return result;
    }
    return result;
  }
  /**
   * @todo 变动明细
   *
   * @memberof UserAction
   */
  public getBalanceChange = async (dispatch, param) => {
    const result = await UserService.getBalanceChange(param);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_BALANCECHANGE,
        payload: result.data
      });
      return result;
    }
    return result;
  }
  /**
   * @todo 充值
   *
   * @memberof UserAction
   */
  public cashierStore = async (param) => {
    const result = await UserService.cashierStore(param);
    return result;
  }
  /**
   * @todo h获取我的充值规则列表
   *
   * @memberof UserAction
   */
  public getRechargeRule = async (dispatch, param) => {
    const result = await UserService.getRechargeRule(param);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_RECHARGERULE,
        payload: result.data
      });
      return result;
    }
    return result;
  }
    /**
   * @todo h5验证码
   *
   * @memberof UserAction
   */
  public h5Code = async (dispatch, param) => {
    const result = await UserService.h5Code(param);
    return result;
  }
  /**
   * @todo h5验证码
   *
   * @memberof UserAction
   */
  public h5Code = async (dispatch, param) => {
    const result = await UserService.h5Code(param);
    return result;
  }
  /**
   * @todo h5登录
   *
   * @memberof UserAction
   */
  public h5Login = async (dispatch, param) => {
    const result = await UserService.h5Login(param);
    return result;
  }
  /**
   * @todo 获取收货地址列表
   *
   * @memberof UserAction
   */
  public addressList = async (dispatch, param) => {
    const result = await UserService.addressList(param);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_ADDRESS_LIST,
        payload: result.data
      });
      return result;
    }
    return result;
  }

  /**
   * 修改收货地址
   *
   * @memberof UserAction
   */
  public addressEdit = async (params: any) => {
    const result = await UserService.addressEdit(params);
    return result;
  }

  /**
   * @todo 添加收货地址
   *
   * @memberof UserAction
   */
  public addressAdd = async (params: any) => {
    const result = await UserService.addressAdd(params);
    return result;
  }

  /**
  * @todo 删除收货地址
  *
  * @memberof UserAction
  */
  public addressDelete = async (params: any) => {
    const result = await requestHttp.delete(`/api/address/remove/${params.id}`, '');
    return result;
  }

  /**
   * @todo 存储用户信息
   *
   * @memberof UserAction
   */
  public userInfoSave = async (params: any) => {
    const result = await UserService.userInfoSave(params);
    return result;
  }
  /**
   * @todo 获取用户的优惠券 0-未使用 1-已使用
   *
   * @memberof UserAction
   */
  public getMemberCoupons = async (dispatch, params?: UserInterface.FetchMemberCoupons) => {
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
  }

  /**
   * @todo 获取用户已过期的优惠券 0-未使用 1-已使用
   *
   * @memberof UserAction
   */
  public getMemberExpiredCoupons = async (dispatch, params?: UserInterface.FetchMemberCoupons) => {
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
  }
  /**
   * @todo 获取用户的优惠券 0-未使用 1-已使用 分页加载
   *
   * @memberof UserAction
   */
  public getMemberCouponsMore = async (dispatch, params?: UserInterface.FetchMemberCoupons) => {
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
  }

  /**
   * @todo 获取用户已过期的优惠券 0-未使用 1-已使用 分页加载
   *
   * @memberof UserAction
   */
  public getMemberExpiredCouponsMore = async (dispatch, params?: UserInterface.FetchMemberCoupons) => {
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
  }
  
    /**
   * @todo 获取用户可领优惠券，领券中心
   *
   * @memberof UserAction
   */
  public getWaitForObtainCoupons = async (dispatch) => {

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
  }
  /**
   * @todo 领取优惠券
   *
   * @memberof UserAction
   */
  public obtainCoupon = async () => {
    const result = await UserService.obtainCoupon();
    return result;
  }

  /**
   * @todo 领取手动领取的优惠券
   *
   * @memberof UserAction
   */
  public GetobtainCoupons = async (param: any) => {
    const result = await UserService.GetobtainCoupons(param);
    return result;
  }
  /**
   * @todo 获取会员等级信息
   *
   * @memberof UserAction
   */
  public getMemberInfo = async (dispatch) => {
    const result = await UserService.getMemberInfo();
    if (result.code === ResponseCode.success) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_MEMBER_INFO,
        payload: {
          memberInfo: result.data
        }
      });
    }
    return result;
  }

}

export default new UserAction();