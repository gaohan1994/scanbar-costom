import Taro, { Config } from '@tarojs/taro';
import { View, Button, Image, Text, ScrollView } from '@tarojs/components';
import './index.less';
import { AtButton } from 'taro-ui';
import classnames from 'classnames';
import { getOrderDetail } from '../../reducers/app.order';
import { AppReducer } from '../../reducers';
import { connect } from '@tarojs/redux';
import invariant from 'invariant';
import { OrderAction } from '../../actions';
import { ResponseCode, OrderInterface } from '../../constants';
import "../../pages/style/product.less";
import numeral from 'numeral';
import dayjs from 'dayjs'
import Price from '../../component/price';

const cssPrefix = 'order-detail';
const productCssPrefix = 'product';

interface Props {
  orderDetail: OrderInterface.OrderDetail;
}

interface State {
  timeStr: string;
  time: number;
}

class OrderDetail extends Taro.Component<Props, State> {

  state = {
    timeStr: '',
    time: 0,
  }

  config: Config = {
    navigationBarTitleText: '订单详情'
  }

  private timer: any = null;

  componentWillMount() {
    try {
      const { params: { id } } = this.$router;
      invariant(!!id, '请传入订单id');
      this.init(id);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  public init = async (id: string) => {
    try {
      const result = await OrderAction.orderDetail({ orderNo: id });
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      const { orderDetail } = this.props;
      const status = OrderAction.orderStatus(orderDetail);
      if (status.title === '待支付') {
        const second = dayjs(dayjs().format('YYYY-MM-DD HH:mm:ss')).diff(dayjs(orderDetail.order.createTime), 'second');
        const expireMinute = orderDetail.order.expireMinute || 20;
        const expireSecond = expireMinute * 60;
        const restSecond = expireSecond - second;
        if (restSecond > 0) {
          this.setState({
            time: restSecond
          }, () => {
            this.timer = setInterval(() => {
              const { time } = this.state
              if (time > 0) {
                this.setState({
                  time: time - 1
                });
              } else {
                this.setState({
                  time: - 1
                });
                clearInterval(this.timer);
              }
            }, 1000);
          });
        } else {
          this.setState({
            time: -1
          });
        }
      }
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  public getTimeStr = (second: number) => {
    if (second <= 60) {
      return (second + '秒');
    } else {
      const s = second % 60;
      const m = (second - s) / 60;
      let str = m + ':';
      if (s < 10) {
        str += '0';
      }
      str = str + s + '分钟';
      return str;
    }
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

  public renderTotalPrice = (num: number) => {
    const price = num ? numeral(num).format('0.00') : '0.00';
    return (
      <Text className={`${cssPrefix}-price-total`}>
        <Text>￥</Text>
        <Text className={`${cssPrefix}-price-total-integer`}>{price.split('.')[0]}</Text>
        <Text>{`.${price.split('.')[1]}`}</Text>
      </Text>
    );
  }

  render() {
    return (
      <View className={`container order`}>
        <View className={`${cssPrefix}-bg`} />
        <ScrollView className={`${cssPrefix}-container`} scrollY={true}>
          {this.renderStatusCard()}
          {this.renderLogisticsCard()}
          {this.renderProductList()}
          {this.renderOrderCard()}
        </ScrollView>

      </View>
    )
  }

  private renderStatusCard() {
    const { time } = this.state;
    const { orderDetail } = this.props;
    const res = OrderAction.orderStatus(orderDetail, time);
    return (
      <View className={`${cssPrefix}-card ${cssPrefix}-card-status`}>
        {
          res.title === '待支付'
            ? (
              <Image
                className={`${cssPrefix}-card-status-img2`}
                src='//net.huanmusic.com/weapp/customer/img_payment.png'
              />
            )
            : res.title === '待自提' || res.title === '待收货'
              ? (
                <Image
                  className={`${cssPrefix}-card-status-img1`}
                  src='//net.huanmusic.com/weapp/customer/img_waitting.png'
                />
              )
              : res.title === '已取消'
                ? (
                  <Image
                    className={`${cssPrefix}-card-status-img1`}
                    src='//net.huanmusic.com/weapp/customer/img_cancel.png'
                  />
                )
                : (
                  <Image
                    className={`${cssPrefix}-card-status-img1`}
                    src='//net.huanmusic.com/weapp/customer/img_completed.png'
                  />
                )
        }

        <Text className={`${cssPrefix}-card-status-title`}>
          {res.title}
        </Text>
        {
          res.title === '待支付'
            ? (
              <Text className={`${cssPrefix}-card-status-detail`}>
                订单待支付，请在
                <Text className={`${cssPrefix}-card-status-red`}>
                  {this.getTimeStr(time)}
                </Text>
                之内付款
              </Text>
            )
            : (
              <Text className={`${cssPrefix}-card-status-detail`}>
                {res.detail}
              </Text>
            )
        }

        <View className={`${cssPrefix}-card-status-button`}>
          {
            res.title === '待支付' && (
              <AtButton
                className={`${cssPrefix}-card-status-button-common ${cssPrefix}-card-status-button-cancle`}
                type='secondary'
                size='small'
                full={false}
                onClick={() => { this.orderCancle(orderDetail.order); }}
              >
                取消订单
              </AtButton>
            )
          }
          <AtButton
            className={`${cssPrefix}-card-status-button-common ${cssPrefix}-card-status-button-again`}
            type='secondary'
            size='small'
            full={false}
          >
            再来一单
          </AtButton>
        </View>
      </View>
    )
  }

  private renderLogisticsCard() {
    const { orderDetail } = this.props;
    const { order } = orderDetail;

    return (
      <View className={`${cssPrefix}-card ${cssPrefix}-card-logistics`}>
        <View className={`${cssPrefix}-card-logistics-item`}>
          <Image
            src='//net.huanmusic.com/weapp/icon_order_time.png'
            className={`${cssPrefix}-card-logistics-item-img`}
          />

          <View className={`${cssPrefix}-card-logistics-item-info`}>
            <Text className={`${cssPrefix}-card-logistics-item-info-title`}>
              {order.deliveryType == 0 ? '到店自提时间' : '配送时间'}
            </Text>
            <Text className={`${cssPrefix}-card-logistics-item-info-content`}>
              {
                order.deliveryType == 0
                  ? (order.planDeliveryTime || '未设置')
                  : order.planDeliveryTime && order.planDeliveryTime.length > 0
                    ? order.planDeliveryTime
                    : '立即送出'
              }
            </Text>
          </View>
        </View>

        <View
          className={classnames(
            `${cssPrefix}-card-logistics-item`,
            {
              [`${cssPrefix}-card-logistics-item-margin`]: true,
            })}
        >
          {
            order.deliveryType == 0
              ? (
                <Image
                  src='//net.huanmusic.com/weapp/icon_order_shop.png'
                  className={`${cssPrefix}-card-logistics-item-img`}
                />
              )
              : (
                <Image
                  src='//net.huanmusic.com/weapp/icon_order_location.png'
                  className={`${cssPrefix}-card-logistics-item-img`}
                />
              )
          }

          <View className={`${cssPrefix}-card-logistics-item-info`}>
            <Text className={`${cssPrefix}-card-logistics-item-info-content`}>
              {
                order.deliveryType == 0
                  ? order.merchantName && order.merchantName.length
                    ? order.merchantName
                    : '未获取到商店名称'
                  : order.address && order.address.length > 0
                    ? order.address
                    : '未设置收货地址'
              }
            </Text>
            <Text className={`${cssPrefix}-card-logistics-item-info-title`}>
              {
                order.deliveryType == 0
                  ? order.address && order.address.length > 0
                    ? order.address
                    : '未获取到商店地址'
                  : (order.receiver && order.receiver.length > 0) || (order.receiverPhone && order.receiverPhone.length > 0)
                    ? `${order.receiver} ${order.receiverPhone}`
                    : '未设置收货人'
              }
            </Text>
          </View>
        </View>
      </View>
    )
  }

  private renderProductList() {
    const { orderDetail } = this.props;
    const { orderDetailList, order } = orderDetail;
    return (
      <View className={`${cssPrefix}-card`}>
        <View className={`${cssPrefix}-card-products-header`}>
          <View className={`${cssPrefix}-card-products-header-item`}>
            <Text className={`${cssPrefix}-card-products-header-shop`}>{order.merchantName || '阳光便利店'}</Text>
            {/* <Image
              className={`${cssPrefix}-card-products-header-next`}
              src={'//net.huanmusic.com/scanbar-c/icon_commodity_into.png'}
            /> */}
          </View>
          <View className={`${cssPrefix}-card-products-header-item`}>
            <Image
              className={`${cssPrefix}-card-products-header-phone`}
              src={'//net.huanmusic.com/weapp/icon_order_phone.png'}
            />
            <Text className={`${cssPrefix}-card-products-header-green`}>联系商家</Text>
          </View>
        </View>
        {
          orderDetailList && orderDetailList.length > 0 && orderDetailList.map((item, index) => {
            return (
              <View
                key={index}
                className={classnames(`${productCssPrefix}-row ${productCssPrefix}-row-content`, {
                  // [`container-border`]: index !== (productList.length - 1)
                })}
              >
                <View className={`${productCssPrefix}-row-box`}>
                  <View
                    className={`${productCssPrefix}-row-cover`}
                    style={`background-image: url(${item.imgPaths || '//net.huanmusic.com/weapp/pic_default.png'})`}
                  />
                  <View className={`${productCssPrefix}-row-content ${productCssPrefix}-row-content-box`}>
                    <Text className={`${productCssPrefix}-row-name`}>{item.productName}</Text>
                    <Text className={`${productCssPrefix}-row-normal`}>{`x ${item.num}`}</Text>
                    <View className={`${productCssPrefix}-row-corner`}>
                      <Text className={`${productCssPrefix}-row-corner-price`}>{this.renderPrice(item.totalAmount)}</Text>
                      <Text className={`${productCssPrefix}-row-corner-origin`}>{`￥${numeral(item.transAmount).format('0.00')}`}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          })
        }

        {
          order.deliveryType !== 0 && (
            <View className={`${productCssPrefix}-row-totals`}>
              <View className={`${productCssPrefix}-row-content-item`}>
                <Text className={`${productCssPrefix}-row-voucher`}>配送费</Text>
                <View>
                  <Text
                    className={
                      `${productCssPrefix}-row-content-price ${productCssPrefix}-row-content-price-black`
                    }
                  >
                    ￥{numeral(order.deliveryFee || 0).format('0.00')}
                  </Text>
                  <Image
                    className={`${cssPrefix}-card-products-header-next`}
                    src={'//net.huanmusic.com/scanbar-c/icon_commodity_into.png'}
                  />
                </View>
              </View>
            </View>
          )
        }
        {/* <View className={`${productCssPrefix}-row-totals`}>
          <View className={`${productCssPrefix}-row-content-item ${productCssPrefix}-row-content-column`}>
            <View className={`${productCssPrefix}-row-content-column-item`}>
              <View className={classnames(
                `${productCssPrefix}-row-content-row`,
                {
                  [`${productCssPrefix}-row-content-row-top`]: true,
                })}
              >
                <View
                  className={classnames(
                    `${productCssPrefix}-row-discount`,
                    {
                      [`${productCssPrefix}-row-discount-full`]: true,
                      [`${productCssPrefix}-row-discount-first`]: false,
                    })}
                >满减</View>
                <Text className={`${productCssPrefix}-row-discount-title`}>满500减20</Text>
              </View>
              <Text className={`${productCssPrefix}-row-content-price`}>-￥20</Text>
            </View>
            <View className={`${productCssPrefix}-row-content-column-item`}>
              <View className={`${productCssPrefix}-row-content-row`}>
                <View
                  className={classnames(
                    `${productCssPrefix}-row-discount`,
                    {
                      [`${productCssPrefix}-row-discount-full`]: false,
                      [`${productCssPrefix}-row-discount-first`]: true,
                    })}
                >首单</View>
                <Text className={`${productCssPrefix}-row-discount-title`}>首单立减10元</Text>
              </View>
              <Text className={`${productCssPrefix}-row-content-price`}>-￥20</Text>
            </View>
          </View>
        </View>

        <View className={`${productCssPrefix}-row-totals`}>
          <View className={`${productCssPrefix}-row-content-item`}>
            <Text className={`${productCssPrefix}-row-voucher`}>抵用券</Text>
            <View>
              <Text className={`${productCssPrefix}-row-content-price`}>-￥20</Text>
              <Image
                className={`${cssPrefix}-card-products-header-next`}
                src={'//net.huanmusic.com/scanbar-c/icon_commodity_into.png'}
              />
            </View>
          </View>
        </View> */}

        <View className={`${productCssPrefix}-row-totals`}>
          <View className={`${productCssPrefix}-row-content-item`}>
            <View></View>
            
            <Price
            preText='已优惠￥0.00   合计：'
            priceColor='#333333'
            price={numeral(orderDetail.order.transAmount).format('0.00')}
          />
          </View>
        </View>

      </View>
    )
  }

  private renderOrderCard() {
    const { orderDetail } = this.props;
    const { order } = orderDetail;
    const items: any[] = true && [
      {
        title: '订单号码',
        extraText: `${order.orderNo}`,
      },
      {
        title: '下单时间',
        extraText: `${order.createTime}`,
      },
      {
        title: '支付方式',
        extraText: `${OrderAction.orderPayType(orderDetail)}支付`,
      },
      {
        title: '订单备注',
        extraText: `${order.remark || '无'}`,
        border: false
      },
    ];
    return (
      <View className={`${cssPrefix}-card`}>
        {
          items.map((item: any) => {
            return (
              <View
                className={classnames(`${cssPrefix}-card-order-item`, {
                  [`${cssPrefix}-card-order-item-border`]: !(item.border === false)
                })}
              >
                <Text className={`${cssPrefix}-card-order-item-title`}>
                  {item.title}
                </Text>
                <Text className={`${cssPrefix}-card-order-item-content`}>
                  {item.extraText}
                </Text>
              </View>
            )
          })
        }
      </View>
    )
  }
}


const select = (state: AppReducer.AppState) => ({
  orderDetail: getOrderDetail(state),
});

export default connect(select)(OrderDetail);