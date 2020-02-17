import Taro from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import productSdk from '../../../common/sdk/product/product.sdk';
import { AppReducer } from '../../../reducers'
import { ProductCartInterface } from '../../../common/sdk/product/product.sdk'
import numeral from 'numeral'
import CartFooter from '../../../component/cart/cart.footer'

interface Props {
  productCartList: ProductCartInterface.ProductCartInfo[];
}

class Footer extends Taro.Component<Props> {

  defaultProps = {
    productCartList: []
  }

  public onSubmit = () => {
    /**
     * @todo 这里要把数据传到 order.pay 不是用购物车的数据
     */
    const { productCartList } = this.props;
    productSdk.preparePayOrder(productCartList);
    Taro.navigateTo({
      url: `/pages/order/order.pay`
    })
  }

  render () {
    const { productCartList } = this.props;
    const price = productCartList && productCartList.length > 0 
      ? numeral(productSdk.getProductPrice(productCartList)).format('0.00')
      : '0.00'
    return (
      <CartFooter
        buttonTitle={`结算(${productSdk.getProductNumber(productCartList)})`}
        buttonClick={() => this.onSubmit()}
        priceTitle={'合计：'}
        priceSubtitle='￥'
        price={price}
        priceOrigin={price}
      />
    )
  }
}


const select = (state: AppReducer.AppState ) => {
  return {
    productCartList: state.productSDK.productCartList
  };
};

export default connect(select)(Footer as any);