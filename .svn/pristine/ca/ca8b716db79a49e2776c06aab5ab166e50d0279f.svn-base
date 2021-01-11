import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import productSdk, { ProductCartInterface } from '../../common/sdk/product/product.sdk';
import "../card/form.card.less";
import "../../pages/style/product.less";
import '../../styles/theme.less';
import "../cart/cart.less";
import classnames from 'classnames';
import numeral from 'numeral';
import { AppReducer } from '../../reducers';
import { connect } from '@tarojs/redux';
import { getOrderDetail, getAbleToUseCouponList, getPointConfig } from '../../reducers/app.order';
import { OrderInterface, UserInterface } from '../../constants';
import { getMemberInfo } from '../../reducers/app.user';
import { Dispatch } from 'redux';
import { getPayOrderDetail } from '../../common/sdk/product/product.sdk.reducer';

const cssPrefix = 'product';

type Props = {
  dispatch: Dispatch;
  productList: Array<ProductCartInterface.ProductCartInfo>;
  className?: string;
  OrderCompute: any;
  productSDKObj: any;
  activityList: any;
  isPay?: true;
  memberInfo: any;
  payOrderProductList?: any;
  padding?: boolean;
  type?: number;
  payOrderDetail: any;
  isDetail?: boolean;
  DeliveryFee: any;
  pointConfig: any
  productCartSelectedIndex?: any;
  productCartList?: any;
  orderDetail: OrderInterface.OrderDetail;
  showCallModal?: () => void;
  onRef?: (param) => void
  couponList: UserInterface.CouponsItem[];
};

type State = {
  pointSet: boolean;
}

class ProductPayListView extends Taro.Component<Props, State> {
  state = {
    pointSet: false
  }
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    padding: true,
    payOrderDetail: {} as any,
  };
  componentWillMount = () => {
    if(this.props.onRef){
      this.props.onRef(this)
    }
  }
  changePointSet = () => {
    const {dispatch} = this.props;
    this.setState({
      pointSet: false
    })
    const points = {
      pointsTotalSell: 0, 
      pointsTotal: 0, 
    }
    productSdk.preparePayOrderPoints(points, dispatch);
  }
  getAbleToUseCouponsNum = () => {
    const { couponList } = this.props;
    let num = 0;
    for (let i = 0; i < couponList.length; i++) {
      if (couponList[i].ableToUse) {
        num += 1;
      }
    }
    return num;
  }

  render() {
    const { productList, className, padding, payOrderDetail, type, orderDetail, showCallModal, DeliveryFee } = this.props;
    const { orderDetailList, order } = orderDetail;
    return (
      <View
        className={classnames(className, {
          [`${cssPrefix}-pay-pos`]: padding,
          'component-form-wrap': true,
        })}
      >
        <View
          className={classnames('component-form', {
            'component-form-shadow': true,
            [`${cssPrefix}-row-items`]: true
          })}
        >
          {
            type && type === 1 && (
              <View className={`${cssPrefix}-row-header`}>
                <View className={`${cssPrefix}-row-header-item`}>
                  <Text className={`${cssPrefix}-row-header-shop `}>{order.merchantName || '未知商店'}</Text>
                </View>
                <View className={`${cssPrefix}-row-header-item`} onClick={() => { showCallModal ? showCallModal() : () => { } }}>
                  <Image
                    className={`${cssPrefix}-row-header-phone`}
                    src={'//net.huanmusic.com/weapp/icon_order_phone.png'}
                  />
                  <Text className={`${cssPrefix}-row-header-green`}>联系商家</Text>
                </View>
              </View>
            )
          }
          {
            type && type === 1
              ? orderDetailList && orderDetailList.length > 0 && orderDetailList.map((item) => {
                return this.renderProductItem(item)
              })
              : productList && productList.length > 0 && productList.map((item) => {
                return this.renderProductItem(item)
              })
          }
          {
            ((payOrderDetail && payOrderDetail.deliveryType !== undefined && payOrderDetail.deliveryType === 1)
              || (order && order.deliveryType !== undefined && order.deliveryType === 1)) && (
              <View className={`${cssPrefix}-row-totals`}>
                <View className={`${cssPrefix}-row-content-item`}>
                  <Text className={`${cssPrefix}-row-voucher`}>配送费</Text>
                  <View className={`${cssPrefix}-row-voucher-wrap`}>
                    <Text
                      className={
                        `${cssPrefix}-row-content-price ${cssPrefix}-row-content-price-black`
                      }
                    >
                      ￥{numeral(DeliveryFee).format('0.00')}
                    </Text>
                    {/* <Image
                      className={`${cssPrefix}-card-products-header-next`}
                      src={'//net.huanmusic.com/scanbar-c/icon_commodity_into.png'}
                    /> */}
                  </View>
                </View>
              </View>
            )
          }
          {this.renderDisount()}
          {this.renderTotal()}
        </View>
      </View>
    );
  }

  private renderProductItem = (item: any) => {
    const { type, memberInfo } = this.props;
    if (type && type === 1) {
      return (
        <View
          key={item.id}
          className={classnames(`${cssPrefix}-row ${cssPrefix}-row-content`, {
            // [`container-border`]: index !== (productList.length - 1)
          })}
        >
          <View className={`${cssPrefix}-row-box`}>
            {
              item && item.picUrl && item.picUrl.length > 0
                ? (
                  <View
                    className={`${cssPrefix}-row-cover`}
                    style={`background-image: url(${item.picUrl})`}
                  />
                )
                : (
                  <View
                    className={`${cssPrefix}-row-cover`}
                    style={`background-image: url(${"//net.huanmusic.com/scanbar-c/v1/pic_nopicture.png"})`}
                  />
                )
            }

            <View className={`${cssPrefix}-row-content ${cssPrefix}-row-content-box`}>
              <Text className={`${cssPrefix}-row-name${process.env.TARO_ENV === 'h5' ? '-h5' : ''}`}>{item.productName}</Text>
              <Text className={`${cssPrefix}-row-normal`}>{`x ${item.num}`}</Text>
              <View className={`${cssPrefix}-row-corner`}>
                <View>
                  <Text className={`${cssPrefix}-row-corner-price`}>￥</Text>
                  <Text className={`${cssPrefix}-row-corner-big`}>{numeral(item.viewPrice * item.num).format('0.00').split('.')[0]}</Text>
                  <Text className={`${cssPrefix}-row-corner-price`}>{`.${numeral(item.viewPrice * item.num).format('0.00').split('.')[1]}`}</Text>
                </View>
                {
                  item.totalAmount !== (item.viewPrice * item.num) ? (
                    <Text className={`${cssPrefix}-row-corner-origin`}>{`￥${item.totalAmount}`}</Text>
                  ) : null
                }
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View
        key={item.id}
        className={classnames(`${cssPrefix}-row ${cssPrefix}-row-content`, {
          // [`container-border`]: index !== (productList.length - 1)
        })}
      >
        <View className={`${cssPrefix}-row-box`}>
          {
            item && item.pictures && item.pictures.length > 0
              ? (
                <View
                  className={`${cssPrefix}-row-cover`}
                  style={`background-image: url(${item.pictures[0]})`}
                />
              )
              : (
                <View
                  className={`${cssPrefix}-row-cover`}
                  style={`background-image: url(${"//net.huanmusic.com/scanbar-c/v1/pic_nopicture.png"})`}
                />
              )
          }
          <View className={`${cssPrefix}-row-content ${cssPrefix}-row-content-box`}>
            <Text className={`${cssPrefix}-row-name${process.env.TARO_ENV === 'h5' ? '-h5' : ''}`}>{item.name}</Text>
            <Text className={`${cssPrefix}-row-normal`}>{`x ${item.sellNum}`}</Text>
            <View className={`${cssPrefix}-row-corner`}>
              <View className={process.env.TARO_ENV === 'h5' ? `${cssPrefix}-row-corner-group-h5` : `${cssPrefix}-row-corner-group`}>
                <Text className={`${cssPrefix}-row-corner-price`}>￥</Text>
                <Text className={`${cssPrefix}-row-corner-big`}>{numeral(productSdk.getProductItemPrice(item, memberInfo) * item.sellNum).format('0.00').split('.')[0]}</Text>
                <Text className={`${cssPrefix}-row-corner-price`}>{`.${numeral(productSdk.getProductItemPrice(item, memberInfo) * item.sellNum).format('0.00').split('.')[1]}`}</Text>
              </View>
              {
                (item.price * item.sellNum) !== (productSdk.getProductItemPrice(item, memberInfo) * item.sellNum) ? (
                  <Text className={`${cssPrefix}-row-corner-origin`}>{`￥${item.price * item.sellNum}`}</Text> ): null
                
              }
            </View>
          </View>
        </View>
      </View>
    );
  }
  getorderActivityInfoListTotal = (list) => {
    let total = 0;
    if(list){
      list.forEach(element => {
        if(element.activityType === 3){
          total += element.discountAmount
        }
      });
    }
    return total;
  }
  private renderDisount = () => {
    const { payOrderDetail, type, orderDetail, productCartList, memberInfo, pointConfig, activityList, isDetail, dispatch, DeliveryFee } = this.props;
    const { order, orderActivityInfoList } = orderDetail;
    const {pointSet} = this.state;
    const ableToUseCouponsNum = this.getAbleToUseCouponsNum();
    const totalActivityMoney = productSdk.getProductTotalActivityPrice(activityList, memberInfo, productCartList);
    const orderActivityInfoListTotal = this.getorderActivityInfoListTotal(orderActivityInfoList);
    const {countTotal} = this;
    const {price} = countTotal();
    const pointPrice = DeliveryFee && payOrderDetail.deliveryType === 1 && numeral(price).value() > 0  ? numeral(price).value() - DeliveryFee : numeral(price).value();
    const PointsPre = numeral(numeral(memberInfo.points * pointConfig.deductRate < pointPrice ? memberInfo.points * pointConfig.deductRate : pointPrice).format('0.00')).value();
    const MathPointsPre = Math.ceil(PointsPre / pointConfig.deductRate);
    return (
      <View>
        {totalActivityMoney !== 0 && !isDetail && (
          <View className={`${cssPrefix}-row-totals`}>
            <View className={`${cssPrefix}-row-content-item ${cssPrefix}-row-content-column`}>
              <View className={`${cssPrefix}-row-content-column-item`}>
                <View className={classnames(
                  `${cssPrefix}-row-content-row`,
                  {
                    [`${cssPrefix}-row-content-row-top`]: false
                  })}
                >
                  <View
                    className={classnames(
                      `${cssPrefix}-row-discount`,
                      {
                        [`${cssPrefix}-row-discount-full`]: true,
                        [`${cssPrefix}-row-discount-first`]: false,
                      })}
                  >
                    满减
                    </View>
                  {/* <Text className={`${cssPrefix}-row-discount-title`}>
                    满{rule.threshold}减{rule.discount}
                  </Text> */}
                </View>
                <Text className={`${cssPrefix}-row-content-price`}>-￥{numeral(totalActivityMoney).format('0.00')}</Text>
              </View>
              {/* <View className={`${cssPrefix}-row-content-column-item`}>
                <View className={`${cssPrefix}-row-content-row`}>
                  <View
                    className={classnames(
                      `${cssPrefix}-row-discount`,
                      {
                        [`${cssPrefix}-row-discount-full`]: false,
                        [`${cssPrefix}-row-discount-first`]: true,
                      })}
                  >
                    首单
                    </View>
                  <Text className={`${cssPrefix}-row-discount-title`}>首单立减10元</Text>
                </View>
                <Text className={`${cssPrefix}-row-content-price`}>-￥20</Text>
              </View> */}
            </View>
          </View>
        )}
        {orderActivityInfoListTotal !== 0 && isDetail && (
          <View className={`${cssPrefix}-row-totals`}>
            <View className={`${cssPrefix}-row-content-item ${cssPrefix}-row-content-column`}>
              <View className={`${cssPrefix}-row-content-column-item`}>
                <View className={classnames(
                  `${cssPrefix}-row-content-row`,
                  {
                    [`${cssPrefix}-row-content-row-top`]: false
                  })}
                >
                  <View
                    className={classnames(
                      `${cssPrefix}-row-discount`,
                      {
                        [`${cssPrefix}-row-discount-full`]: true,
                        [`${cssPrefix}-row-discount-first`]: false,
                      })}
                  >
                    满减
                  </View>
                  
                </View>
                <Text className={`${cssPrefix}-row-content-price`}>-￥{numeral(orderActivityInfoListTotal).format('0.00')}</Text>
              </View>
            </View>
          </View>
        )}
        {
          type && type === 1 
            ? order.couponDiscount && order.couponDiscount > 0 ? (
              <View className={`${cssPrefix}-row-totals`} >
                <View className={`${cssPrefix}-row-content-item`}>
                  <Text className={`${cssPrefix}-row-voucher`}>优惠券</Text>
                  <View className={`${cssPrefix}-row-content-row`}>
                    <Text className={`${cssPrefix}-row-content-price`}>
                      -¥{order.couponDiscount}
                    </Text>
                    <Image
                      className={`${cssPrefix}-row-header-next`}
                      src={'//net.huanmusic.com/scanbar-c/icon_commodity_into.png'}
                    />
                  </View>
                </View>
              </View>
            ) : null
            : (
              <View className={`${cssPrefix}-row-totals`} onClick={() => { Taro.navigateTo({ url: '/pages/order/order.pay.coupon' }) }}>
                <View className={`${cssPrefix}-row-content-item`}>
                  <Text className={`${cssPrefix}-row-voucher`}>优惠券</Text>
                  <View className={`${cssPrefix}-row-content-row`}>
                    {
                      payOrderDetail && payOrderDetail.selectedCoupon && payOrderDetail.selectedCoupon.id
                        ? (
                          <Text className={`${cssPrefix}-row-content-price`}>
                            -¥{payOrderDetail.selectedCoupon.couponVO.discount || 0}
                          </Text>
                        )
                        : (
                          ableToUseCouponsNum > 0
                            ? (
                              <View className={`${cssPrefix}-row-content-box-coupon ${process.env.TARO_ENV === 'h5' ? `${cssPrefix}-row-content-box-coupon-h5` : ''}`}>
                                {ableToUseCouponsNum}张可用
                        </View>
                            )
                            : (
                              <Text className={`${cssPrefix}-row-content-grey`}>无可用优惠券</Text>
                            )
                        )
                    }
                    <Image
                      className={`${cssPrefix}-row-header-next`}
                      src={'//net.huanmusic.com/scanbar-c/icon_commodity_into.png'}
                    />
                  </View>
                </View>
              </View>
            )
        }
        {
          !isDetail  && memberInfo && memberInfo.points ? (
            <View className={`${cssPrefix}-row-totals`} >
              <View className={`${cssPrefix}-row-content-item`}>
                <Text className={`${cssPrefix}-row-voucher`}>积分抵现<Text className={`${cssPrefix}-row-voucher-span`}>({MathPointsPre}积分)</Text></Text>
                <View className={`${cssPrefix}-row-content-row`}>
                  <Text className={`${cssPrefix}-row-content-price`} style={{marginRight: '-.4em'}}>
                    -¥{PointsPre}
                  </Text>
                  <View 
                    className={`${cssPrefix}-point-select`}
                    onClick={() => {
                        this.setState({
                          pointSet: !pointSet,
                        })
                        if(!pointSet){
                          const points = {
                            pointsTotal: numeral(PointsPre).value(), 
                            pointsTotalSell: MathPointsPre, 
                          }
                          productSdk.preparePayOrderPoints(points, dispatch);
                        } else {
                          const points = {
                            pointsTotalSell: 0, 
                            pointsTotal: 0, 
                          }
                          productSdk.preparePayOrderPoints(points, dispatch);
                        }
                    }}
                  >
                    <View 
                      className={classnames(`${cssPrefix}-point-select-item`, {
                          [`${cssPrefix}-point-select-normal`]: !pointSet, 
                          [`${cssPrefix}-point-select-active`]: !!pointSet,
                      })}
                    />
                  </View>
                </View>
              </View>
            </View>
          ) : null
        }
        {
         isDetail && order && order.pointDiscount ? (
            <View className={`${cssPrefix}-row-totals`} >
              <View className={`${cssPrefix}-row-content-item`}>
                <Text className={`${cssPrefix}-row-voucher`}>积分抵现<span className={`${cssPrefix}-row-voucher-span`}>({Math.ceil(order.pointDiscount)}积分)</span></Text>
                <View className={`${cssPrefix}-row-content-row`}>
                  <Text className={`${cssPrefix}-row-content-price`}>
                    -¥{order.pointDiscount}
                  </Text>
                </View>
              </View>
            </View>
          ) : null
        }
        
      </View>
    )
  }
  private countTotal = () => {
    const { payOrderDetail, type, orderDetail, activityList, memberInfo, productCartList, DeliveryFee } = this.props;
    const { order } = orderDetail;
    let price =
      numeral(
        productSdk.getProductTransPrice(activityList, memberInfo, productCartList)  -
        (payOrderDetail.selectedCoupon && payOrderDetail.selectedCoupon.couponVO ? payOrderDetail.selectedCoupon.couponVO.discount : 0)
      ).format('0.00');
    let discountPrice =
      numeral(
        productSdk.getProductsOriginPrice(productCartList) -
        productSdk.getProductTransPrice(activityList, memberInfo, productCartList) +
        (payOrderDetail.selectedCoupon && payOrderDetail.selectedCoupon.couponVO ? payOrderDetail.selectedCoupon.couponVO.discount : 0)
      ).format('0.00');
    if(numeral(discountPrice).value() < 0 ){
      discountPrice = '0.00'
    } 
    if(numeral(price).value() < 0 ){
      price = 
      numeral(payOrderDetail && payOrderDetail.deliveryType !== undefined && payOrderDetail.deliveryType === 1 ? DeliveryFee : 0).format('0.00');
    } else {
      price = 
      numeral(numeral(price).value() + (payOrderDetail && payOrderDetail.deliveryType !== undefined && payOrderDetail.deliveryType === 1 ? DeliveryFee : 0)).format('0.00');
    }
    if (type && type === 1) {
      if (orderDetail && orderDetail.order) {
        price = numeral(orderDetail.order.transAmount).format('0.00');
        discountPrice = numeral(order.totalAmount - order.transAmount).format('0.00');
      } else {
        price = numeral(0).format('0.00');
        discountPrice = numeral(0).format('0.00');
      }
    }
    return {
      price,
      discountPrice
    }
  }
  countTotalPrice = () => {
    const {payOrderDetail, orderDetail, payOrderProductList, DeliveryFee } = this.props;
    const { order } = orderDetail;
    let total = 0;
    payOrderProductList.forEach((val) => {
        total += val.price * val.sellNum;
    })
    if(((payOrderDetail && payOrderDetail.deliveryType !== undefined && payOrderDetail.deliveryType === 1)
    || (order && order.deliveryType !== undefined && order.deliveryType === 1))){
        total += DeliveryFee;
    }
    return total;
}
  private renderTotal = () => {
    const { memberInfo, pointConfig, DeliveryFee, payOrderDetail, productCartList, payOrderProductList, productSDKObj, activityList, OrderCompute } = this.props;
    // const { order } = orderDetail;
    const {pointSet} = this.state;
    const {countTotal, countTotalPrice} = this;
    const {price} = countTotal();
    let tarnsPrice = payOrderProductList && payOrderProductList.length > 0
    ? numeral(
        productSdk.getProductTransPrice(activityList, memberInfo, productCartList, payOrderProductList)  -
        (payOrderDetail.selectedCoupon && payOrderDetail.selectedCoupon.couponVO ? payOrderDetail.selectedCoupon.couponVO.discount : 0)
    ).format('0.00')
    : '0.00';
    if(numeral(tarnsPrice).value() < 0 ){
      tarnsPrice =
      numeral(payOrderDetail.deliveryType === 1 ? DeliveryFee : 0).format('0.00')
    } else {
      tarnsPrice = 
      numeral(numeral(tarnsPrice).value() + (payOrderDetail.deliveryType === 1 ? DeliveryFee : 0)).format('0.00')
    }
    if(productSDKObj.pointsTotal){
        tarnsPrice = numeral(numeral(tarnsPrice).value() - productSDKObj.pointsTotal).format('0.00');
    }
    let discountPriceFoot = countTotalPrice() - numeral(tarnsPrice).value();

    let newPrice = OrderCompute && OrderCompute.orderComputeBO ? OrderCompute.orderComputeBO.transAmount : price;
    if(pointSet === true){
      const money = memberInfo.points * pointConfig.deductRate;
      if( DeliveryFee && payOrderDetail.deliveryType === 1){
        const pointPrice= numeral(newPrice).value() - DeliveryFee;
        if(money < numeral(pointPrice).value()){
          newPrice = numeral(numeral(newPrice).value() - money).format('0.00');
        } else {
          newPrice = numeral(DeliveryFee).format('0.00');
        }
      } else {
        if(money < numeral(newPrice).value()){
          newPrice = numeral(numeral(newPrice).value() - money).format('0.00');
        } else {
          newPrice = '0.00'
        }
      }
    }
    // console.log('discountPriceFoot', discountPriceFoot, productSDKObj)
    // let price =
    //   numeral(
    //     productSdk.getProductTransPrice(activityList, memberInfo, productCartList) +
    //     (payOrderDetail && payOrderDetail.deliveryType !== undefined && payOrderDetail.deliveryType === 1 ? DeliveryFee : 0) -
    //     (payOrderDetail.selectedCoupon && payOrderDetail.selectedCoupon.couponVO ? payOrderDetail.selectedCoupon.couponVO.discount : 0)
    //   ).format('0.00');
    // let discountPrice =
    //   numeral(
    //     productSdk.getProductsOriginPrice(productCartList) -
    //     productSdk.getProductTransPrice(activityList, memberInfo, productCartList) +
    //     (payOrderDetail.selectedCoupon && payOrderDetail.selectedCoupon.couponVO ? payOrderDetail.selectedCoupon.couponVO.discount : 0)
    //   ).format('0.00');
    // if (type && type === 1) {
    //   if (orderDetail && orderDetail.order) {
    //     price = numeral(orderDetail.order.transAmount).format('0.00');
    //     discountPrice = numeral(order.totalAmount - order.transAmount).format('0.00');
    //   } else {
    //     price = numeral(0).format('0.00');
    //     discountPrice = numeral(0).format('0.00');
    //   }
    // }
    return (
      <View className={`${cssPrefix}-row-totals`}>
        <View className={`${cssPrefix}-row-content-item`}>
          <View />
          <View className={`${cssPrefix}-row-tran`}>
            <Text className={`${cssPrefix}-row-tran`}>{`已优惠￥ ${numeral(OrderCompute && OrderCompute.orderComputeBO ? OrderCompute.orderComputeBO.discount : discountPriceFoot).format('0.00')}`}</Text>
            <Text className={`${cssPrefix}-row-tran ${cssPrefix}-row-tran-margin`}>{`合计：`}</Text>
            <Text className={`${cssPrefix}-row-tran-price`}>￥</Text>
            <Text className={`${cssPrefix}-row-tran-price ${cssPrefix}-row-tran-big `}>{`${numeral(newPrice).format("0.00")}`.split('.')[0]}</Text>
            <Text className={`${cssPrefix}-row-tran-price`}>{`.${`${numeral(newPrice).format("0.00")}`.split('.')[1]}`}</Text>
          </View>
        </View>
      </View>
    )
  }
}


const select = (state: AppReducer.AppState) => {
  return {
    productCartList: state.productSDK.productCartList,
    productCartSelectedIndex: state.productSDK.productCartSelectedIndex,
    payOrderProductList: state.productSDK.payOrderProductList,
    orderDetail: getOrderDetail(state),
    activityList: state.merchant.activityList,
    couponList: getAbleToUseCouponList(state),
    memberInfo: getMemberInfo(state),
    pointConfig: getPointConfig(state),
    payOrderDetail:　getPayOrderDetail(state),
    productSDKObj: state.productSDK,
  }
}
export default connect(select)(ProductPayListView as any);