
/**
 * @Author: Ghan 
 * @Date: 2019-11-08 10:28:21 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-04 14:22:25
 */
import { ResponseCode, OrderService, OrderInterface, OrderInterfaceMap } from '../constants/index';
import { store } from '../app';
import { OrderReducer } from '../reducers/app.order';

class OrderAction {

  /**
   * @todo 获取订单列表
   *
   * @memberof OrderAction
   */
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

  /**
   * @todo 获取订单详情
   *
   * @memberof OrderAction
   */
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

  /**
   * @todo 获取各个状态的订单数量
   *
   * @memberof OrderAction
   */
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

  /**
   * @todo 取消订单
   *
   * @memberof OrderAction
   */
  public orderCancle = async (params: OrderInterface.OrderDetailFetchField) => {
    const result = await OrderService.orderClose(params);
    return result;
  }

  /**
   * @todo 获取订单状态map
   *
   * @memberof OrderAction
   */
  public orderAllStatus = async () => {
    const result = await OrderService.orderAllStatus();
    if (result.code === ResponseCode.success) {
      const reducer: OrderReducer.Reducers.OrderAllStatusReducer = {
        type: OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_ALL_STATUS,
        payload: {
          orderAllStatus: result.data.rows
        }
      };
      store.dispatch(reducer);
    }
    return result;
  }

  public getFetchType = (currentType: any) => {
    switch (currentType) {
      case 0:
        return {};
      case 1:
        return {
          transFlags: 0
        }
      case 2:
        return {
          transFlags: '10,12,3,4'
        }
      case 3:
        return {
          transFlags: 11
        }
      default:
        return {};
    }
  }

  /**
   * @todo 获取订单支付方式
   *
   * @memberof OrderAction
   */
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

  /**
   * @todo 获取订单对应的状态
   *
   * @memberof OrderAction
   */
  public orderStatus = (orderAllStatus: OrderInterface.OrderAllStatus[], params: OrderInterface.OrderDetail, time?: number): any => {
    const { order } = params;
    // const { transFlag } = order;
    if (time && time === -1) {
      return {
        title: '已取消',
        detail: '超时未支付或您已取消，订单已取消'
      }
    }
    if (order && order.transFlag !== undefined) {
      switch (order.transFlag) {
        case -1:
          return {
            title: '支付失败',
            detail: '请重新下单'
          }
        case 0:
          return {
            title: '待支付',
            detail: ''
          }
        case 1:
          return {
            title: '已完成',
            detail: '订单已完成，感谢您的信任'
          }
        case 2:
          return {
            title: '已取消',
            detail: '超时未支付或您已取消，订单已取消'
          }
        case 10:
        case 12:
          return {
            title: '待收货',
            detail: '商品待商家配送，请耐心等待'
          }
        case 11:
          return {
            title: '待自提',
            detail: '请去门店自提商品'
          }
        default:
          for (let i = 0; i < orderAllStatus.length; i++) {
            if (order.transFlag === Number(orderAllStatus[i].dictValue)) {
              return {
                title: orderAllStatus[i].dictLabel,
                detail: ''
              }
            }
          }
      }
    } 
    return {
      title: '',
      detail: ''
    }

  }
}

export default new OrderAction();