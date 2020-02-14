import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import '../../product/component/index.less'
import '../../../component/product/product.less'
import classnames from 'classnames'
import { ProductInterface } from '../../../constants'
import { connect } from '@tarojs/redux'
import productSdk from '../../../common/sdk/product/product.sdk';
import { AppReducer } from '../../../reducers'
import { ProductCartInterface } from '../../../common/sdk/product/product.sdk'
import numeral from 'numeral'

const cssPrefix = 'component-product';
const prefix = 'product-detail-component'

interface Props {
  productCartList: ProductCartInterface.ProductCartInfo[];
}

class Footer extends Taro.Component<Props> {

  defaultProps = {
    productCartList: []
  }

  public renderStepper = () => {
    const { productCartList } = this.props;
    return (
      <View className={`${prefix}-cart-right`}>
        <View 
          className={`${prefix}-cart-right-button ${prefix}-cart-right-button-pay`}
        >
          {`结算(${productSdk.getProductNumber(productCartList)})`}
        </View>
      </View>
    )
  }

  public renderPrice = () => {
    const { productCartList } = this.props;
    const price = productCartList && productCartList.length > 0 
      ? numeral(productSdk.getProductPrice(productCartList)).format('0.00')
      : '0.00'
    return (
      <View className={`${cssPrefix}-normal `}>
        <Text className={`${prefix}-price-title`}>合计：</Text>
        <Text className={`${cssPrefix}-price-bge `}>￥</Text>
        <Text className={`${cssPrefix}-price `}>{price.split('.')[0]}</Text>
        <Text className={`${cssPrefix}-price-bge ${cssPrefix}-price-pos `}>{`.${price.split('.')[1]}`}</Text>
        <Text className={`${cssPrefix}-price-origin `}>{price}</Text>
      </View>
    )
  }

  render () {
    return (
      <View className={`${prefix}-cart`}>
        <View className={`${prefix}-cart-box`}>
          <View className={`${prefix}-cart-left`}>
            {this.renderPrice()}
          </View>
          {this.renderStepper()}
        </View>
      </View>
    )
  }
}


const select = (state: AppReducer.AppState, ownProps: Props) => {
  return {
    productCartList: state.productSDK.productCartList
  };
};

export default connect(select)(Footer as any);