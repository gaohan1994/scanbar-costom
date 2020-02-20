
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
import { MerchantInterface, ResponseCode } from '../../constants'
import FormCard from '../../component/card/form.card'

const cssPrefix = 'order'

type Props = {
  payOrderProductList: Array<ProductCartInterface.ProductCartInfo>;
  payOrderAddress: MerchantInterface.Address;
  payOrderDetail: any;
}

type State = {
  remark: string;
}

class Page extends Taro.Component<Props, State> {

  state = { 
    remark: ''
  }

  public onSubmit = async () => {
    try {
      Taro.showLoading();
      const { payOrderAddress, payOrderProductList, payOrderDetail } = this.props;
      invariant(payOrderProductList.length > 0, '请选择要下单的商品')

      if (payOrderDetail && payOrderDetail.deliveryType === 1) {
        invariant(payOrderAddress.id, '请选择地址');
      }
      const payload = productSdk.getProductInterfacePayload(
        payOrderProductList, 
        payOrderAddress, 
        {
          ...payOrderDetail,
          delivery_time: dayJs().format('YYYY-MM-DD HH:mm:ss'),
        }
      );
      const result = await productSdk.cashierOrder(payload) 
      console.log('result', result)
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      Taro.hideLoading();
      const payment = await productSdk.requestPayment(result.data.order.orderNo)
      console.log('payment: ', payment)
      productSdk.cashierOrderCallback(result.data)
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error.message,
        icon: 'none'
      })
    }
  }

  render () {
    const { remark } = this.state;
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
        <View className={`${cssPrefix}-remark`}>
          <FormCard
            items={[{
              title: '备注',
              isInput: true,
              inputValue: remark,
              inputPlaceHolder: '请输入备注信息',
              arrow: 'right',
              hasBorder: false,
              inputOnChange: (value) => {
                this.setState({remark: value})
              },
            }]}
          />
        </View>
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
    payOrderDetail: state.productSDK.payOrderDetail,
  }
}
export default connect(select)(Page);