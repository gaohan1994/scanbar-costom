
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../style/product.less'
import '../style/order.less'
import ProductPayListView from '../../component/product/product.pay.listview'
import { AppReducer } from '../../reducers'
import productSdk, { ProductCartInterface } from '../../common/sdk/product/product.sdk'
import CartFooter from '../../component/cart/cart.footer'
import numeral from 'numeral'
import PickAddress from './component/address'
import invariant from 'invariant'
import dayJs from 'dayjs'
import { MerchantInterface } from '../../constants'

const cssPrefix = 'order'

type Props = {
  payOrderProductList: Array<ProductCartInterface.ProductCartInfo>;
  payOrderAddress: MerchantInterface.Address;
}
class Page extends Taro.Component<Props> {

  public onSubmit = async () => {
    try {
      const { payOrderAddress, payOrderProductList } = this.props;
      invariant(payOrderProductList.length > 0, '请选择要下单的商品')
      invariant(payOrderAddress.id, '请选择地址');

      const payload = productSdk.getProductInterfacePayload(payOrderProductList, payOrderAddress, {delivery_time: dayJs().format('YYYY-MM-DD HH:mm:ss'), deliveryType: 0});
      console.log('payload: ', payload)
      const result = await productSdk.cashierOrder(payload) 
      console.log('result', result)
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      })
    }
  }

  render () {
    const { payOrderProductList } = this.props;
    const price = payOrderProductList && payOrderProductList.length > 0 
      ? numeral(productSdk.getProductPrice(payOrderProductList)).format('0.00')
      : '0.00'
    return (
      <View className='container container-color'>
        <View className={`${cssPrefix}-bg`} />
        <PickAddress />
        <ProductPayListView
          productList={payOrderProductList}
        />

        <CartFooter
          buttonTitle={'提交订单'}
          buttonClick={() => this.onSubmit()}
          priceTitle={'合计：'}
          priceSubtitle='￥'
          price={price}
          priceOrigin={price}
        />
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    payOrderProductList: state.productSDK.payOrderProductList,
    payOrderAddress: state.productSDK.payOrderAddress,
  }
}
export default connect(select)(Page);