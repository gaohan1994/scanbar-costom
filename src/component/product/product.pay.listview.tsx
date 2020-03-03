import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import productSdk, { ProductCartInterface } from '../../common/sdk/product/product.sdk';
import "../card/form.card.less";
import "../../pages/style/product.less";
import '../../styles/theme.less';
import "../cart/cart.less";
import classnames from 'classnames';
import numeral from 'numeral';
import { AppReducer } from '../../reducers';
import { connect } from '@tarojs/redux';

const cssPrefix = 'product';

type Props = {
  productList: Array<ProductCartInterface.ProductCartInfo>;
  selectMember?: any;
  className?: string;
  padding?: boolean;
  sort?: string;
  payOrderDetail: any;
};

class ProductPayListView extends Taro.Component<Props> {

  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    padding: true,
    sort: productSdk.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER,
    payOrderDetail: {} as any,
  };

  render() {
    const { productList, className, padding, sort, payOrderDetail } = this.props;
    return (
      <View
        className={classnames(className, {
          [`${cssPrefix}-pay-pos`]: padding
        })}
      >
        <View
          className={classnames('component-form', {
            'component-form-shadow': true,
            [`${cssPrefix}-row-items`]: true
          })}
        >
          {
            productList && productList.length > 0 && productList.map((item) => {
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
                      <Text className={`${cssPrefix}-row-name`}>{item.name}</Text>
                      <Text className={`${cssPrefix}-row-normal`}>{`x ${item.sellNum}`}</Text>
                      <View className={`${cssPrefix}-row-corner`}>
                        <View>
                          <Text className={`${cssPrefix}-row-corner-price`}>￥</Text>
                          <Text className={`${cssPrefix}-row-corner-big`}>{numeral(productSdk.getProductItemPrice(item)).format('0.00').split('.')[0]}</Text>
                          <Text className={`${cssPrefix}-row-corner-price`}>{`.${numeral(productSdk.getProductItemPrice(item)).format('0.00').split('.')[1]}`}</Text>
                        </View>
                        {/* <Text className={`${cssPrefix}-row-corner-price`}>{`￥${numeral(productSdk.getProductItemPrice(item)).format('0.00')}`}</Text> */}
                        {
                          item.price !== productSdk.getProductItemPrice(item) && (
                            <Text className={`${cssPrefix}-row-corner-origin`}>{`￥${item.price}`}</Text>
                          )
                        }
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          }
          {
            payOrderDetail.deliveryType === 1 && (
              <View className={`${cssPrefix}-row-totals`}>
                <View className={`${cssPrefix}-row-content-item`}>
                  <Text className={`${cssPrefix}-row-voucher`}>配送费</Text>
                  <View>
                    <Text
                      className={
                        `${cssPrefix}-row-content-price ${cssPrefix}-row-content-price-black`
                      }
                    >
                      ￥{numeral(3.5).format('0.00')}
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

          {this.renderTotal()}
        </View>
      </View>
    );
  }

  private renderTotal = () => {
    const { payOrderDetail } = this.props;
    const price = numeral(productSdk.getProductTransPrice() + (payOrderDetail.deliveryType === 1 ? 3.5 : 0)).format('0.00');
    const discountPrice = numeral(numeral(productSdk.getProductsOriginPrice()).value() - numeral(productSdk.getProductTransPrice()).value()).format('0.00');
    return (
      <View className={`${cssPrefix}-row-totals`}>
        <View className={`${cssPrefix}-row-content-item`}>
          <View />
          {/* <Price
            preText={`已优惠￥ ${numeral(numeral(productSdk.getProductsOriginPrice()).value() - numeral(productSdk.getProductTransPrice()).value()).format('0.00')}  合计：`}
            priceColor='#333333'
            price={numeral(productSdk.getProductTransPrice() + 3.5).format('0.00')}
          /> */}
          <View className={`${cssPrefix}-row-tran`}>
            <Text className={`${cssPrefix}-row-tran`}>{`已优惠￥ ${discountPrice}`}</Text>
            <Text className={`${cssPrefix}-row-tran ${cssPrefix}-row-tran-margin`}>{`合计：`}</Text>
            <Text className={`${cssPrefix}-row-tran-price`}>￥</Text>
            <Text className={`${cssPrefix}-row-tran-price ${cssPrefix}-row-tran-big `}>{price.split('.')[0]}</Text>
            <Text className={`${cssPrefix}-row-tran-price`}>{`.${price.split('.')[1]}`}</Text>
          </View>
        </View>
      </View>
    )
  }
}


const select = (state: AppReducer.AppState) => {
  return {
    payOrderDetail: state.productSDK.payOrderDetail,
  }
}
export default connect(select)(ProductPayListView);