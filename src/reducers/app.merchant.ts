import MerchantInterfaceMap, { MerchantInterface } from '../constants/merchant/merchant';
// import merge from 'lodash.merge';
import { AppReducer } from './';

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
    case MerchantInterfaceMap.reducerInterface.RECEIVE_CURRENT_MERCHANT_DETAIL: {
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

export const getMerchantDistance = (state: AppReducer.AppState) => state.merchant.merchantDistance;