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
  }
  
  interface State {
    indexAddress: UserInterface.Address;
    addressList: UserInterface.Address[];
    currentPostion: UserInterface.Address;
  }

  type Action = 
    Reducers.ChangeCostomIndexAddress;
}

export const initState: UserReducer.State = {
  indexAddress: {} as any,
  addressList: [],
  currentPostion: {} as any,
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