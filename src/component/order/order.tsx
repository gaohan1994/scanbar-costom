import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './order.less';
import { OrderInterface, ResponseCode } from '../../constants';
import numeral from 'numeral';
import { AtButton } from 'taro-ui';
import { OrderAction } from '../../actions';
import classnames from 'classnames'
import invariant from 'invariant';
import productSdk, { ProductCartInterface } from '../../common/sdk/product/product.sdk';

const cssPrefix = 'component-order-item';

type Props = {
  data: OrderInterface.OrderDetail;
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
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  public manageProduct = (type: ProductCartInterface.ProductCartAdd | ProductCartInterface.ProductCartReduce, e: any) => {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    // const { product, sort } = this.props;
    // productSdk.manage({ type, product, sort });
  }

  render() {
    const { data } = this.props;
    const { order, orderDetailList } = data;
    const res = OrderAction.orderStatus(data);
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
            src="//net.huanmusic.com/weapp/icon_shop.png"
            className={`${cssPrefix}-card-header-icon`}
          />
          <View className={`${cssPrefix}-card-header-text`}>
            <View className={`${cssPrefix}-card-header-text-shop`}>
              {order.merchantName || ''}
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
                    <Image
                      src="//net.huanmusic.com/weapp/pic_default.png"
                      className={`${cssPrefix}-card-center-product-pic`}
                    />
                    <Text className={`${cssPrefix}-card-center-product-text`}>
                      {product.productName}
                    </Text>
                  </View>
                )
              })
            }
          </View>

          <View className={`${cssPrefix}-card-center-info`}>
            {this.renderPrice(order.transAmount)}
            <Text className={`${cssPrefix}-card-center-info-total`}>共{order.totalNum}件</Text>
          </View>
        </View>
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
                <View className={`${cssPrefix}-card-button-common ${cssPrefix}-card-button-pay`}>
                  去支付
                </View>
              </View>
            )
            : (
              <View className={`${cssPrefix}-card-button`}>
                <View
                  className={`${cssPrefix}-card-button-common ${cssPrefix}-card-button-again`}
                  onClick={this.manageProduct.bind(this, productSdk.productCartManageType.REDUCE)}
                >
                  再来一单
                </View>
              </View>
            )
        }
      </View>
    );

  }
}

export default OrderItem;