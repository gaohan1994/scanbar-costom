import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './order.less';
import { OrderInterface, ResponseCode, ProductService } from '../../constants';
import numeral from 'numeral';
import { OrderAction, ProductAction } from '../../actions';
import classnames from 'classnames'
import invariant from 'invariant';
import productSdk from '../../common/sdk/product/product.sdk';
import orderAction from '../../actions/order.action';
import { Dispatch } from 'redux';
import { BASE_PARAM } from '../../common/util/config';

const cssPrefix = 'component-order-item';

type Props = {
  dispatch: Dispatch;
  productSDKObj: any;
  data: OrderInterface.OrderDetail;
  orderAllStatus: any[];
  currentType?: number;
  init?: () => void;
};
type State = {};

class OrderButtons extends Taro.Component<Props, State> {

  static defaultProps = {
    data: {}
  };

  public onClickOrder = (order: OrderInterface.OrderDetail) => {
    Taro.navigateTo({ url: `/pages/order/order.detail?id=${order.order.orderNo}` });
  }

  public renderPrice = (num: number) => {
    const price = num ? numeral(num).format('0.00') : '0.00';
    return (
      <Text className={`${cssPrefix}-price`}>
        <Text>￥</Text>
        <Text className={`${cssPrefix}-price-integer`}>{price.split('.')[0]}</Text>
        <Text>{`.${price.split('.')[1]}`}</Text>
      </Text>
    );
  }

  public orderClose = async (order: OrderInterface.OrderInfo) => {
    const { currentType, dispatch } = this.props;
    const { orderNo } = order;
    const payload = {
      orderNo: orderNo
    }
    try {
      const res = await OrderAction.orderCancle(payload);
      invariant(res.code === ResponseCode.success, '取消订单失败');
      Taro.showToast({
        title: '取消订单成功',
        icon: 'success'
      });
      OrderAction.orderDetail(dispatch, { orderNo: orderNo });
      OrderAction.orderList(dispatch, { pageNum: 1, pageSize: 20, ...orderAction.getFetchType(currentType) });
      OrderAction.orderCount(dispatch);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }


  public onPay = async (order: OrderInterface.OrderInfo) => {
    const { orderNo } = order;
    const payment = await productSdk.requestPayment(orderNo, order.payType)

    if (payment.code === ResponseCode.success || payment.errMsg === "requestPayment:ok") {
      const callB = async function () {
        Taro.showLoading();
        if(order.payType !== 7) await ProductService.cashierQueryStatus({orderNo: orderNo});
        Taro.hideLoading();
        setTimeout(function(){
            Taro.switchTab({url: '/pages/orderList/order'})
        }, 1000);
        // Taro.redirectTo({
        //   url: `/pages/order/order.detail?id=${orderNo}`,
        //   success: (res) => {
        //     // console.log('success', res);
        //   },
        //   fail: (res) => {
        //     // console.log('fail', res);
        //   }
        // })
      }
      if(payment.data && payment.data.msg === '余额不足') {
        Taro.showModal({
            title: "提示",
            content: "余额不足，是否充值？",
            success: function(res) {
                if (res.confirm) {
                    setTimeout(() => {
                        if(process.env.TARO_ENV === 'h5'){
                            Taro.redirectTo({
                                url: `/pages/TopUp/TopUp?id=${orderNo}`
                            });
                        } else {
                           
                            Taro.redirectTo({
                                url: `/pages/TopUp/TopUp?id=${orderNo}`
                            });
                        }

                    }, 500);

                    return;
                } else if (res.cancel) {
                    // callB();
                }
                
            },

        });
      }  else {
          if(order.payType === 7){
              Taro.showToast({
                  title: '储值支付成功',
                  icon: 'success',
                  duration: 2000
              })
          }
          callB();
      }
      // Taro.showLoading();
      // if(order.payType !== 7) await ProductService.cashierQueryStatus({orderNo: orderNo});
      // Taro.hideLoading();
      // Taro.navigateTo({
      //   url: `/pages/order/order.detail?id=${orderNo}`,
      //   success: (res) => {
      //     console.log('success', res);
      //   },
      //   fail: (res) => {
      //     console.log('fail', res);
      //   }
      // })
    } else {
      Taro.showToast({
        title: payment.msg,
        icon: 'none'
      });
    }
  }

  public orderOneMore = async (order: OrderInterface.OrderDetail) => {

    const { orderDetailList } = order;
    const {productSDKObj, dispatch} = this.props;
    if (orderDetailList && orderDetailList.length > 0) {
      for (let i = 0; i < orderDetailList.length; i++) {
        const res = await ProductAction.productInfoDetail(dispatch, { id: orderDetailList[i].productId });
        if (res.code === ResponseCode.success) {
          productSdk.manage( dispatch, productSDKObj, {
            type: productSdk.productCartManageType.ADD,
            product: res.data,
            num: orderDetailList[i].num,
          });
          setTimeout(() => {
            Taro.switchTab({
              url: `/pages/cart/cart`
            });
          }, 1000);
        } else {
          if (res.msg) {
            Taro.showToast({
              title: res.msg,
              icon: 'none'
            });
          } else {
            Taro.showToast({
              title: '获取商品失败',
              icon: 'none'
            });
          }
        }
      }
    }
  }

  public orderCancel = async () => {
    Taro.navigateTo({ url: '/pages/order/order.cancel' });
  }

  public orderRefund = async () => {
    Taro.navigateTo({ url: '/pages/order/order.refund' });
  }

  public orderRefundCancel = async (order: OrderInterface.OrderDetail, type?: number) => {
    const { currentType, dispatch } = this.props;
    const { orderRefundIndices, orderNo } = order;
    const payload = {
      orderNo: type === 1 ? orderNo : orderRefundIndices[0].refundOrderNo
    }
    try {
      const res = await OrderAction.orderRefundCancel(payload);
      invariant(res.code === ResponseCode.success, '撤销申请失败');
      Taro.showToast({
        title: '撤销申请成功',
        icon: 'success'
      });
      OrderAction.orderDetail(dispatch, { orderNo: orderNo });
      OrderAction.orderList(dispatch, { pageNum: 1, pageSize: 20, ...orderAction.getFetchType(currentType) });
      OrderAction.orderCount(dispatch);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  public getOrderButtons = (params: OrderInterface.OrderDetail, time?: number): any[] => {
    if (time && time === -1) {
      return [
        { title: '再来一单', function: () => this.orderOneMore(params) },
      ];
    }

    const { order } = params;

    if (order) {
      if (order.afterSaleStatus !== undefined ) {
        switch (order.afterSaleStatus) {
          case 0:  // 申请取消
            return [
              { title: '撤销申请', function: () => this.orderRefundCancel(params, 1) },
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          case 1:  // 申请退货
            return [
              { title: '撤销申请', function: () => { this.orderRefundCancel(params) } },
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          case 2:  // 撤销取消订单
            if (BASE_PARAM.isrefundorder === false) {
              return [
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
            if (order.ableRefund === true ) {
              return [
                { title: '申请退货', function: () => { this.orderRefund() } },
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
            return [
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          case 3:  // 买家取消退货
            if (BASE_PARAM.isrefundorder === false) {
              return [
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
            if (order.ableRefund === true) {
              return [
                { title: '申请退货', function: () => { this.orderRefund() } },
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
            return [
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          case 4:  // 退款中
            if (BASE_PARAM.isrefundorder === false) {
              return [
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
            if(order.refundStatus === 1){
              return [
                { title: '申请退货', function: () => { this.orderRefund() } },
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
            return [
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          case 5:  // 拒绝退款
            if (BASE_PARAM.isrefundorder === false) {
              return [
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
            if (order.ableRefund === true) {
              return [
                { title: '申请退货', function: () => { this.orderRefund() } },
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
            return [
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          case 6:  // 取消成功
            if (BASE_PARAM.isrefundorder === false) {
              return [
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
            if (order.ableRefund === true) {
              return [
                { title: '申请退货', function: () => { this.orderRefund() } },
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
            return [
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          case 7:  // 拒绝
            return [
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          default:
            () => { }
        }
      }
      if (order.deliveryStatus !== undefined) {
        switch (order.deliveryStatus) {
          case 0: // 待发货
            if(BASE_PARAM.iscancelorder != false){
              return [
                { title: '取消订单', function: () => this.orderCancel() },
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            } else {
              return [
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
            
          case 1: // 待自提
            if(BASE_PARAM.iscancelorder != false){
              return [
                { title: '取消订单', function: () => this.orderCancel() },
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            } else {
              return [
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
          case 2: // 配送中
            if (BASE_PARAM.isrefundorder === false) {
              return [
                { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
              ];
            }
            return [
              { title: '申请退货', function: () => { this.orderRefund() } },
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          default:
            () => { }
        }
      }

      switch (order.transFlag) {
        case 0: // 待支付
          if(BASE_PARAM.iscancelorder != false){
            return [
              { title: '取消订单', function: () => this.orderClose(order) },
              { title: '去支付', function: () => this.onPay(order), color: 'blue' },
            ];
          } else {
            return [
              { title: '去支付', function: () => this.onPay(order), color: 'blue' },
            ];
          }
          
        case 1: // 已完成
          if (BASE_PARAM.isrefundorder === false) {
            return [
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          }
          if (order.ableRefund === true) {
            return [
              { title: '申请退货', function: () => { this.orderRefund() } },
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          }
          
          return [
            { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
          ];
        case 3: // 订单完成
          if (BASE_PARAM.isrefundorder === false) {
            return [
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          }
          if (order.ableRefund === true) {
            return [
              { title: '申请退货', function: () => { this.orderRefund() } },
              { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
            ];
          }
          return [
            { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
          ];
        default:
          return [
            { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
          ];
      }
    }
    return [
      { title: '再来一单', function: () => this.orderOneMore(params), color: 'blue' },
    ];
  }

  render() {
    const { data, orderAllStatus } = this.props;

    const buttons: any[] = this.getOrderButtons(data);

    return (
      <View className={`${cssPrefix}-row`}>
        {
          buttons && buttons.length > 0 && buttons.map((item: any) => {
            return (
              <View
                className={classnames(`${cssPrefix}-card-button-common`, {
                  [`${cssPrefix}-card-button-again`]: item.color !== 'blue',
                  [`${cssPrefix}-card-button-pay`]: item.color === 'blue',
                })}
                onClick={item.function}
              >
                {item.title}
              </View>
            )
          })
        }
        {/* {
          res.title === '待支付'
            ? (
              <View className={`${cssPrefix}-card-button`}>
                <View
                  className={`${cssPrefix}-card-button-common ${cssPrefix}-card-button-again`}
                  onClick={() => { this.orderCancle(order); }}
                >
                  取消订单
                </View>
                <View
                  className={`${cssPrefix}-card-button-common ${cssPrefix}-card-button-pay`}
                  onClick={() => { this.onPay(order); }}
                >
                  去支付
                </View>
              </View>
            )
            : (
              <View className={`${cssPrefix}-card-button`}>
                <View
                  className={`${cssPrefix}-card-button-common ${cssPrefix}-card-button-again`}
                  onClick={() => { this.orderOneMore(data); }}
                >
                  再来一单
                </View>
              </View>
            )
        } */}
      </View>
    );

  }
}

export default OrderButtons;