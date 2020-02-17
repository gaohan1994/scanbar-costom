
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../style/product.less'
import ProductComponent from '../../component/product/product'
import Footer from './component/footer'
import { AppReducer } from '../../reducers'
import productSdk, { ProductCartInterface } from '../../common/sdk/product/product.sdk'

type Props = {
  productCartList: ProductCartInterface.ProductCartInfo[]
}

class Page extends Taro.Component<Props> {

  componentDidShow () {
    const { productCartList } = this.props;
    const total = productSdk.getProductNumber(productCartList);
    if (total !== 0) {
      Taro.setTabBarBadge({
        index: 2,
        text: `${total}`
      });
    }
  }

  render () {
    const { productCartList } = this.props;
    return (
      <View className='container'>
        {productCartList.map((item) => {
          console.log('product ouside', item)
          return (
            <ProductComponent
              direct={true}
              key={item.id}
              product={item}
            /> 
          )
        })}
        <Footer />
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    productCartList: state.productSDK.productCartList
  }
}
export default connect(select)(Page);