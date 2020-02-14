
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../style/product.less'
import ProductListView from '../../component/product/product.listview'
import ProductMenu from '../../component/product/product.menu'
import invariant from 'invariant'
import { ProductAction } from '../../actions'
import { ResponseCode, ProductInterface } from '../../constants'
import { LoginManager } from '../../common/sdk'
import ProductComponent from '../../component/product/product'
import Footer from './component/footer'
import { AppReducer } from '../../reducers'
import { ProductCartInterface } from '../../common/sdk/product/product.sdk'

type Props = {
  productCartList: ProductCartInterface.ProductCartInfo[]
}

class Page extends Taro.Component<Props> {

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
        <Footer/>
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