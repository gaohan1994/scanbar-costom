import Taro, { Config } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "../style/product.less";
import numeral from "numeral";
import ProductComponent from "../../component/product/product";
import Footer from "./component/footer";
import { AppReducer } from "../../reducers";
import productSdk, {
  ProductCartInterface,
  NonActivityName
} from "../../common/sdk/product/product.sdk";
import Empty from "../../component/empty";
import SwiperAction from "../../component/swiperAction";
import { getUserinfo, getMemberInfo } from "../../reducers/app.user";
import { UserInterface, MerchantInterface } from "../../constants";
import "./index.less";
import { ProductInterface } from "../../constants/product/product";
import merchantAction from "../../actions/merchant.action";
import { Dispatch } from 'redux';
import { getCurrentMerchantDetail } from '../../reducers/app.merchant';
import { LoginManager } from "../../common/sdk";
import orderAction from "../../actions/order.action";

type Props = {
  dispatch: Dispatch;
  currentMerchantDetail: any;
  productSDKObj: any;
  memberInfo: any;
  productCartList: ProductCartInterface.ProductCartInfo[];
  userinfo: UserInterface.UserInfo;
  activityList: MerchantInterface.Activity[];
  productCartSelectedIndex: number[];
};

type State = {
  getUserinfoModal: boolean;
  loginModal: boolean;
};
class Page extends Taro.Component<Props, State> {
  config: Config = {
    navigationBarTitleText: "购物车"
  };

  state = {
    getUserinfoModal: false as any,
    loginModal: false as any
  };

  async componentDidMount() {
    // this.loginCheck();
    try {
        await LoginManager.getUserInfo(this.props.dispatch);
        await orderAction.getPointConfig(this.props.dispatch);
    } catch (error) {
        Taro.showToast({
            title: error.message,
            icon: 'none'
        });
    }
  }

  async componentDidShow() {
    // this.loginCheck();
    const { dispatch, currentMerchantDetail } = this.props;
    merchantAction.activityInfoList(dispatch, currentMerchantDetail.id);
    dispatch({
      type: "MANAGE_CART_BADGE",
      payload: {}
    });
  }

  public loginCheck() {
    const { userinfo } = this.props;
    if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
      // this.setState({ getUserinfoModal: true });
      Taro.navigateTo({ url: "/pages/login/login.userinfo" });
      return;
    }
    if (userinfo.phone === undefined || userinfo.phone.length === 0) {
      Taro.navigateTo({ url: "/pages/login/login" });
      return;
    }
  }

  public beforeSubmit = async () => {
    const { userinfo } = this.props;
    if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
      // this.setState({ getUserinfoModal: true });
      Taro.navigateTo({ url: "/pages/login/login.userinfo" });
      return false;
    }
    if (userinfo.phone === undefined || userinfo.phone.length === 0) {
      // this.setState({ loginModal: true });
      Taro.navigateTo({ url: "/pages/login/login" });
      return false;
    }
    return true;
  };

  public handleRemove = (
    product: ProductInterface.ProductInfo,
    type:
      | ProductCartInterface.ProductCartAdd
      | ProductCartInterface.ProductCartReduce
  ) => {
    const { dispatch, productSDKObj } = this.props;
    productSdk.manage(dispatch, productSDKObj, {
      type,
      product,
      num: product.sellNum
    });
  };
  getMaxActivityRule = (subTotalPrice: any, activity: any) => {
    if(activity.rule){
      const list: any = [];
      let maxThreshold = activity.rule[0].threshold;
      let nowThreshold = activity.rule[0].threshold;
      activity.rule.forEach(element => {
        if(subTotalPrice < element.threshold){
          list.push(element.threshold);

          if(nowThreshold > element.threshold){
            nowThreshold  = element.threshold;
          }
          if(maxThreshold < element.threshold){
            maxThreshold  = element.threshold;
          }
        } else {
          if(nowThreshold < element.threshold){
            nowThreshold  = element.threshold;
          }
          if(maxThreshold < element.threshold){
            maxThreshold  = element.threshold;
          }
        }
      
      });
      let price = list[0];
      list.forEach(element => {
        if(price > element){
          price  = element;
        }
      });

      const Item = activity.rule.find((r) => r.threshold === price);
      const maxDiscountItem = activity.rule.find((r) => r.threshold === maxThreshold);
      const NowDiscountItem = activity.rule.find((r) => r.threshold === nowThreshold);
      if(Item){
        return {rule: Item, ruleNow: NowDiscountItem};
      }
      return {rule: maxDiscountItem, ruleNow: NowDiscountItem};
    } 
  }
  render() {
    const {
      productCartList,
      userinfo,
      activityList,
      productCartSelectedIndex,
      memberInfo
    } = this.props;
    const {getMaxActivityRule} = this;
    const productFilterCartList = productSdk.filterByActivity(
      productCartList,
      activityList
    ).filter(val => val.productList.length > 0);
    return (
      <View className="container">
        {productCartList && productCartList.length > 0 ? (
          <View className="cart-list-info-cont">
            {productFilterCartList &&
              productFilterCartList.length > 0 &&
              productFilterCartList.map((filterList, filterListIndex) => {
                const { productList, activity } = filterList;

                let subTotalPrice: number = 0;
                productList.forEach(product => {
                  if (productCartSelectedIndex.some(id => product.id === id)) {
                    const itemTotal =
                      productSdk.getProductItemPrice(product, memberInfo) *
                      product.sellNum;
                    subTotalPrice += itemTotal;
                  }
                });
                const ActivityRule = getMaxActivityRule(subTotalPrice, activity);
                const {rule, ruleNow} = ActivityRule ? ActivityRule : {rule: null, ruleNow: null}
                // subTotalPrice < activity.rule[0].threshold
                const str = filterListIndex !== productFilterCartList.length - 1
                ? "cart-list-info cart-component-sec"
                : "cart-list-info"
                return (
                  <View
                    className={str}
                  >
                    {productList && productList.length > 0 && (
                      <View>
                        {activity && activity.name !== NonActivityName && (
                          <View className={`cart-component-section`}>
                            <View
                              className={`cart-component-bge cart-component-bge-red`}
                            >
                              {activity.name}
                            </View>

                            {`满${ruleNow.threshold}减${ruleNow.discount}`}
                            {rule.threshold > subTotalPrice? (
                              <View style="display: flex">
                                ，再买
                                <View style="color: #FC4E44">
                                  {numeral(
                                    rule.threshold - subTotalPrice
                                  ).format("0.00")}
                                </View>
                                元立享优惠
                              </View>
                            ) : (
                              <View />
                            )}
                            {rule.threshold > subTotalPrice ? (
                              <View
                                className={`cart-component-section-toHome`}
                                onClick={() => {
                                  Taro.navigateTo({url: '/pages/index/index'})
                                }}
                              >
                                去凑单
                                <Image
                                  className={`cart-component-section-toHome-img`}
                                  src={'//net.huanmusic.com/scanbar-c/icon_commodity_into.png'}
                                />
                              </View>
                            ) :null}
                          </View>
                        )}
                        {productList.map((item, index) => {
                          return (
                            <View className="cart-list-info">
                              <SwiperAction
                                onRemove={() => {
                                  this.handleRemove(
                                    item,
                                    productSdk.productCartManageType.REDUCE
                                  );
                                }}
                              >
                                <ProductComponent
                                  direct={true}
                                  selectedIndex={productCartSelectedIndex}
                                  key={item.id}
                                  product={item}
                                  last={index === productCartList.length - 1}
                                  isHome={false}
                                  isCart={true}
                                />
                              </SwiperAction>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
        ) : userinfo.nickname === undefined ||
          userinfo.nickname.length === 0 ||
          userinfo.phone === undefined ||
          userinfo.phone.length === 0 ? (
          <Empty
            img="//net.huanmusic.com/scanbar-c/v1/img_cart.png"
            text="完成登录后可享受更多会员服务"
            button={{
              title: "去登录",
              onClick: () => this.loginCheck()
            }}
          />
        ) : (
          <Empty
            img="//net.huanmusic.com/scanbar-c/v1/img_cart.png"
            text="还没有商品，快去选购吧"
            button={{
              title: "去选购",
              onClick: () => {
                Taro.switchTab({
                  url: `/pages/index/index`
                });
              }
            }}
          />
        )}
        {productCartList && productCartList.length > 0 && (
          <Footer
            selectedIndex={productCartSelectedIndex}
            isCart={true}
            beforeSubmit={this.beforeSubmit}
            style={process.env.TARO_ENV === "h5" ? { bottom: "50px" } : {}}
          />
        )}
      </View>
    );
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    activityList: state.merchant.activityList,
    currentMerchantDetail: getCurrentMerchantDetail(state),
    productCartList: state.productSDK.productCartList,
    productSDKObj: state.productSDK,
    memberInfo: getMemberInfo(state),
    userinfo: getUserinfo(state),
    productCartSelectedIndex: state.productSDK.productCartSelectedIndex
  };
};
export default connect(select)(Page);
