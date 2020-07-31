/**
 * @Author: Ghan
 * @Date: 2019-11-05 15:10:38
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-07-28 16:47:36
 *
 * @todo [购物车组件]
 */
import Taro from "@tarojs/taro";
import { View, Image, Text, Button } from "@tarojs/components";
import "./cart.less";
import "../product/product.less";
import classnames from "classnames";
import { AppReducer } from "../../reducers";
import { AtActionSheet, AtActionSheetItem } from "taro-ui";
import { connect } from "@tarojs/redux";
import productSdk, {
  ProductCartInterface
} from "../../common/sdk/product/product.sdk";
import { ProductInterface } from "../../constants";
import numeral from "numeral";
import CartLayout from "./cart.layout";
import Badge from "../badge/badge";
import { getProductCartList } from "../../common/sdk/product/product.sdk.reducer";
import { getMemberInfo } from "../../reducers/app.user";

const cssPrefix = "cart";

interface CartBarProps {
  productCartList: Array<ProductCartInterface.ProductCartInfo>;
  changeWeightProduct:
  | ProductCartInterface.ProductCartInfo
  | ProductInterface.ProductInfo;
  nonBarcodeProduct: Partial<
    ProductCartInterface.ProductCartInfo | ProductInterface.ProductInfo
  >;
  changeProductVisible: boolean;
  selectProduct?: ProductInterface.ProductInfo;
  changeProduct?: ProductCartInterface.ProductCartInfo;
  sort?: string;
  shareToken: boolean;
  shareProduct: ProductInterface.ProductInfo;
  memberInfo: any;
  productSDKObj: any;
}

interface CartBarState {
  cartListVisible: boolean; // 是否显示购物车列表
}

class CartBar extends Taro.Component<CartBarProps, CartBarState> {
  readonly state: CartBarState = {
    cartListVisible: false
  };
  /**
   * @todo [修改购物车列表显示]
   *
   * @memberof CartBar
   */
  public onChangeCartListVisible = (visible?: boolean) => {
    this.setState(prevState => {
      return {
        ...prevState,
        cartListVisible:
          typeof visible === "boolean" ? visible : !prevState.cartListVisible
      };
    });
  };

  public onChangeValue = (key: string, value: string) => {
    this.setState(prevState => {
      return {
        ...prevState,
        [key]: value
      };
    });
  };

  public manageProduct = (
    type:
      | ProductCartInterface.ProductCartAdd
      | ProductCartInterface.ProductCartReduce,
    product: ProductCartInterface.ProductCartInfo
  ) => {
    // productSdk.manage((this.props as any).dispatch, {}, { type, product });
    productSdk.manage((this.props as any).dispatch, this.props.productSDKObj, {type, product});
  };

  public onPayHandle = () => {
    const { productCartList } = this.props;
    if (productCartList.length > 0) {
      // const selectProductList = productCartList.filter(product => {
      //   return productCartSelectedIndex.some(id => id === product.id);
      // });
      productSdk.preparePayOrder((this.props as any).dispatch, productCartList);
      productSdk.preparePayOrderDetail(
        { selectedCoupon: {} },
        (this.props as any).dispatch
      );
      Taro.navigateTo({
        url: `/pages/order/order.pay`
      });
      return;
    } else {
      Taro.showToast({
        title: `请选择要结算的商品`,
        icon: "none"
      });
    }
    this.onChangeCartListVisible(false);
  };

  public setText = (): string => {
    return "结算";
  };

  public emptyCart = () => {
    const { productCartList } = this.props;
    if (productCartList.length > 0) {
      Taro.showModal({
        title: "提示",
        content: "确定清空购物车吗?",
        success: res => {
          if (res.confirm) {
            productSdk.manage(
              (this.props as any).dispatch,
              {},
              {
                type: productSdk.productCartManageType.EMPTY,
                product: {} as any
              }
            );
            this.onChangeCartListVisible(false);
          }
        }
      });
    }
  };

  public onCloseShare = () => {
    // productAction.toogleShare();
  };

  render() {
    const { shareToken } = this.props;
    return (
      <View>
        {this.renderContent()}
        <View className="cart">
          <View className={`cart-bg cart-border`}>
            {this.renderCartLeft()}
            {this.renderCartRight()}
          </View>
        </View>

        <AtActionSheet
          isOpened={shareToken}
          cancelText="取消"
          onCancel={() => this.onCloseShare()}
        >
          <AtActionSheetItem>
            <Button openType="share" style="background: #fff">
              微信好友
            </Button>
          </AtActionSheetItem>
        </AtActionSheet>
      </View>
    );
  }

  private renderCartLeft = () => {
    const { productCartList, memberInfo } = this.props;
    let cartPrice: number = 0;
    productCartList.map(item => {
      cartPrice +=
        productSdk.getProductItemPrice(item, memberInfo) * item.sellNum;
    });
    return (
      <View style="width: 100%; height: 100%">
        <View className="cart-left">
          {productCartList.length > 0 ? (
            <View
              className="cart-icon"
              onClick={() => this.onChangeCartListVisible()}
            >
              <Badge
                value={productSdk.getProductNumber(undefined)}
                className="component-cart-bge"
              >
                <Image
                  src="//net.huanmusic.com/scanbar-c/icon_cart_blue.png"
                  className="cart-icon-image"
                />
              </Badge>
            </View>
          ) : (
              <Image
                src="//net.huanmusic.com/scanbar-c/icon_cart_grey.png"
                className="cart-icon-image cart-icon"
                onClick={() => this.onChangeCartListVisible()}
              />
            )}
          <View
            className={classnames(`${cssPrefix}-left-price`, {
              [`${cssPrefix}-left-price-active`]: productCartList.length > 0,
              [`${cssPrefix}-left-price-disabled`]: productCartList.length === 0
            })}
          >
            ￥{numeral(cartPrice).format("0.00")}
          </View>
        </View>
      </View>
    );
  };

  private renderCartRight = () => {
    const { productCartList } = this.props;
    return (
      <View
        className={classnames("cart-right", {
          ["cart-right-active"]: productCartList.length > 0,
          ["cart-right-disabled"]: productCartList.length === 0
        })}
        onClick={() => this.onPayHandle()}
      >
        {this.setText()}
      </View>
    );
  };

  private renderContent = () => {
    const { cartListVisible } = this.state;
    const { productCartList, memberInfo } = this.props;
    return (
      <CartLayout
        isOpened={cartListVisible}
        title={`已选择商品（${productSdk.getProductNumber() || 0}）`}
        titleRight={"清空购物车"}
        titleRightIcon="//net.huanmusic.com/weapp/icon_empty.png"
        titleRightClick={() => this.emptyCart()}
        onClose={() => this.onChangeCartListVisible(false)}
      >
        {productCartList.length > 0 &&
          productCartList.map(product => {
            const price = productSdk.getProductItemPrice(product, memberInfo)
            return (
              <View key={product.id}>
                <View
                  className={`${cssPrefix}-product ${cssPrefix}-product-border`}
                >
                  <View
                    className={`${cssPrefix}-product-container`}
                    onClick={() => this.onChangeProductShow(product)}
                  >
                    <View className={`${cssPrefix}-product-container-name`}>
                      {product.name}
                      {product.remark && `（${product.remark}）`}
                    </View>
                    <View className={`${cssPrefix}-product-container-normal`}>
                      <Text
                        className={`${cssPrefix}-product-container-price`}
                      >{`￥${price}`}</Text>
                    </View>
                    <View className={`${cssPrefix}-product-stepper`}>
                      <View
                        className={classnames(
                          `component-product-stepper-button`,
                          `component-product-stepper-button-reduce`
                        )}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          this.manageProduct(
                            productSdk.productCartManageType.REDUCE,
                            product
                          )
                        }}
                      />
                      <Text
                        className={`component-product-stepper-text component-product-stepper-text-cart`}
                      >
                        {product.sellNum}
                      </Text>
                      <View
                        className={classnames(
                          `component-product-stepper-button`,
                          `component-product-stepper-button-add`
                        )}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          this.manageProduct(
                            productSdk.productCartManageType.ADD,
                            product
                          )
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        <View style="height: 50px; width: 100%" />
      </CartLayout>
    );
  };

  private onChangeProductShow = (
    product: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo
  ) => {
    Taro.navigateTo({
      url: `/pages/product/product.detail?id=${product.id}`
    });
  };
}

const select = (state: AppReducer.AppState, ownProps: CartBarProps) => {
  const productCartList = getProductCartList(state);
  const memberInfo = getMemberInfo(state);
  return {
    productCartList,
    memberInfo,
    productSDKObj: state.productSDK,
  };
};

export default connect(select)(CartBar as any);
