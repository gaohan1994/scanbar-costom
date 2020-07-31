import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.less";
import "../../../component/product/product.less";
import { ProductInterface } from "../../../constants/index";
import numeral from "numeral";
import productSdk, { ProductCartInterface } from "../../../common/sdk/product/product.sdk";
import ProductShare from "./share";
import { AppReducer } from "../../../reducers";
import classnames from "classnames";
import { getProductCartList } from "../../../common/sdk/product/product.sdk.reducer";
import { getMemberInfo } from "../../../reducers/app.user";

const cssPrefix = "component-product";
const prefix = "product-detail-component";

type Props = {
  activityList: any;
  memberInfo: any;
  product: ProductInterface.ProductInfo;
  productList: ProductCartInterface.ProductCartInfo[];
  dispatch: any;
  productSDK: any;
};

class Page extends Taro.Component<Props> {
  defaultProps = {
    product: {}
  };

  public manageProduct = (type: string) => {
    const { product, dispatch, productSDK } = this.props;
    productSdk.manage(dispatch, productSDK, { type, product });
  };

  public renderPrice = () => {
    const {
      product,
      memberInfo,
      productList
    } = this.props;
    const priceNum =
      product && product.price ? numeral(product.price).value() : 0;
    const price = numeral(priceNum).format("0.00");
    const discountPriceNum = numeral(
      productSdk.getProductItemDiscountPrice(product, memberInfo)
    ).value();
    const discountPrice = numeral(discountPriceNum).format("0.00");
    const productInCart =
    product !== undefined && productList.find(p => p.id === product.id);

    return (
      <View className={`${cssPrefix}-normal ${prefix}-detail-price`}>
        <Text className={`${cssPrefix}-price-bge`}>￥</Text>
        <Text className={`${cssPrefix}-price ${prefix}-detail-price-big`}>
          {discountPrice.split(".")[0]}
        </Text>
        <Text className={`${cssPrefix}-price-bge ${cssPrefix}-price-pos`}>{`.${
          discountPrice.split(".")[1]
          }`}</Text>
        {priceNum !== discountPriceNum && (
          <Text
            className={`${cssPrefix}-price-origin ${prefix}-detail-price-gory`}
          >
            {price}
          </Text>
        )}
        {product && product.number > 0 ? (
          <View className={`${prefix}-detail-add`}>
            {productInCart && productInCart.id > 0 && (
              <View className={`${cssPrefix}-stepper-container`}>
                <View
                  className={classnames(
                    `${cssPrefix}-stepper-button ${prefix}-cart-right-stepper`,
                    `${cssPrefix}-stepper-button-reduce`
                  )}
                  onClick={() =>
                    this.manageProduct(productSdk.productCartManageType.REDUCE)
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
                  onClick={() =>
                    this.manageProduct(productSdk.productCartManageType.ADD)
                  }
                />
              </View>
            )}
            {!productInCart && (
              <View
                className={`${prefix}-detail-add ${prefix}-detail-add-normal`}
                onClick={() =>
                  this.manageProduct(productSdk.productCartManageType.ADD)
                }
              >
                加入购物车
              </View>
            )}
          </View>
        ) : (
            <View className={`${prefix}-detail-add ${prefix}-detail-add-normal ${prefix}-detail-add-disable`}>
              {"售罄"}
            </View>
          )}
      </View>
    );
  };

  render() {
    const { product, memberInfo } = this.props;
    const activityList = product && Array.isArray(product.activityInfos) ? product.activityInfos : [];
    const singleActiveList = activityList.filter(val => val.type === 1 || val.type === 2);
    const batchActiveList = activityList.filter(val => val.type === 3 || val.type === 4);
    return (
      <View className={`${prefix}-detail`}>
        <ProductShare />
        <View className={`${prefix}-detail-box ${prefix}-detail-box-bor`}>
          <View className={`${prefix}-detail-name`}>{product.name}</View>
          <View className={`${prefix}-detail-tip`}>{product.description || product.name}</View>
          <View className={`${prefix}-detail-items`}>
            {product &&
              product.saleNumber &&
              product.saleNumber > 0 &&
              product.saleNumber <= 20 && (
                <View
                  className={`${prefix}-detail-inventory`}
                >{`仅剩${product.saleNumber}份`}</View>
              )}
          </View>

          {this.renderPrice()}
        </View>
        <View className={`${prefix}-detail-box`}>
          <View className={`${prefix}-detail-act ${prefix}-detail-act-margin`}>
            {product &&
              product.activityInfos &&
              product.activityInfos.length > 0 ? (
                <View className={`${prefix}-detail-act-title`}>活动</View>
              ) : (
                <View className={`${prefix}-detail-act-title`}>活动</View>
              )}
            {product &&
              product.activityInfos &&
              product.activityInfos.length > 0 ? (
                null
              ) : (
                <View className={`${prefix}-detail-act-box`}>
                  <View className={`${prefix}-detail-act-text`}>
                    无
                  </View>
                </View>
              )}
            <View className={`${prefix}-detail-act-boxs`}>
              {product &&
                product.activityInfos &&
                product.activityInfos.length > 0 &&
                product.activityInfos.map(item => {
                  if (item.type === 3) {

                    return (
                      <View className={`${prefix}-detail-act-box`}>
                        <View className={`${prefix}-detail-act-reduce`}>满减</View>
                        <View className={`${prefix}-detail-act-text`}>
                          {productSdk.getDiscountString(memberInfo, batchActiveList, item, 'all')}
                        </View>

                      </View>
                    );
                  }
                  return (
                    <View
                      className={`${prefix}-detail-act-box ${prefix}-detail-act-bor`}
                    >
                      <View className={`${prefix}-detail-act-discount`}>
                        {item.type === 1 ? "打折" : item.type === 2 ? "特价" : ''}
                      </View>
                      <View className={`${prefix}-detail-act-text`}>
                        {productSdk.getDiscountString(memberInfo, singleActiveList, item)}
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
          <View className={`${prefix}-detail-act`}>
            <View className={`${prefix}-detail-act-title`}>配送</View>
            <View className={`${prefix}-detail-act-text`}>商家自配</View>
          </View>
        </View>

        <View className={`${prefix}-detail-box ${prefix}-message`}>
          <View className={`${prefix}-message-title`}>商品信息</View>
          <View className={`${prefix}-message-item`}>
            <View className={`${prefix}-message-subtitle`}>规格</View>
            <View className={`${prefix}-message-text`}>
              {product.standard || "无"}
            </View>
          </View>
          <View className={`${prefix}-message-item`}>
            <View className={`${prefix}-message-subtitle`}>单位</View>
            <View className={`${prefix}-message-text`}>
              {product.unit || "件"}
            </View>
          </View>
        </View>
        <View style="width: 100%; height: 100px" />
      </View>
    );
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    productSDK: state.productSDK,
    productList: getProductCartList(state),
    memberInfo: getMemberInfo(state)
  };
};

export default connect(select)(Page as any);
