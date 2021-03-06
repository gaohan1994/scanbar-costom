import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.less";
import "../../../component/product/product.less";
import { ProductInterface } from "../../../constants/index";
import numeral from "numeral";
import productSdk from "../../../common/sdk/product/product.sdk";
import ProductShare from "./share";

const cssPrefix = "component-product";
const prefix = "product-detail-component";

type Props = {
  activityList: any;
  memberInfo: any;
  product: ProductInterface.ProductInfo;
};

class Page extends Taro.Component<Props> {
  defaultProps = {
    product: {}
  };

  public renderPrice = () => {
    const { product, memberInfo } = this.props;
    const priceNum =
      product && product.price ? numeral(product.price).value() : 0;
    const price = numeral(priceNum).format("0.00");
    const discountPriceNum = numeral(
      productSdk.getProductItemDiscountPrice(product, memberInfo)
    ).value();
    const discountPrice = numeral(discountPriceNum).format("0.00");
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
        <ProductShare />
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
    
        <View className={`${prefix}-detail-box ${prefix}-detail-box-bor`}>
          <View className={`${prefix}-detail-name`}>{product.name}</View>
          <View className={`${prefix}-detail-tip`}>{product.name}</View>
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
        <View className={`${prefix}-detail-box ${prefix}-detail-act`}>
          {product &&
          product.activityInfos &&
          product.activityInfos.length > 0 ? (
            <View className={`${prefix}-detail-act-title`}>活动</View>
          ) : (
            <View className={`${prefix}-detail-act-title`}>活动<Text className={`${prefix}-detail-act-title-txt`}>无</Text></View>
          )}
          <View className={`${prefix}-detail-act-boxs`}>
            {product &&
              product.activityInfos &&
              product.activityInfos.length > 0 &&
              product.activityInfos.map(item => {
                if(item.type === 3) {

                  return (
                    <View className={`${prefix}-detail-act-box`}>
                      <View className={`${prefix}-detail-act-reduce`}>满减</View>
                      <View className={`${prefix}-detail-act-text`}>
                        {productSdk.getDiscountString(memberInfo,batchActiveList, item, 'all')}
                      </View>
                      
                    </View> 
                  );
                }
                return (
                  <View
                    className={`${prefix}-detail-act-box ${prefix}-detail-act-bor`}
                  >
                    <View className={`${prefix}-detail-act-discount`}>
                      {item.type === 1 ? "打折" :item.type === 2? "特价":''}
                    </View>
                    <View className={`${prefix}-detail-act-text`}>
                      {productSdk.getDiscountString(memberInfo,singleActiveList, item)}
                    </View>
                  </View>
                );
              })}
            {/* <View className={`${prefix}-detail-act-box`}>
              <View className={`${prefix}-detail-act-reduce`}>满减</View>
              <View className={`${prefix}-detail-act-text`}>满100减20，满200减45</View>
            </View> */}
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

export default Page;
