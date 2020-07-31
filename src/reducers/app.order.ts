/**
 * @Author: Ghan 
 * @Date: 2019-12-09 13:51:19 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-13 09:56:05
 */

import merge from 'lodash.merge';
import { OrderInterface, OrderInterfaceMap, UserInterface } from '../constants/index';
import { AppReducer } from '.';

export declare namespace OrderReducer {

  namespace Reducers {

    interface OrderCurrentTypeReducer {
      type: OrderInterface.CHANGR_CURRENT_TYPE;
      payload: {
        currentType: number;
      };
    }
    interface OrderListReducer {
      type: OrderInterface.RECEIVE_ORDER_LIST;
      payload: {
        fetchFidle: OrderInterface.OrderListFetchFidle;
        total: number;
        rows: OrderInterface.OrderDetail[];
      };
    }

    interface OrderDetailReducer {
      type: OrderInterface.RECEIVE_ORDER_DETAIL;
      payload: {
        data: OrderInterface.OrderDetail;
      };
    }

    interface OrderCountReducer {
      type: OrderInterface.RECEIVE_ORDER_COUNT;
      payload: {
        data: OrderInterface.OrderCount;
      };
    }

    interface OrderAllStatusReducer {
      type: OrderInterface.RECEIVE_ORDER_ALL_STATUS;
      payload: {
        orderAllStatus: any[];
      };
    }

    interface AbleToUseCouponsReducer {
      type: OrderInterface.RECEIVE_ABLE_TO_USE_COUPONS
      payload: {
        ableToUseCouponList: UserInterface.CouponsItem[]
      }
    }

    interface PointConfigReducer {
      type: OrderInterface.RECEIVE_POINTCONFIG;
      payload: {
        pointConfig: any;
      };
    }

    interface DeliveryFeeReducer {
      type: OrderInterface.RECEIVE_DELIVERYFEE;
      payload: {
        DeliveryFee: any;
      };
    }
  }

  interface State {
    orderList: Array<OrderInterface.OrderDetail>;
    orderListTotal: number;
    orderDetail: OrderInterface.OrderDetail;
    orderCount: OrderInterface.OrderCount;
    orderAllStatus: any[];
    currentType: number;
    ableToUseCouponList: UserInterface.CouponsItem[];
    pointConfig: any;
    DeliveryFee: any;
  }

  type Action =
    Reducers.OrderCurrentTypeReducer
    | Reducers.OrderListReducer
    | Reducers.OrderDetailReducer
    | Reducers.OrderCountReducer
    | Reducers.OrderAllStatusReducer
    | Reducers.AbleToUseCouponsReducer;
}

const initState: OrderReducer.State = {
  orderList: [],
  orderListTotal: -1,
  orderDetail: {} as any,
  orderCount: {} as any,
  orderAllStatus: [],
  currentType: 0,
  ableToUseCouponList: [],
  pointConfig: {},
  DeliveryFee: 0,
};

export default function orderReducer(
  state: OrderReducer.State = initState,
  action: OrderReducer.Action
): OrderReducer.State {

  switch (action.type) {

    case OrderInterfaceMap.reducerInterfaces.CHANGR_CURRENT_TYPE: {
      const { payload } = action as OrderReducer.Reducers.OrderCurrentTypeReducer;
      const { currentType } = payload;
      return {
        ...state,
        currentType: currentType
      };
    }

    case OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_DETAIL: {
      const { payload } = action as OrderReducer.Reducers.OrderDetailReducer;
      const { data } = payload;
      return {
        ...state,
        orderDetail: data
      };
    }

    case OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_LIST: {
      const { payload } = action as OrderReducer.Reducers.OrderListReducer;

      let nextOrderList: OrderInterface.OrderDetail[] = [];
      if (payload.fetchFidle.pageNum === 1) {
        nextOrderList = payload.rows;
      } else {
        const prevOrderList: OrderInterface.OrderDetail[] = merge([], state.orderList);
        nextOrderList = prevOrderList.concat(payload.rows);
      }
      return {
        ...state,
        orderListTotal: payload.total,
        orderList: nextOrderList
      };
    }

    case OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_COUNT: {
      const { payload } = action as OrderReducer.Reducers.OrderCountReducer;
      const { data } = payload;
      return {
        ...state,
        orderCount: data
      };
    }
    case OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_ALL_STATUS: {
      const { payload } = action as OrderReducer.Reducers.OrderAllStatusReducer;
      const { orderAllStatus } = payload;
      return {
        ...state,
        orderAllStatus: orderAllStatus
      };
    }
    case OrderInterfaceMap.reducerInterfaces.RECEIVE_ABLE_TO_USE_COUPONS: {
      const { payload } = action as OrderReducer.Reducers.AbleToUseCouponsReducer;
      return {
        ...state,
        ableToUseCouponList: payload.ableToUseCouponList
      };
    }
    case OrderInterfaceMap.reducerInterfaces.RECEIVE_DELIVERYFEE: {
      const { payload } = action as unknown as OrderReducer.Reducers.DeliveryFeeReducer;
      const { DeliveryFee } = payload;
      return {
        ...state,
        DeliveryFee: DeliveryFee
      };
    }
    case OrderInterfaceMap.reducerInterfaces.RECEIVE_POINTCONFIG: {
      const { payload } = action as unknown as OrderReducer.Reducers.PointConfigReducer;
      const { pointConfig } = payload;
      return {
        ...state,
        pointConfig: pointConfig
      };
    }
    default: {
      return {
        ...state
      };
    }
  }
}

export const getCurrentType = (state: AppReducer.AppState) => state.order.currentType;

export const getOrderList = (state: AppReducer.AppState) => state.order.orderList;

export const getOrderListTotal = (state: AppReducer.AppState) => state.order.orderListTotal;

export const getOrderDetail = (state: AppReducer.AppState) => state.order.orderDetail;

export const getOrderCount = (state: AppReducer.AppState) => state.order.orderCount;

export const getOrderAllStatus = (state: AppReducer.AppState) => state.order.orderAllStatus;

export const getAbleToUseCouponList = (state: AppReducer.AppState) => state.order.ableToUseCouponList;

export const getPointConfig = (state: AppReducer.AppState) => state.order.pointConfig;

export const getDeliveryFee = (state: AppReducer.AppState) => state.order.DeliveryFee;