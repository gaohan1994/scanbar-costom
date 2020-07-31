import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./order.less";
import { OrderInterface, ResponseCode, MerchantInterface } from "../../constants";
import numeral from "numeral";
import { OrderAction, ProductAction } from "../../actions";
import classnames from "classnames";
import invariant from "invariant";
import productSdk from "../../common/sdk/product/product.sdk";
import orderAction from "../../actions/order.action";
import { Dispatch } from "redux";
import merchantAction from "../../actions/merchant.action";
import { connect } from "@tarojs/redux";

const cssPrefix = "component-order-item";

type Props = {
  dispatch: Dispatch;
  productSDKObj: any;
  data: OrderInterface.OrderDetail;
  orderAllStatus: any[];
  currentType?: number;
  setCurrentMerchantDetail: (
    merchant: MerchantInterface.AlianceMerchant
  ) => void;
};
type State = {};

class OrderItem extends Taro.Component<Props, State> {
  static defaultProps = {
    data: {}
  };

  public onClickOrder = (order: OrderInterface.OrderDetail) => {
    Taro.navigateTo({
      url: `/pages/order/order.detail?id=${order.order.orderNo}`
    });
  };

  public renderPrice = (num: number) => {
    const price = num ? numeral(num).format("0.00") : "0.00";
    return (
      <Text className={`${cssPrefix}-price`}>
        <Text>￥</Text>
        <Text className={`${cssPrefix}-price-integer`}>
          {price.split(".")[0]}
        </Text>
        <Text>{`.${price.split(".")[1]}`}</Text>
      </Text>
    );
  };

  public orderCancle = async (order: OrderInterface.OrderInfo) => {
    const { currentType, dispatch } = this.props;
    const { orderNo } = order;
    const payload = {
      orderNo: orderNo
    };
    try {
      const res = await OrderAction.orderCancle(payload);
      invariant(res.code === ResponseCode.success, "取消订单失败");
      Taro.showToast({
        title: "取消订单成功",
        icon: "success"
      });
      OrderAction.orderList(dispatch, {
        pageNum: 1,
        pageSize: 20,
        ...orderAction.getFetchType(currentType)
      });
      OrderAction.orderCount(dispatch);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  };

  public onPay = async (order: OrderInterface.OrderInfo) => {
    const { orderNo } = order;
    const payment = await productSdk.requestPayment(orderNo, order.payType);
    if (payment.code === ResponseCode.success) {
      Taro.navigateTo({
        url: `/pages/order/order.detail?id=${orderNo}`
      });
    } else {
      Taro.showToast({
        title: payment.msg,
        icon: "none"
      });
    }
  };

  public orderOneMore = async (order: OrderInterface.OrderDetail) => {
    const { orderDetailList, order: orderInfo } = order;
    const { dispatch, productSDKObj } = this.props;
    if (orderDetailList && orderDetailList.length > 0) {
      for (let i = 0; i < orderDetailList.length; i++) {
        const res = await ProductAction.productInfoDetail(dispatch, {
          id: orderDetailList[i].productId
        });
        if (res.code === ResponseCode.success) {
          productSdk.manage(dispatch, productSDKObj, {
            type: productSdk.productCartManageType.ADD,
            product: res.data,
            num: orderDetailList[i].num
          });
          // setTimeout(() => {
          //   Taro.switchTab({
          //     url: `/pages/cart/cart`
          //   });
          // }, 1000);
          this.props.setCurrentMerchantDetail({ id: orderInfo.merchantId } as MerchantInterface.AlianceMerchant);
          Taro.navigateTo({
            url: `/pages/index/home`
          });
        } else {
          if (res.msg) {
            Taro.showToast({
              title: res.msg,
              icon: "none"
            });
          } else {
            Taro.showToast({
              title: "获取商品失败",
              icon: "none"
            });
          }
        }
      }
    }
  };

  render() {
    const { data, orderAllStatus, currentType } = this.props;
    const { order, orderDetailList } = data;
    const res = OrderAction.orderStatus(orderAllStatus, data);
    let products: any[] = [];

    if (orderDetailList && orderDetailList.length > 3) {
      products = orderDetailList.slice(0, 3);
    } else if (orderDetailList) {
      products = orderDetailList;
    }

    return (
      <View className={`${cssPrefix}-card`}>
        <View
          className={classnames(`${cssPrefix}-card-status`, {
            [`${cssPrefix}-card-status-red`]:
              res.title === "待支付" || res.title === "等待商家处理" || res.title === "商家拒绝退货",
            [`${cssPrefix}-card-status-orange`]:
              res.title === "待收货" || res.title === "待自提" || res.title === "待发货"
              || res.title === "商家同意退货" || res.title === "您已撤销退货申请",
            [`${cssPrefix}-card-status-blue`]: res.title === "退货成功"
          })}
        >
          {res.title}
        </View>

        <View className={`${cssPrefix}-card-header`}>
          <Image
            src="//net.huanmusic.com/scanbar-c//icon_order_store.png"
            className={`${cssPrefix}-card-header-icon`}
          />
          <View className={`${cssPrefix}-card-header-text`}>
            <View className={`${cssPrefix}-card-header-text-shop`}>
              {order.merchantName || "未知商店"}
            </View>
            <View className={`${cssPrefix}-card-header-text-time`}>
              {order.createTime || ""}
            </View>
          </View>
        </View>

        <View
          className={`${cssPrefix}-card-center`}
          onClick={() => {
            this.onClickOrder(data);
          }}
        >
          <View className={`${cssPrefix}-card-center-products`}>
            {products.map((product: any) => {
              return (
                <View className={`${cssPrefix}-card-center-product`}>
                  {product.picUrl && product.picUrl.length > 0 ? (
                    <View
                      className={`${cssPrefix}-card-center-product-pic`}
                      style={`background-image: url(${product.picUrl})`}
                    />
                  ) : (
                      // <Image
                      //   src="//net.huanmusic.com/scanbar-c/v1/pic_nopicture.png"
                      //   className={`${cssPrefix}-card-center-product-pic`}
                      // />
                      <View className={`${cssPrefix}-card-center-product-pic`} />
                    )}

                  <Text
                    className={`${cssPrefix}-card-center-product-text${
                      process.env.TARO_ENV === "h5" ? "-h5" : ""
                      }`}
                  >
                    {product.productName}
                  </Text>
                </View>
              );
            })}
          </View>

          <View className={`${cssPrefix}-card-center-info`}>
            <View className={`${cssPrefix}-card-center-info-container`}>
              {order && order.transAmount !== undefined
                ? this.renderPrice(order.transAmount)
                : this.renderPrice(0)}
              <Text className={`${cssPrefix}-card-center-info-total`}>
                共{order.totalNum}件
            </Text>
            </View>
          </View>
        </View>
        <View className={`${cssPrefix}-card-button`}>
          {/* <OrderButtons data={data} orderAllStatus={orderAllStatus} currentType={currentType}/> */}
          {res.title === "待支付" ? (
            <View className={`${cssPrefix}-card-button`}>
              <View
                className={`${cssPrefix}-card-button-common ${cssPrefix}-card-button-again`}
                onClick={() => {
                  this.orderCancle(order);
                }}
              >
                取消订单
              </View>
              <View
                className={`${cssPrefix}-card-button-common ${cssPrefix}-card-button-pay`}
                onClick={() => {
                  this.onPay(order);
                }}
              >
                去支付
              </View>
            </View>
          ) : (
              <View className={`${cssPrefix}-card-button`}>
                <View
                  className={`${cssPrefix}-card-button-common ${cssPrefix}-card-button-again`}
                  onClick={() => {
                    this.orderOneMore(data);
                  }}
                >
                  再来一单
              </View>
              </View>
            )}
        </View>
      </View>
    );
  }
}

const mapDispatch = dispatch => {
  return {
    setCurrentMerchantDetail: merchantAction.setCurrentMerchantDetail(dispatch)
  };
};

export default connect(() => ({}), mapDispatch)(OrderItem as any);
