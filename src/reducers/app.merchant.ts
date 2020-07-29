import MerchantInterfaceMap, { MerchantInterface } from '../constants/merchant/merchant';
// import merge from 'lodash.merge';
import { AppReducer } from './';
import { BASE_PARAM } from '../common/util/config';

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

    interface ReceiveMerchantActivity {
      type: string;
      payload: any;
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
    advertisement: any[];
    activityList: any[];
    orderPayType: any;
  }

  type Action =
    Reducers.ReceiveMerchantDetail | Reducers.ChangeCostomIndexAddress | Reducers.ReceiveMerchantActivity;
}

export const initState: MerchantReducer.State = {
  merchantDetail: {} as any,
  merchantList: [],
  currentMerchantDetail: {
    id: BASE_PARAM.MCHID
  } as any,
  merchantDistance: {} as any,
  advertisement: [],
  activityList: [],
  orderPayType: process.env.TARO_ENV === 'h5' ? 2 : 8,
};

export default function merchant(state: MerchantReducer.State = initState, action: MerchantReducer.Action): MerchantReducer.State {
  switch (action.type) {
    case MerchantInterfaceMap.reducerInterface.SET_PAYTYPE: {
      const { payload: {orderPayType} } = action;
      return {
        ...state,
        orderPayType: orderPayType
      };
    }
    case MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ACTIVITYLIST: {
      const { payload } = action;
      return {
        ...state,
        activityList: payload
      };
    }

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
    case MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ADVERTISEMENT: {
      const { payload } = action as any
      return {
        ...state,
        advertisement: payload
      };
    }

    default: {
      return {
        ...state
      };
    }
  }
}
export const getOrderPayType = (state: AppReducer.AppState) => state.merchant.orderPayType;

export const getMerchantDetail = (state: AppReducer.AppState) => state.merchant.merchantDetail;

export const getMerchantList = (state: AppReducer.AppState) => state.merchant.merchantList;

export const getCurrentMerchantDetail = (state: AppReducer.AppState) => state.merchant.currentMerchantDetail;

export const getMerchantDistance = (state: AppReducer.AppState) => state.merchant.merchantDistance;

export const getMerchantAdvertisement = (state: AppReducer.AppState) => state.merchant.advertisement;

export const getMerchantActivityList = (state: AppReducer.AppState) => state.merchant.activityList;