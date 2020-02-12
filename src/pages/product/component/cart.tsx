import Taro, { clearStorage } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import '../../../component/product/product.less'
import classnames from 'classnames'
import { ProductInterface } from 'src/constants'
import { connect } from '@tarojs/redux'
import productSdk from '../../../common/sdk/product/product.sdk';
import { AppReducer } from 'src/reducers'
import { ProductCartInterface } from 'src/common/sdk/product/product.sdk'

const cssPrefix = 'component-product';
const prefix = 'product-detail-component'

interface Props { 
  product: ProductInterface.ProductInfo;
  productInCart?: ProductCartInterface.ProductCartInfo;
  sort?: ProductCartInterface.PAYLOAD_ORDER | ProductCartInterface.PAYLOAD_REFUND;
}

class Cart extends Taro.Component<Props> {

  defaultProps = {
    product: {}
  }

  public manageProduct = (type: ProductCartInterface.ProductCartAdd | ProductCartInterface.ProductCartReduce) => {
    const { product, sort } = this.props;
    productSdk.manage({type, product, sort});
  }

  public renderStepper = () => {
    const { product, productInCart  } = this.props;
    if (product && product.number === 0) {
      return (
        <View 
          className={`${prefix}-cart-right-button ${prefix}-cart-right-empty`}
        >
          售罄
        </View>
      )
    }
    return (
      <View className={`${prefix}-cart-right`}>
        {productInCart && productInCart.id && (
          <View className={`${cssPrefix}-stepper-container`}>    
            <View 
              className={classnames(`${cssPrefix}-stepper-button ${prefix}-cart-right-stepper`, `${cssPrefix}-stepper-button-reduce`)}
              onClick={() => this.manageProduct(productSdk.productCartManageType.REDUCE)}
            />
            <Text className={`${cssPrefix}-stepper-text ${prefix}-cart-right-text`}>{productInCart.sellNum}</Text>
            <View 
              className={classnames(`${cssPrefix}-stepper-button ${prefix}-cart-right-stepper`, `${cssPrefix}-stepper-button-add`)}
              onClick={() => this.manageProduct(productSdk.productCartManageType.ADD)}
            />  
          </View>
        )}
        {!productInCart && (
          <View 
            className={`${prefix}-cart-right-button`}
            onClick={() => this.manageProduct(productSdk.productCartManageType.ADD)}
          >
            加入购物车
          </View>
        )}
      </View>
    )
  }

  render () {
    return (
      <View className={`${prefix}-cart`}>
        <View className={`${prefix}-cart-box`}>
          <View className={`${prefix}-cart-left`}>
            <View className={`${prefix}-cart-left-icon`} />
            <View className={`${prefix}-cart-left-text`} >购物车</View>
          </View>
          {this.renderStepper()}
        </View>
      </View>
    )
  }
}


const select = (state: AppReducer.AppState, ownProps: Props) => {
  const { product, sort } = ownProps;
  const productKey = productSdk.getSortDataKey(sort);
  const productList = state.productSDK[productKey];
  const productInCart = product !== undefined && productList.find(p => p.id === product.id);
  return {
    product,
    productInCart,
  };
};

export default connect(select)(Cart as any);