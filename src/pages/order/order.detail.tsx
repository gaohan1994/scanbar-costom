import Taro, { Config } from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import './index.less';
import classnames from 'classnames';
import { getOrderDetail, getOrderAllStatus, getCurrentType } from '../../reducers/app.order';
import { AppReducer } from '../../reducers';
import { connect } from '@tarojs/redux';
import invariant from 'invariant';
import { OrderAction, ProductAction } from '../../actions';
import { ResponseCode, OrderInterface } from '../../constants';
import "../../pages/style/product.less";
import numeral from 'numeral';
import dayjs from 'dayjs'
import productSdk from '../../common/sdk/product/product.sdk';
import CostomModal from '../../component/login/modal';
import merchantAction from '../../actions/merchant.action';
import ProductPayListView from '../../component/product/product.pay.listview'
import OrderButtons from '../../component/order/order.buttons';
import { Dispatch } from 'redux';

const cssPrefix = 'order-detail';

interface Props {
  dispatch: Dispatch;
  productSDKObj: any;
  orderDetail: OrderInterface.OrderDetail;
  orderAllStatus: any[];
  currentType: number;
}

interface State {
  timeStr: string;
  time: number;
  callModal: boolean;
}

class OrderDetail extends Taro.Component<Props, State> {

  state = {
    timeStr: '',
    time: 0,
    callModal: false,
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
      // OrderAction.orderList({ pageNum: 1, pageSize: 20 });
      OrderAction.orderCount(this.props.dispatch);
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
      const result = await OrderAction.orderDetail(this.props.dispatch, { orderNo: id });
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      const { orderDetail, orderAllStatus } = this.props;
      const status = OrderAction.orderStatus(orderAllStatus, orderDetail);
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
    const { params: { id } } = this.$router;
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
      // OrderAction.orderList({ pageNum: 1, pageSize: 20 });
      this.init(id);
      OrderAction.orderCount(this.props.dispatch);
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
    if (payment.code === ResponseCode.success) {
      const { params: { id } } = this.$router;
      this.init(id);
    } else {
      Taro.showToast({
        title: payment.msg,
        icon: 'none'
      });
    }
  }

  public onCall = (phone: string) => {
    Taro.makePhoneCall({
      phoneNumber: phone
    });

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

  public orderOneMore = async (order: OrderInterface.OrderDetail) => {
    const { orderDetailList } = order;
    const {dispatch, productSDKObj} = this.props;
    if (orderDetailList && orderDetailList.length > 0) {
      for (let i = 0; i < orderDetailList.length; i++) {
        const res = await ProductAction.productInfoDetail(this.props.dispatch, { id: orderDetailList[i].productId });
        if (res.code === ResponseCode.success) {
          productSdk.manage(dispatch, productSDKObj, {
            type: productSdk.productCartManageType.ADD,
            product: res.data,
            num: orderDetailList[i].num,
          });
          setTimeout(() => {
            Taro.navigateBack({ delta: 10 });
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

  onConfirm = async () => {
    const { orderDetail } = this.props;
    const { order } = orderDetail;
    const parmas = {
      merchantId: order.merchantId
    };
    const res = await merchantAction.merchantDetail(this.props.dispatch, parmas);
    if (res.code === ResponseCode.success) {
      if (res.data && res.data.customerMallConfig && res.data.customerMallConfig.servicePhone) {
        this.onCall(res.data.customerMallConfig.servicePhone);
      }
    } else {
      Taro.showToast({
        title: '获取售后电话失败',
        icon: 'none'
      });
    }
  }

  public onCopy = async () => {
    try {
      const { orderDetail } = this.props;
      invariant(orderDetail && orderDetail.orderNo, '请选择要复制的数据');
      await Taro.setClipboardData({ data: orderDetail.orderNo });
      Taro.showToast({ title: '已复制订单号' });
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  render() {
    const { callModal } = this.state;
    const { orderDetail } = this.props;
    return (
      <View className={`container order`}>
        <View className={`${cssPrefix}-bg`} />
        <ScrollView className={`${cssPrefix}-container ${process.env.TARO_ENV === 'h5' ? `${cssPrefix}-container-h5` : ''}`} scrollY={true}>
          {this.renderStatusCard()}
          {
            orderDetail && orderDetail.refundOrderList && orderDetail.refundOrderList.length > 0 &&
            this.renderRefundSchedule()
          }
          {this.renderLogisticsCard()}
          {this.renderProductList()}
          {this.renderOrderCard()}
        </ScrollView>
        <CostomModal
          isOpen={callModal}
          onCancle={() => { this.setState({ callModal: false }) }}
          onConfirm={this.onConfirm}
          title="确定拨打商家电话？"
        />

      </View>
    )
  }

  private renderStatusCard() {
    const { time } = this.state;
    const { orderDetail, orderAllStatus, currentType, dispatch, productSDKObj } = this.props;
    const res = OrderAction.orderStatus(orderAllStatus, orderDetail, time);
    return (
      <View className={`${cssPrefix}-card ${cssPrefix}-card-status`}>
        {
          res.title === '待支付' || res.title === '待发货' || res.title === '等待商家处理'
            ? (
              <Image
                className={`${cssPrefix}-card-status-img2`}
                src='//net.huanmusic.com/weapp/customer/img_payment.png'
              />
            )
            : res.title === '待自提' || res.title === '待收货' || res.title === '商家同意退货'
              ? (
                <Image
                  className={`${cssPrefix}-card-status-img1`}
                  src='//net.huanmusic.com/weapp/customer/img_waitting.png'
                />
              )
              : res.title === '交易关闭' || res.title === '已取消' || res.title === '商家拒绝了退货申请' || res.title === '您撤销了退货申请'
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

        <View className={`${cssPrefix}-card-status-button`} style={process.env.TARO_ENV === 'h5' ? {marginBottom: '10px'} : {}}>
          <OrderButtons dispatch={dispatch} productSDKObj={productSDKObj} data={orderDetail} orderAllStatus={orderAllStatus} currentType={currentType} />
        </View>
      </View>
    )
  }

  private renderRefundSchedule = () => {
    return (
      <View className={`${cssPrefix}-card ${cssPrefix}-card-refund`}>
        <View className={`${cssPrefix}-card-refund-container`} onClick={() => { Taro.navigateTo({ url: '/pages/order/order.refund.schedule' }) }}>
          <Text className={`${cssPrefix}-card-refund-container-text`}>退货进度</Text>
          <Image
            className={`${cssPrefix}-card-refund-container-icon`}
            src='//net.huanmusic.com/scanbar-c/icon_commodity_into.png'
          />
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
              {order && order.deliveryType == 0 ? '到店自提时间' : '配送时间'}
            </Text>
            <Text className={`${cssPrefix}-card-logistics-item-info-content`}>
              {
                order && order.deliveryType == 0
                  ? (order && order.planDeliveryTime || '未设置')
                  : order && order.planDeliveryTime &&  order.planDeliveryTime.length > 0
                    ? order && order.planDeliveryTime
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
            order && order.deliveryType == 0
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
            <Text

              className={classnames(
                {
                  [`${cssPrefix}-card-logistics-item-info-content`]: order && order.deliveryType !== 0,
                  [`${cssPrefix}-card-logistics-item-info-title`]: order && order.deliveryType === 0,
                })}
            >
              {
                order && order.deliveryType == 0
                  ? order.merchantName && order.merchantName.length
                    ? order.merchantName
                    : '未获取到商店名称'
                  : order && order.address && order.address.length > 0
                    ? order.address
                    : '未设置收货地址'
              }
            </Text>
            <Text
              className={classnames(
                {
                  [`${cssPrefix}-card-logistics-item-info-content`]: order && order.deliveryType === 0,
                  [`${cssPrefix}-card-logistics-item-info-title`]: order && order.deliveryType !== 0,
                })}
            >
              {
                order && order.deliveryType == 0
                  ? order.merchantAddress && order.merchantAddress.length > 0
                    ? order.merchantAddress
                    : '未获取到商店地址'
                  : (order && order.receiver && order.receiver.length > 0) || (order && order.receiverPhone && order.receiverPhone.length > 0)
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
    const { orderDetail, productSDKObj } = this.props;
    if (orderDetail && orderDetail.orderDetailList && orderDetail.orderDetailList.length > 0) {
      const { orderDetailList } = orderDetail;
      return (
        <ProductPayListView
          productList={orderDetailList}
          type={1}
          isDetail={true}
          padding={false}
          productSDKObj={productSDKObj}
          showCallModal={() => { this.setState({ callModal: true }) }}
        />
      )
    }
    return <View />
  }

  private renderOrderCard() {
    const { orderDetail } = this.props;
    const { order } = orderDetail;
    const items: any[] = order && [
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
      <View className={`${cssPrefix}-card ${cssPrefix}-card-order`}>
        {
          items && items.length > 0 && items.map((item: any) => {
            return (
              <View
                className={classnames(`${cssPrefix}-card-order-item`, {
                  [`${cssPrefix}-card-order-item-border`]: !(item.border === false)
                })}
              >
                <Text className={`${cssPrefix}-card-order-item-title`}>
                  {item.title}
                </Text>
                {
                  item.title === '订单号码'
                    ? (
                      <View className={`${cssPrefix}-card-order-item-box`} onClick={this.onCopy}>
                        <Text className={`${cssPrefix}-card-order-item-content`}>
                          {item.extraText}
                        </Text>
                        <Image
                          src="//net.huanmusic.com/scanbar-c/v2/icon_copy_grey.png"
                          className={`${cssPrefix}-card-order-item-copy`}
                        />
                      </View>
                    )
                    : (
                      <Text className={`${cssPrefix}-card-order-item-content`}>
                        {item.extraText}
                      </Text>
                    )
                }

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
  productSDKObj: state.productSDK,
  orderAllStatus: getOrderAllStatus(state),
  currentType: getCurrentType(state),
});

export default connect(select)(OrderDetail);