import UserInterfaceMap, { UserInterface } from '../constants/user/user';
// import merge from 'lodash.merge';
import { AppReducer } from './';
import weixinSdk from '../common/sdk/weixin/weixin'

export declare namespace UserReducer {
  namespace Reducers {

    interface ChangeCostomIndexAddress {
      type: string;
      payload: {
        address: any
      }
    }

    interface ReceiveCoupons {
      type: string;
      payload: {
        couponList: any
      }
    }

    interface ReceiveCouponsCenter {
      type: string;
      payload: {
        couponListCenter: any
      }
    }
    interface ReceiveUserinfo {
      type: string;
      payload: {
        userinfo: any
      }
    }

    interface ReceiveMemberInfo {
      type: string;
      payload: {
        memberInfo: any;
      }
    }
  }
  
  interface State {
    indexAddress: UserInterface.Address;
    addressList: UserInterface.Address[];
    currentPostion: UserInterface.Address;
    couponList: UserInterface.CouponsItem[];
    couponListCenter: UserInterface.CouponsItemCenter[];
    userinfo: UserInterface.UserInfo;
    memberInfo: UserInterface.MemberInfo;
  }

  type Action = 
    Reducers.ChangeCostomIndexAddress |
    Reducers.ReceiveCoupons |
    Reducers.ReceiveUserinfo |
    Reducers.ReceiveMemberInfo;
}

export const initState: UserReducer.State = {
  indexAddress: {} as any,
  addressList: [],
  currentPostion: {} as any,
  couponList: [],
  couponListCenter: [],
  userinfo: {} as any,
  memberInfo: {} as any,
};

export default function merchant (state: UserReducer.State = initState, action: UserReducer.Action): UserReducer.State {
  switch (action.type) {

    case weixinSdk.reducerInterface.RECEIVE_CURRENT_ADDRESS: {
      const { payload } = action as any;
      return {
        ...state,
        currentPostion: payload
      }
    }

    case UserInterfaceMap.reducerInterface.RECEIVE_ADDRESS_LIST: {
      const { payload } = action as any;
      return {
        ...state,
        addressList: payload
      }
    }

    case weixinSdk.reducerInterface.CHANGE_COSTOM_INDEX_ADDRESS: {
      const { payload } = action as UserReducer.Reducers.ChangeCostomIndexAddress;
      return {
        ...state,
        indexAddress: payload.address
      }
    }
    case UserInterfaceMap.reducerInterface.RECEIVE_COUPONS: {
      const { payload } = action as UserReducer.Reducers.ReceiveCoupons;
      return {
        ...state,
        couponList: payload.couponList
      }
    }
    case UserInterfaceMap.reducerInterface.RECEIVE_COUPONS_MORE: {
      const { payload } = action as UserReducer.Reducers.ReceiveCoupons;
      return {
        ...state,
        couponList: [
          ...state.couponList,
          ...payload.couponList
        ]
      }
    }
    case UserInterfaceMap.reducerInterface.RECEIVE_COUPONS_CENTER: {
      const { payload } = action as unknown as UserReducer.Reducers.ReceiveCouponsCenter;
      return {
        ...state,
        couponListCenter: payload.couponListCenter
      }
    }
    
    case UserInterfaceMap.reducerInterface.RECEIVE_USERINFO: {
      const { payload } = action as UserReducer.Reducers.ReceiveUserinfo;
      return {
        ...state,
        userinfo: payload.userinfo
      }
    }
    case UserInterfaceMap.reducerInterface.RECEIVE_MEMBER_INFO: {
      const { payload } = action as UserReducer.Reducers.ReceiveMemberInfo;
      return {
        ...state,
        memberInfo: payload.memberInfo
      }
    }

    default: {
      return {
        ...state
      };
    }
  }
}

export const getIndexAddress = (state: AppReducer.AppState) => state.user.indexAddress; 

export const getAddressList = (state: AppReducer.AppState) => state.user.addressList;

export const getCurrentPostion = (state: AppReducer.AppState) => state.user.currentPostion;

export const getCouponList = (state: AppReducer.AppState) => state.user.couponList;
export const getcouponListCenter = (state: AppReducer.AppState) => state.user.couponListCenter;

export const getUserinfo = (state: AppReducer.AppState) => {
  if(state.user.userinfo){
    return state.user.userinfo;
  }
};

export const getMemberInfo = (state: AppReducer.AppState) => state.user.memberInfo;
