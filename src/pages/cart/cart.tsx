
import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../style/product.less'
import ProductComponent from '../../component/product/product'
import Footer from './component/footer'
import { AppReducer } from '../../reducers'
import productSdk, { ProductCartInterface } from '../../common/sdk/product/product.sdk'
import Empty from '../../component/empty'

type Props = {
  productCartList: ProductCartInterface.ProductCartInfo[]
}

class Page extends Taro.Component<Props> {
  config: Config = {
    navigationBarTitleText: '购物车'
  }

  componentDidShow () {
    productSdk.refreshCartNumber();
  }

  render () {
    const { productCartList } = this.props;
    return (
      <View className='container'>
        {productCartList && productCartList.length > 0 
        ? productCartList.map((item) => {
          return (
            <ProductComponent
              direct={true}
              key={item.id}
              product={item}
            /> 
          )
        })
        : (
          <Empty
            img='//net.huanmusic.com/scanbar-c/v1/img_cart.png'
            text='还没有商品，快去选购吧'
            button={{
              title: '去选购',
              onClick: () => {
                Taro.switchTab({
                  url: `/pages/index/index`
                })
              }
            }}
          />
        )}
        {productCartList && productCartList.length > 0 && (
          <Footer />
        )}
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