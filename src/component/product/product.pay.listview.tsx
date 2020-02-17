import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import productSdk, { ProductCartInterface } from '../../common/sdk/product/product.sdk';
import "../card/form.card.less";
import "../../pages/style/product.less";
import '../../styles/theme.less';
import "../cart/cart.less";
import classnames from 'classnames';
import numeral from 'numeral';
import { SelectMember } from '../../pages/product/product.pay';
import { isInventoryProduct } from '../../constants/inventory/inventory';

const cssPrefix = 'product';

type Props = { 
  productList: Array<ProductCartInterface.ProductCartInfo>;
  selectMember?: SelectMember;
  className?: string;
  padding?: boolean;
  sort?: string;
};

class ProductPayListView extends Taro.Component<Props> {

  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    padding: true,
    sort: productSdk.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER
  };

  render () {
    const { productList, className, padding, sort } = this.props;
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
            productList && productList.length > 0 && productList.map((item, index) => {
              return (
                <View
                  key={item.id}
                  className={classnames(`${cssPrefix}-row ${cssPrefix}-row-content`, {
                    // [`container-border`]: index !== (productList.length - 1)
                  })}
                >
                  <View className={`${cssPrefix}-row-box`}>
                    <View
                      className={`${cssPrefix}-row-cover`}
                      style={`background-image: url(${item.pictures[0]})`}
                    />
                    <View className={`${cssPrefix}-row-content ${cssPrefix}-row-content-box`}>
                      <Text className={`${cssPrefix}-row-name`}>{item.name}</Text>
                      <Text className={`${cssPrefix}-row-normal`}>{`x ${item.sellNum}`}</Text>
                      <View className={`${cssPrefix}-row-corner`}>
                        <Text className={`${cssPrefix}-row-corner-price`}>{`￥${item.price}`}</Text>
                        <Text className={`${cssPrefix}-row-corner-origin`}>{`￥${item.price}`}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          }
          {this.renderTotal()}
        </View>
      </View>
    );
  }

  private renderTotal = () => {
    return (
      <View className={`${cssPrefix}-row-totals`}>
        <View className={`${cssPrefix}-row-content-item`}>
          <View></View>
          <View>合计：{numeral(productSdk.getProductTransPrice()).format('0.00')}</View>
        </View>
      </View>
    )
  }
}

export default ProductPayListView;