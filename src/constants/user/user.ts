/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-03-03 17:10:08 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-16 14:08:39
 */

export declare namespace UserInterface {

  interface Address {
    address: string;
    contact: string;
    createTime: string;
    houseNumber: string;
    phone: string;
    updateTime: number;
    isDefault: number;
    flag: number;
    id: number;
    latitude: number;
    longitude: number;
    userId: number;
  }

  interface UserInfo {
    avatar: string;
    nickname: string;
    phone: string;
    sex: number;
    token: string;
    loginId: string;
    name: string;
  }

  interface CouponInfo {
    id: number;
    couponType: number;
    createTime: string;
    disable: boolean;
    discount: number;
    effectiveTime: string;
    expireTime: string;
    invalidTime: string;
    filterType: string;
    limitNum: number;
    merchantId: number;
    name: string;
    num: number;
    obtainBeginTime: string;
    obtainEndTime: string;
    obtainWay: number;
    remainNum: number;
    threshold: number;
    updateTime: string;
    useWay: string;
  }

  interface FetchMemberCoupons {
    merchantId: number;
    status: number;
  }
  namespace ReducerTypes {
    type RECEIVE_USERINFO = string;
    type RECEIVE_ADDRESS_LIST = string;
    type RECEIVE_COUPONS = string;
  }

  interface UserInterfaceMap {
    reducerInterface: {
      RECEIVE_USERINFO: ReducerTypes.RECEIVE_USERINFO;
      RECEIVE_ADDRESS_LIST: ReducerTypes.RECEIVE_ADDRESS_LIST;
      RECEIVE_COUPONS: ReducerTypes.RECEIVE_COUPONS
    };
  }
}

class UserInterfaceMap implements UserInterface.UserInterfaceMap {
  public reducerInterface = {
    RECEIVE_USERINFO: 'RECEIVE_USERINFO',
    RECEIVE_ADDRESS_LIST: 'RECEIVE_ADDRESS_LIST',
    RECEIVE_COUPONS: 'RECEIVE_COUPONS',
  };
}

export default new UserInterfaceMap();