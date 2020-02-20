
/**
 * @Author: Ghan 
 * @Date: 2019-11-08 10:28:21 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-02-20 16:06:10
 */
import { ResponseCode, OrderService, OrderInterface, OrderInterfaceMap } from '../constants/index';
import { store } from '../app';
import { OrderReducer } from '../reducers/app.order';

class OrderAction {

  public orderList = async (params: OrderInterface.OrderListFetchFidle) => {
    const result = await OrderService.orderList(params);

    if (result.code === ResponseCode.success) {
      const reducer: OrderReducer.Reducers.OrderListReducer = {
        type: OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_LIST,
        payload: {
          fetchFidle: params,
          ...result.data as any
        }
      };
      store.dispatch(reducer);
    }
    return result;
  }

  public orderDetail = async (params: OrderInterface.OrderDetailFetchField) => {
    const result = await OrderService.orderDetail(params);

    if (result.code === ResponseCode.success) {
      const reducer: OrderReducer.Reducers.OrderDetailReducer = {
        type: OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_DETAIL,
        payload: {
          data: result.data
        }
      };
      store.dispatch(reducer);
    }
    return result;
  }

  public orderCount = async () => {
    const result = await OrderService.orderCount();

    if (result.code === ResponseCode.success) {
      const reducer: OrderReducer.Reducers.OrderDetailReducer = {
        type: OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_COUNT,
        payload: {
          data: result.data
        }
      };
      store.dispatch(reducer);
    }
    return result;
  }

  public orderCancle = async (params: OrderInterface.OrderDetailFetchField) => {
    const result = await OrderService.orderClose(params);
    return result;
  }


  public orderPayType = (params: number | OrderInterface.OrderDetail): string => {
    // 支付方式 0=现金,1=支付宝主扫,2=微信主扫,3=支付宝被扫,4微信被扫,5=银行卡,6=刷脸
    // 支付方式 0=现金,1=支付宝,2=微信,3=银行卡,4=刷脸
    const type = typeof params === 'number' ? params : params.order.payType;
    switch (type) {
      case 0: {
        return '现金';
      }
      case 1: {
        return '支付宝';
      }
      case 2: {
        return '微信';
      }
      case 3: {
        return '支付宝';
      }
      case 4: {
        return '微信';
      }
      case 5: {
        return '银行卡';
      }
      case 6: {
        return '刷脸';
      }
      default: {
        return '微信';
      }
    }
  }

  public orderStatus = (params: OrderInterface.OrderDetail, time?: number ): any => {
    const { order } = params;
    const { transFlag, transType, deliveryType } = order;
    if (time && time === -1) {
      return {
        title: '已取消',
        detail: '超时未支付或您已取消，订单已取消'
      }
    }
    if ((transFlag === 3 || transFlag === 4) && transType === 0 && deliveryType === 0) {
      return {
        title: '待自提',
        detail: '请去门店自提商品'
      }
    } else if ((transFlag === 0 && transType === 0) || transFlag === -1) {
      return {
        title: '待支付',
        detail: ''
      }
    } else if (
      (transFlag === 3 || transFlag === 4)
      && transType === 0
      && (deliveryType === 1 || deliveryType === 2)
    ) {
      return {
        title: '待收货',
        detail: '商品待商家配送，请耐心等待'
      }
    } else if (transFlag === 2) {
      return {
        title: '已取消',
        detail: '超时未支付或您已取消，订单已取消'
      }
    } else if (transFlag === 1) {
      return {
        title: '已完成',
        detail: '订单已完成，感谢您的信任'
      }
    } else {
      return {
        title: '已完成',
        detail: '订单已完成，感谢您的信任'
      }
    }
  }
}

export default new OrderAction();