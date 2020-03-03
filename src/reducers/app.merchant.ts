import MerchantInterfaceMap, { MerchantInterface } from '../constants/merchant/merchant';
// import merge from 'lodash.merge';
import { AppReducer } from './';
import weixinSdk from '../common/sdk/weixin/weixin'

export declare namespace MerchantReducer {
  namespace Reducers {
    interface ReceiveMerchantDetail {
      type: MerchantInterface.ReducerTypes.RECEIVE_MERCHANT_DETAIL;
      payload: MerchantInterface.MerchantDetail;
    }

    interface ReceiveMerchantList {
      type: MerchantInterface.ReducerTypes.RECEIVE_MERCHANT_LIST;
      payload: MerchantInterface.MerchantDetail;
    }

    interface ChangeCostomIndexAddress {
      type: string;
      payload: {
        address: any
      }
    }
  }
  
  interface State {
    merchantDetail: MerchantInterface.MerchantDetail;
    merchantList: MerchantInterface.MerchantDetail[];
    currentMerchantDetail: MerchantInterface.MerchantDetail;
    indexAddress: MerchantInterface.Address;
    addressList: MerchantInterface.Address[];
    currentPostion: MerchantInterface.Address;
    merchantDistance: MerchantInterface.Distance;
  }

  type Action = 
    Reducers.ReceiveMerchantDetail | Reducers.ChangeCostomIndexAddress;
}

export const initState: MerchantReducer.State = {
  merchantDetail: {} as any,
  merchantList: [],
  currentMerchantDetail: {} as any,
  merchantDistance: {} as any,
  indexAddress: {} as any,
  addressList: [],
  currentPostion: {} as any,
};

export default function merchant (state: MerchantReducer.State = initState, action: MerchantReducer.Action): MerchantReducer.State {
  switch (action.type) {

    case MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_DISTANCE: {
      const { payload } = action as any;
      return {
        ...state,
        merchantDistance: payload
      }
    }

    case weixinSdk.reducerInterface.RECEIVE_CURRENT_ADDRESS: {
      const { payload } = action as any;
      return {
        ...state,
        currentPostion: payload
      }
    }

    case MerchantInterfaceMap.reducerInterface.RECEIVE_ADDRESS_LIST: {
      const { payload } = action as any;
      return {
        ...state,
        addressList: payload
      }
    }

    case weixinSdk.reducerInterface.CHANGE_COSTOM_INDEX_ADDRESS: {
      const { payload } = action as MerchantReducer.Reducers.ChangeCostomIndexAddress;
      return {
        ...state,
        indexAddress: payload.address
      }
    }

    case MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_DETAIL: {
      const { payload } = action as MerchantReducer.Reducers.ReceiveMerchantDetail;
      return {
        ...state,
        merchantDetail: payload
      };
    }

    case MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_LIST: {
      const { payload } = action as any
      return {
        ...state,
        merchantList: payload
      };
    }
    case MerchantInterfaceMap.reducerInterface.RECEIVE_CURRENT_MERCHANT_LIST: {
      const { payload } = action as any
      return {
        ...state,
        currentMerchantDetail: payload
      };
    }

    default: {
      return {
        ...state
      };
    }
  }
}

export const getMerchantDetail = (state: AppReducer.AppState) => state.merchant.merchantDetail;

export const getMerchantList = (state: AppReducer.AppState) => state.merchant.merchantList;

export const getCurrentMerchantDetail = (state: AppReducer.AppState) => state.merchant.currentMerchantDetail;

export const getIndexAddress = (state: AppReducer.AppState) => state.merchant.indexAddress; 

export const getAddressList = (state: AppReducer.AppState) => state.merchant.addressList;

export const getCurrentPostion = (state: AppReducer.AppState) => state.merchant.currentPostion;

export const getMerchantDistance = (state: AppReducer.AppState) => state.merchant.merchantDistance;