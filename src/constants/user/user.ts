/*
 * @Author: centerm.gaozhiying
 * @Date: 2020-03-03 17:10:08
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-07-23 16:02:18
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
    // sex: number;
    token: string;
    openId: string;
    // loginId: string;
    // name: string;
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
    status?: number;
  }

  interface FetchAbleToUseCoupons {
    amount: number;
    phone: string;
    productIds: any[];
  }

  interface CouponsItem {
    ableToUse: boolean;
    couponCode: string;
    couponId: number;
    couponVO: CouponDetail;
    createTime: string;
    disableReason: string;
    effectiveTime: string;
    id: number;
    invalidTime: string;
    memberId: number;
    merchantIds: string;
    status: string; // 是否使用了，0-未使用，1-已使用
    updateTime: string;
    obtainWay: any;
  }
  interface CouponsItemCenter {
    ableObtainNum: number;
    couponType: number;
    createTime: string;
    discount: number;
    excludeActivityType: string;
    expireTime: number;
    filterType: number;
    id: number;
    merchantId: number;
    merchantIds: string;
    name: string;
    obtainBeginTime: string;
    obtainWay: number;
    status: boolean;
    targetMember: number;
    threshold: number;
    useWay: string;
  }
  interface CouponDetail {
    couponType: number;
    createTime: string;
    discount: number;
    effectiveTime: string;
    excludeActivityType: string;
    expireTime: string;
    filterType: number;
    id: number;
    invalidTime: string;
    limitNum: number;
    merchantIds: string;
    name: string;
    num: number;
    obtainBeginTime: string;
    obtainEndTime: string;
    obtainWay: number;
    remainNum: number;
    status: boolean;
    targetMember: number;
    threshold: number;
    updateTime: string;
    useWay: string;
  }

  interface MemberInfo {
    avatar: string;
    enableMemberPrice: boolean;
    birthDate: string;
    cardNo: string;
    createTime: string;
    id: number;
    level: number;
    levelId: number;
    levelName: string;
    merchantId: number;
    overage: number;
    phoneNumber: number;
    points: number;
    pointsRate: number;
    sex: number;
    username: string;
    couponNum: number;
  }

  interface MemberCount {
    couponNum: number;
    memberCardNum: number;
  }

  interface CardDetail {
    enableMemberPrice: boolean;
    identified: boolean;
    avatar: string;
    cardNo: string;
    createTime: string;
    levelName: string;
    merchantName: string;
    phoneNumber: string;
    sex: string;
    updateTime: string;
    couponNum: number;
    accumulativeMoney: number;
    accumulativePoints: number;
    id: number;
    levelId: number;
    memberDiscount: number;
    merchantId: number;
    overage: number;
    points: number;
    status: number;
    totalAmount: number;
    totalTimes: number;
    obtainMoney: number;
    obtainPoints: number;
  }
  namespace ReducerTypes {
    type RECEIVE_USERINFO = string;
    type RECEIVE_ADDRESS_LIST = string;
    type RECEIVE_COUPONS = string;
    type RECEIVE_MEMBER_INFO = string;
    type RECEIVE_COUPONS_CENTER = string;
    type RECEIVE_COUPONS_MORE = string;
    type RECEIVE_MEMBER_COUNT = string;
  }

  interface UserInterfaceMap {
    reducerInterface: {
      RECEIVE_USERINFO: ReducerTypes.RECEIVE_USERINFO;
      RECEIVE_COUPONS_CENTER: ReducerTypes.RECEIVE_COUPONS_CENTER;
      RECEIVE_MEMBER_INFO: ReducerTypes.RECEIVE_MEMBER_INFO;
      RECEIVE_ADDRESS_LIST: ReducerTypes.RECEIVE_ADDRESS_LIST;
      RECEIVE_COUPONS: ReducerTypes.RECEIVE_COUPONS;
      RECEIVE_COUPONS_MORE: ReducerTypes.RECEIVE_COUPONS_MORE;
      RECEIVE_MEMBER_COUNT: ReducerTypes.RECEIVE_MEMBER_COUNT;
    };
  }
}

class UserInterfaceMap implements UserInterface.UserInterfaceMap {
  public reducerInterface = {
    RECEIVE_USERINFO: "RECEIVE_USERINFO",
    RECEIVE_MEMBER_INFO: "RECEIVE_MEMBER_INFO",
    RECEIVE_COUPONS_CENTER: "RECEIVE_COUPONS_CENTER",
    RECEIVE_ADDRESS_LIST: "RECEIVE_ADDRESS_LIST",
    RECEIVE_COUPONS_MORE: "RECEIVE_COUPONS_MORE",
    RECEIVE_COUPONS: "RECEIVE_COUPONS",
    RECEIVE_MEMBER_COUNT: "RECEIVE_MEMBER_COUNT"
  };
}

export default new UserInterfaceMap();
