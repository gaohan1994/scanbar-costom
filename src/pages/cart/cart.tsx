import Taro, { Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
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
import { store } from "../../app";
import { getUserinfo } from "../../reducers/app.user";
import { UserInterface, MerchantInterface } from "../../constants";
import "./index.less";
import { ProductInterface } from "../../constants/product/product";
import merchantAction from "../../actions/merchant.action";

type Props = {
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
  }

  async componentDidShow() {
    // this.loginCheck();
    merchantAction.activityInfoList();
    store.dispatch({
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
    productSdk.manage({ type, product, num: product.sellNum });
  };

  render() {
    const {
      productCartList,
      userinfo,
      activityList,
      productCartSelectedIndex
    } = this.props;
    const productFilterCartList = productSdk.filterByActivity(
      productCartList,
      activityList
    );
    console.log("====================================");
    console.log(productFilterCartList);
    console.log("====================================");
    return (
      <View className="container">
        {productCartList && productCartList.length > 0 ? (
          <View className="cart-list-info-cont">
            {productFilterCartList &&
              productFilterCartList.length > 0 &&
              productFilterCartList.map(filterList => {
                const { productList, activity } = filterList;

                let subTotalPrice: number = 0;
                productList.forEach(product => {
                  if (productCartSelectedIndex.some(id => product.id === id)) {
                    const itemTotal =
                      productSdk.getProductItemPrice(product) * product.sellNum;
                    subTotalPrice += itemTotal;
                  }
                });
                return (
                  <View className="cart-list-info cart-component-sec">
                    {productList && productList.length > 0 && (
                      <View>
                        {activity && activity.name !== NonActivityName && (
                          <View className={`cart-component-section`}>
                            <View
                              className={`cart-component-bge cart-component-bge-red`}
                            >
                              {activity.name}
                            </View>

                            {`满${activity.rule[0].threshold}减${activity.rule[0].discount}`}
                            {subTotalPrice < activity.rule[0].threshold ? (
                              <View style="display: flex">
                                ，再买
                                <View style="color: #FC4E44">
                                  {numeral(
                                    activity.rule[0].threshold - subTotalPrice
                                  ).format("0.00")}
                                </View>
                                元立享优惠
                              </View>
                            ) : (
                              <View />
                            )}
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
          <Footer beforeSubmit={this.beforeSubmit} />
        )}
      </View>
    );
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    activityList: state.merchant.activityList,
    productCartList: state.productSDK.productCartList,
    userinfo: getUserinfo(state),
    productCartSelectedIndex: state.productSDK.productCartSelectedIndex
  };
};
export default connect(select)(Page);
