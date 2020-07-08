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
import OrderButtons from './order.buttons';
import { Dispatch } from 'redux';

const cssPrefix = 'component-order-item';

type Props = {
  dispatch: Dispatch;
  productSDKObj: any;
  data: OrderInterface.OrderDetail;
  orderAllStatus: any[];
  currentType?: number;
};
type State = {};

class OrderItem extends Taro.Component<Props, State> {

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

  public orderCancle = async (order: OrderInterface.OrderInfo) => {
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
      Taro.showLoading();
      if(order.payType !== 7) await ProductService.cashierQueryStatus({orderNo: orderNo});
      Taro.hideLoading();
      Taro.navigateTo({
        url: `/pages/order/order.detail?id=${orderNo}`,
        success: (res) => {
          console.log('success', res);
        },
        fail: (res) => {
          console.log('fail', res);
        }
      })
    } else {
      Taro.showToast({
        title: payment.msg,
        icon: 'none'
      });
    }
  }

  public orderOneMore = async (order: OrderInterface.OrderDetail) => {
    const { orderDetailList } = order;
    const {dispatch, productSDKObj}= this.props;
    if (orderDetailList && orderDetailList.length > 0) {
      for (let i = 0; i < orderDetailList.length; i++) {
        const res = await ProductAction.productInfoDetail(dispatch, { id: orderDetailList[i].productId });
        if (res.code === ResponseCode.success) {
          productSdk.manage(dispatch, productSDKObj,{
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

  public getOrderButtons = (params: OrderInterface.OrderDetail, time?: number) => {
    if (time && time === -1) {
      return [
        { title: '再来一单', function: this.orderOneMore },
      ];
    }

    const { order } = params;

    if (order && order.transFlag !== undefined) {
      switch (order.transFlag) {
        case 0:
          return [
            { title: '去支付', function: this.onPay },
            { title: '再来一单', function: this.orderOneMore },
          ];
        case 1:
          return {
            title: '已完成',
            detail: '订单已完成，感谢您的信任'
          }
        case 2:
          return {
            title: '交易关闭',
            detail: '超时未支付或您已取消，订单已关闭'
          }
        case 10:
          return {
            title: '待发货',
            detail: '商品待商家配送，请耐心等待'
          }
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
          return ['再来一单']
      }
    }
  }

  render() {
    const { data, orderAllStatus, currentType } = this.props;
    const { order, orderDetailList } = data;
    const res = OrderAction.orderStatus(orderAllStatus, data);
    let products: any[] = [];

    if (orderDetailList && orderDetailList.length > 3) {
      products = orderDetailList.slice(0, 3);
    } else if (orderDetailList) {
      products = orderDetailList
    }

    return (
      <View className={`${cssPrefix}-card`}>
        <View
          className={classnames(`${cssPrefix}-card-status`, {
            [`${cssPrefix}-card-status-red`]: res.title === '待支付',
            [`${cssPrefix}-card-status-orange`]: res.title === '待收货' || res.title === '待自提',
            [`${cssPrefix}-card-status-blue`]: res.title === '已退货',
          })}
        >
          {res.title}
        </View>

        <View className={`${cssPrefix}-card-header`}>
          <Image
            src='//net.huanmusic.com/scanbar-c//icon_order_store.png'
            className={`${cssPrefix}-card-header-icon`}
          />
          <View className={`${cssPrefix}-card-header-text`}>
            <View className={`${cssPrefix}-card-header-text-shop ${process.env.TARO_ENV === 'h5' ? `${cssPrefix}-card-header-text-shop-h5` : ''}`}>
              {order.merchantName || '未知商店'}
            </View>
            <View className={`${cssPrefix}-card-header-text-time`}>
              {order.createTime || ''}
            </View>
          </View>
        </View>

        <View className={`${cssPrefix}-card-center`} onClick={() => { this.onClickOrder(data) }}>
          <View className={`${cssPrefix}-card-center-products`}>
            {
              products.map((product: any) => {
                return (
                  <View className={`${cssPrefix}-card-center-product`}>
                    {
                      product.picUrl && product.picUrl.length > 0
                        ? (
                          <View
                            className={`${cssPrefix}-card-center-product-pic`}
                            style={`background-image: url(${product.picUrl})`}
                          />
                        )
                        : (
                          // <Image
                          //   src="//net.huanmusic.com/scanbar-c/v1/pic_nopicture.png"
                          //   className={`${cssPrefix}-card-center-product-pic`}
                          // />
                          <View
                            className={`${cssPrefix}-card-center-product-pic`}
                          />
                        )
                    }

                    <Text className={`${cssPrefix}-card-center-product-text${process.env.TARO_ENV === 'h5' ? '-h5' : ''}`}>
                      {product.productName}
                    </Text>
                  </View>
                )
              })
            }
          </View>

          <View className={`${cssPrefix}-card-center-info`}>
            {order && order.transAmount !== undefined ? this.renderPrice(order.transAmount) : this.renderPrice(0)}
            <Text className={`${cssPrefix}-card-center-info-total`}>共{order.totalNum}件</Text>
          </View>
        </View>
        <View className={`${cssPrefix}-card-button`}>
          {/* <OrderButtons data={data} orderAllStatus={orderAllStatus} currentType={currentType}/> */}
          {
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
        }
        </View>

      </View>
    );

  }
}

export default OrderItem;