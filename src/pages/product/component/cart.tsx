import Taro, { clearStorage } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import '../../../component/product/product.less'
import classnames from 'classnames'
import { ProductInterface } from '../../../constants'
import { connect } from '@tarojs/redux'
import productSdk from '../../../common/sdk/product/product.sdk';
import { AppReducer } from '../../../reducers'
import { ProductCartInterface } from '../../../common/sdk/product/product.sdk'

const cssPrefix = 'component-product';
const prefix = 'product-detail-component'

interface Props { 
  product: ProductInterface.ProductInfo;
  productInCart?: ProductCartInterface.ProductCartInfo;
}

class Cart extends Taro.Component<Props> {

  defaultProps = {
    product: {}
  }

  public manageProduct = (type: ProductCartInterface.ProductCartAdd | ProductCartInterface.ProductCartReduce) => {
    const { product } = this.props;
    productSdk.manage({type, product });
  }

  public renderStepper = () => {
    const { product, productInCart  } = this.props;
    if (product && product.saleNumber <= 0) {
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
          <View className={`${prefix}-cart-left ${prefix}-cart-left-detail`}>
            <View 
              className={`${prefix}-cart-left-icon`} 
              onClick={() => {
                Taro.switchTab({
                  url: `/pages/cart/cart`
                })
              }}
            />
            <View className={`${prefix}-cart-left-text`} >购物车</View>
          </View>
          {this.renderStepper()}
        </View>
      </View>
    )
  }
}


const select = (state: AppReducer.AppState, ownProps: Props) => {
  const { product } = ownProps;
  const productList = state.productSDK.productCartList;
  const productInCart = product !== undefined && productList.find(p => p.id === product.id);
  return {
    product,
    productInCart,
  };
};

export default connect(select)(Cart as any);