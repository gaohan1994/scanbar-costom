
/**
 * @Author: Ghan 
 * @Date: 2019-11-08 10:28:21 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-17 16:43:55
 */
import { ResponseCode, OrderService, OrderInterface, OrderInterfaceMap, MerchantInterfaceMap } from '../constants/index';
// import { store } from '../app';
import { OrderReducer } from '../reducers/app.order';
import Taro from '@tarojs/taro';
import merchant from '../reducers/app.user';

class OrderAction {
  
  /**
   * @todo 获取试算金额
   *
   * @memberof OrderAction
   */
  public getComputeMoney = async (dispatch, param) => {
    const result = await OrderService.getComputeMoney(param);
    if (result.code === ResponseCode.success) {
      const reducer: OrderReducer.Reducers.OrderDetailReducer = {
        type: OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_DETAIL_COMPUTE,
        payload: {
          data: result.data
        }
      };
      dispatch(reducer);
      if (result.data.orderComputeBO.transAmount === 0) {
        let payType = 7;
        dispatch({
          type: MerchantInterfaceMap.reducerInterface.SET_PAYTYPE,
          payload: {
            orderPayType: payType
          }
        })
      } else {
        let payType = 8;
        if(process.env.TARO_ENV === 'h5'){
          payType = 2;
        }
        dispatch({
          type: MerchantInterfaceMap.reducerInterface.SET_PAYTYPE,
          payload: {
            orderPayType: payType
          }
        })
      }
    } else {
      Taro.showToast({
        title: result.msg,
        icon: 'none',
        duration: 2000
      })
    }
    return result;
  }
  /**
   * @todo 获取打包费
   *
   * @memberof OrderAction
   */
  public getDeliveryFee = async (dispatch, param) => {
    const result = await OrderService.getDeliveryFee(param);
    if (result.code === ResponseCode.success) {
      const reducer: OrderReducer.Reducers.DeliveryFeeReducer = {
        type: OrderInterfaceMap.reducerInterfaces.RECEIVE_DELIVERYFEE,
        payload: {
          DeliveryFee: result.data
        }
      };
      dispatch(reducer);
    } else {
      Taro.showToast({
        title: result.msg,
        icon: 'none',
        duration: 2000
      })
    }
    return result;
  }
  /**
   * @todo 获取积分配置
   *
   * @memberof OrderAction
   */
  public getPointConfig = async (dispatch) => {
    const result = await OrderService.getPointConfig();
    if (result.code === ResponseCode.success) {
      const reducer: OrderReducer.Reducers.PointConfigReducer = {
        type: OrderInterfaceMap.reducerInterfaces.RECEIVE_POINTCONFIG,
        payload: {
          pointConfig: result.data
        }
      };
      dispatch(reducer);
    }
    return result;
  }
  /**
   * @todo 获取订单列表
   *
   * @memberof OrderAction
   */
  public orderList = async (dispatch, params: OrderInterface.OrderListFetchFidle) => {
    const result = await OrderService.orderList(params);

    if (result.code === ResponseCode.success) {
      const reducer: OrderReducer.Reducers.OrderListReducer = {
        type: OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_LIST,
        payload: {
          fetchFidle: params,
          ...result.data as any
        }
      };
      dispatch(reducer);
    }
    return result;
  }

  /**
   * @todo 获取订单详情
   *
   * @memberof OrderAction
   */
  public orderDetail = async (dispatch, params: OrderInterface.OrderDetailFetchField) => {
    const result = await OrderService.orderDetail(params);

    if (result.code === ResponseCode.success) {
      const reducer: OrderReducer.Reducers.OrderDetailReducer = {
        type: OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_DETAIL,
        payload: {
          data: result.data
        }
      };
      dispatch(reducer);
    }
    return result;
  }

  /**
   * @todo 获取订单详情
   *
   * @memberof OrderAction
   */
  public orderRefundDetail = async (params: OrderInterface.OrderDetailFetchField) => {
    const result = await OrderService.orderDetail(params);
    return result;
  }

  /**
   * @todo 获取各个状态的订单数量
   *
   * @memberof OrderAction
   */
  public orderCount = async (dispatch) => {
    const result = await OrderService.orderCount();

    if (result.code === ResponseCode.success) {
      const reducer: OrderReducer.Reducers.OrderDetailReducer = {
        type: OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_COUNT,
        payload: {
          data: result.data
        }
      };
      dispatch(reducer);
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
   * @todo 退货/取消订单申请
   *
   * @memberof OrderAction
   */
  public orderRefund = async (params: OrderInterface.RefundOrderParams) => {
    const result = await OrderService.orderRefund(params);
    return result;
  }

  /**
   * @todo 取消（退货/取消订单）申请
   *
   * @memberof OrderAction
   */
  public orderRefundCancel = async (params: OrderInterface.OrderDetailFetchField) => {
    const result = await OrderService.orderRefundCancel(params);
    return result;
  }

  /**
   * @todo 获取可用优惠券
   *
   * @memberof OrderAction
   */
  public getAbleToUseCoupon  = async (dispatch,params: any) => {
    const result = await OrderService.getAbleToUseCoupon(params);
    if (result.code === ResponseCode.success) {
      const reducer: OrderReducer.Reducers.AbleToUseCouponsReducer = {
        type: OrderInterfaceMap.reducerInterfaces.RECEIVE_ABLE_TO_USE_COUPONS,
        payload: {
          ableToUseCouponList: result.data.rows
        }
      };
      dispatch(reducer);
    }
    return result;
  }

  /**
   * @todo 获取订单状态map
   *
   * @memberof OrderAction
   */
  public orderAllStatus = async (dispatch) => {
    const result = await OrderService.orderAllStatus();
    if (result.code === ResponseCode.success) {
      const reducer: OrderReducer.Reducers.OrderAllStatusReducer = {
        type: OrderInterfaceMap.reducerInterfaces.RECEIVE_ORDER_ALL_STATUS,
        payload: {
          orderAllStatus: result.data.rows
        }
      };
      dispatch(reducer);
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
          deliveryStatus: 0
        }
      case 3:
        return {
          deliveryStatus: 2
        }
      case 4:
        return {
          deliveryStatus: 1
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
      case 7: {
        return '储值';
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
    // 待发货的退款状态
    if(!order){
      return {}
    }
    if (order.deliveryStatus === 0 && order.transFlag === 1 && order.afterSaleStatus === 0) {
      return {
        title: "等待商家处理",
        detail: "取消订单申请已提交，等待商家处理"
      }
    } 
    else if (order.deliveryStatus === 0 && order.transFlag === 1 && order.afterSaleStatus === 2) {
      return {
        // title: "您已撤销取消订单申请",
        title: "待发货",
        detail: "您已撤销取消订单申请，等待商家发货"
      };
    }  
    else if (order.deliveryStatus === 0 && order.transFlag === 1 && order.afterSaleStatus === 4) {
      return {
        title: "商家同意取消订单",
        detail: "商家同意取消订单，金额将原路退回"
      };
    } else if (order.deliveryStatus === 0 && order.transFlag === 1 && order.afterSaleStatus === 5) {
      return {
        // title: "商家拒绝了取消订单",
        title: "待发货",
        detail: "商家拒绝了您的取消订单申请"
      };
    } else if (order.deliveryStatus === 0 && order.transFlag === 2 && order.afterSaleStatus === 6) {
      return {
        title: "取消订单成功",
        detail: "取消订单成功，金额已原路退回"
      };
    }
    // 待自提的退款状态
     else if (order.deliveryStatus === 1 && order.transFlag === 1 && order.afterSaleStatus === 0) {
      return {
        title: "等待商家处理",
        detail: "取消订单申请已提交，等待商家处理"
      };
    } 
    // else if (order.deliveryStatus === 1 && order.transFlag === 1 && order.afterSaleStatus === 2) {
    //   return {
    //     title: "您已撤销取消订单申请",
    //     detail: "您已撤销取消订单申请，请去门店自提商品"
    //   };
    // }  
    else if (order.deliveryStatus === 1 && order.transFlag === 1 && order.afterSaleStatus === 4) {
      return {
        title: "商家同意取消订单",
        detail: "商家同意取消订单，金额将原路退回"
      };
    } else if (order.deliveryStatus === 1 && order.transFlag === 1 && order.afterSaleStatus === 5) {
      return {
        // title: "商家拒绝了取消订单",
        title: "待自提",
        detail: "商家拒绝了您的取消订单申请"
      };
    } else if (order.deliveryStatus === 1 && order.transFlag === 2 && order.afterSaleStatus === 6) {
      return {
        title: "取消订单成功",
        detail: "取消订单成功，金额已原路退回"
      };
    }

    // // 待收货
    else if (order.deliveryStatus === 2 && order.transFlag === 1 && order.afterSaleStatus === 1) {
      return {
        title: "等待商家处理",
        detail: "取消退货申请成功"
      };
    } 
    else if (order.deliveryStatus === 2 && order.transFlag === 1 && order.afterSaleStatus === 3) {
      return {
        // title: "您已撤销退货申请",
        title: "待收货",
        detail: "您已撤销退货申请"
      };
    }  
    else if (order.deliveryStatus === 2 && order.transFlag === 1 && order.afterSaleStatus === 4) {
      if(order.refundStatus === 1) {
        return {
          title: "部分商品已成功退回",
          detail: "退货金额已原路退回"
        };
      } else {
        return {
          title: "商家同意退货",
          detail: "商家同意退货，请您将商品退回"
        };
      }
    } else if (order.deliveryStatus === 1 && order.transFlag === 1 && order.afterSaleStatus === 5 || order.deliveryStatus === 2 && order.transFlag === 1 && order.afterSaleStatus === 5) {
      return {
        // title: "商家拒绝退货",
        title: "待收货",
        detail: "商家拒绝了您的退货申请"
      };
    } else if (order.deliveryStatus === 1 && order.transFlag === 2 && order.afterSaleStatus === 6) {
      return {
        title: "退货成功",
        detail: "退货金额已原路退回"
      };
    }

    // 配送完成
    else if (order.deliveryStatus === 3 && order.transFlag === 3 && order.afterSaleStatus === 1) {
      return {
        title: "待商家处理",
        detail: "申请退货"
      };
    } 
    else if (order.deliveryStatus === 3 && order.transFlag === 3 && order.afterSaleStatus === 3) {
      return {
        title: "已完成",
        detail: "您已撤销退货申请"
      };
    }  else if (order.deliveryStatus === 3 && order.transFlag === 3 && order.afterSaleStatus === 4) {
      return {
        title: "商家同意退货",
        detail: "商家同意退货，请您将商品退回"
      };
    } else if (order.deliveryStatus === 3 && order.transFlag === 3 && order.afterSaleStatus === 5) {
      return {
        title: "商家拒绝退货",
        detail: "商家拒绝了您的退货申请"
      };
    } else if (order.deliveryStatus === 3 && order.transFlag === 3 && order.afterSaleStatus === 6) {
      return {
        title: "退货成功",
        detail: "退货金额已原路退回"
      };
    } else if (order.deliveryStatus === 2 && order.transFlag === 2 && order.afterSaleStatus === 6 && order.refundStatus === 2) {
      return {
        title: "退货成功",
        detail: "退货金额已原路退回"
      };
    }
    // 其他状态
     else if (order.transFlag === -1 || order.transFlag === -2) {
      return {
        title: "支付失败",
        detail: "请重新下单"
      };
    } else if (order.transFlag === 0) {
      return {
        title: "待支付",
        detail: ""
      };
    } else if (order.transFlag === 1 && order.deliveryStatus === 0) {
      return {
        title: "待发货",
        detail: "商品待商家配送，请耐心等待"
      };
    } else if (order.transFlag === 1 && order.deliveryStatus === 1) {
      return {
        title: "待自提",
        detail: "请去门店自提商品"
      };
    } else if (order.transFlag === 1 && order.deliveryStatus === 2) {
      return {
        title: "待收货",
        detail: "商品已发货，请耐心等待"
      };
    } else if (order.transFlag === 1 && order.deliveryStatus === 3) {
      return {
        title: "已完成",
        detail: "订单已完成，感谢您的信任"
      };
    } else if (order.transFlag == 2) {
      return {
        title: "交易关闭",
        detail: "超时未支付或您已取消，订单已关闭"
      };
    } else if (order.transFlag === 3) {
      return {
        title: "已完成",
        detail: "订单已完成，感谢您的信任"
      };
    }
     else if (order.transFlag === 4) {
      return {
        title: "交易取消",
        detail: "您已取消交易"
      };
    }
    // if (time && time === -1) {
    //   return {
    //     title: '交易关闭',
    //     detail: '超时未支付或您已取消，订单已关闭'
    //   }
    // }
    // if (order && order.transFlag !== undefined) {
    //   if (order.lastRefundStatus) {
    //     switch (order.lastRefundStatus) {
    //       case 5:
    //         return {
    //           title: '商家同意退货',
    //           detail: '商家同意退货，请您将商品退回'
    //         }
    //       case 6:
    //         if (order.transFlag === 11) {
    //           return {
    //             title: '待自提',
    //             detail: '请去门店自提商品'
    //           }
    //         } else if (order.transFlag === 12) {
    //           return {
    //             title: '待收货',
    //             detail: '商品待商家配送，请耐心等待'
    //           }
    //         } else if (order.transFlag !== 10) {
    //           return {
    //             title: '商家拒绝退货',
    //             detail: '商家拒绝了您的退货申请'
    //           }
    //         }else {
    //           return {
    //             title: '待发货',
    //             detail: '商品待商家配送，请耐心等待'
    //           }
    //         }
    //       case 7:
    //         return {
    //           title: '退货成功',
    //           detail: '退货金额将原路退回'
    //         }
    //       case 8:
    //         return {
    //           title: '等待商家处理',
    //           detail: '退货申请已提交，等待商家处理'
    //         }
    //       case 9:
    //         return {
    //           title: '您已撤销退货申请',
    //           detail: '您已撤销退货申请'
    //         }
    //       case 13:
    //         return {
    //           title: '等待商家处理',
    //           detail: '取消订单申请已提交，等待商家处理'
    //         }
    //       case 14:
    //         // return {
    //         //   title: '您已撤销取消订单申请',
    //         //   detail: '商家拒绝了您的取消订单申请'
    //         // }
    //       default:
    //         () => { }
    //     }
    //   }
    //   switch (order.transFlag) {
    //     case -1:
    //       return {
    //         title: '支付失败',
    //         detail: '请重新下单'
    //       }
    //     case 0:
    //       return {
    //         title: '待支付',
    //         detail: ''
    //       }
    //     case 1:
    //       return {
    //         title: '已完成',
    //         detail: '订单已完成，感谢您的信任'
    //       }
    //     case 2:
    //       return {
    //         title: '交易关闭',
    //         detail: '超时未支付或您已取消，订单已关闭'
    //       }
    //     case 10:
    //       return {
    //         title: '待发货',
    //         detail: '商品待商家配送，请耐心等待'
    //       }
    //     case 11:
    //       return {
    //         title: '待自提',
    //         detail: '请去门店自提商品'
    //       }
    //     case 12:
    //       return {
    //         title: '待收货',
    //         detail: '商品待商家配送，请耐心等待'
    //       }
    //     case 13:
    //       return {
    //         title: '等待商家处理',
    //         detail: '取消订单申请已提交，等待商家处理'
    //       }
    //     case 14:
    //       return {
    //         title: '商家拒绝了取消订单',
    //         detail: '商家拒绝了您的取消订单申请'
    //       }
    //       // return {
    //       //   title: '待自提',
    //       //   detail: '请去门店自提商品'
    //       // }
    //     default:
    //       for (let i = 0; i < orderAllStatus.length; i++) {
    //         if (order.transFlag === Number(orderAllStatus[i].dictValue)) {
    //           return {
    //             title: orderAllStatus[i].dictLabel,
    //             detail: ''
    //           }
    //         }
    //       }
    //   }
    // }
    // return {
    //   title: '',
    //   detail: ''
    // }
  }
}

export default new OrderAction();