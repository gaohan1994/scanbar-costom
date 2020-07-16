import Taro, { useState, useEffect } from "@tarojs/taro";
import { AtActivityIndicator } from "taro-ui";
import { View, Text } from "@tarojs/components";
import productSdk, {
  ProductCartInterface
} from "../../../common/sdk/product/product.sdk";
import "./index.less";
import "../../../component/product/product.less";
import classnames from "classnames";
import { connect } from "@tarojs/redux";
import { AppReducer } from "src/reducers";
import { getProductCartList } from "../../../common/sdk/product/product.sdk.reducer";

const cssPrefix = "component-product";
const prefix = "product-detail-component";

type Props = {
  product: ProductCartInterface.ProductCartInfo;
  productInCart?: ProductCartInterface.ProductCartInfo;
  dispatch: any;
  productSDKObj: any;
};

function ProductStepper(props: Props) {
  const { product, productInCart } = props;

  const [loading, setLoading] = useState(false);

  const manageProduct = (
    type:
      | ProductCartInterface.ProductCartAdd
      | ProductCartInterface.ProductCartReduce
  ) => {
    const { product, dispatch, productSDKObj } = props;
    productSdk.manage(dispatch, productSDKObj, { type, product });
  };
  if (product && product.saleNumber <= 0) {
    return (
      <View
        className={`${prefix}-cart-right-button ${prefix}-cart-right-empty`}
      >
        售罄
      </View>
    );
  }
  return (
    <View className={`${prefix}-cart-right`}>
      {productInCart && productInCart.id > 0 && (
        <View className={`${cssPrefix}-stepper-container`}>
          <View
            className={classnames(
              `${cssPrefix}-stepper-button ${prefix}-cart-right-stepper`,
              `${cssPrefix}-stepper-button-reduce`
            )}
            onClick={() =>
              manageProduct(productSdk.productCartManageType.REDUCE)
            }
          />
          <Text
            className={`${cssPrefix}-stepper-text ${prefix}-cart-right-text`}
          >
            {productInCart.sellNum}
          </Text>
          <View
            className={classnames(
              `${cssPrefix}-stepper-button ${prefix}-cart-right-stepper`,
              `${cssPrefix}-stepper-button-add`
            )}
            onClick={() => manageProduct(productSdk.productCartManageType.ADD)}
          />
        </View>
      )}
      {!productInCart && (
        <View
          className={`${prefix}-cart-right-button`}
          onClick={() => manageProduct(productSdk.productCartManageType.ADD)}
        >
          加入购物车
        </View>
      )}
    </View>
  );
}

const select = (state: AppReducer.AppState, ownProps: Props) => {
  const { product } = ownProps;
  const productList = getProductCartList(state);
  const productInCart =
    product !== undefined && productList.find(p => p.id === product.id);
  return {
    product,
    productSDKObj: state.productSDK,
    productInCart
  };
};

export default connect(select)(ProductStepper as any);
