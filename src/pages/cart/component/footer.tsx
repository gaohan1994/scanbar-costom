import Taro from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import productSdk from '../../../common/sdk/product/product.sdk';
import { AppReducer } from '../../../reducers'
import { ProductCartInterface } from '../../../common/sdk/product/product.sdk'
import numeral from 'numeral'
import CartFooter from '../../../component/cart/cart.footer'

interface Props {
  productCartList: ProductCartInterface.ProductCartInfo[];
  beforeSubmit: () => boolean;
}

class Footer extends Taro.Component<Props> {

  defaultProps = {
    productCartList: []
  }

  public onSubmit = async () => {
    /**
     * @todo 这里要把数据传到 order.pay 不是用购物车的数据
     */
    const { productCartList, beforeSubmit } = this.props;
    if (beforeSubmit) {
       const res = await beforeSubmit();
       if (res === false) {
         return;
       }
    }
    productSdk.preparePayOrder(productCartList);
    Taro.navigateTo({
      url: `/pages/order/order.pay`
    })
  }

  render () {
    const { productCartList } = this.props;
    const price = productCartList && productCartList.length > 0 
      ? numeral(productSdk.getProductPrice(productCartList)).format('0.00')
      : '0.00';
    const tarnsPrice = productCartList && productCartList.length > 0 
      ? numeral(productSdk.getProductTransPrice(productCartList)).format('0.00')
      : '0.00';
    return (
      <CartFooter
        buttonTitle={`结算(${productSdk.getProductNumber(productCartList)})`}
        buttonClick={() => this.onSubmit()}
        priceTitle={'合计：'}
        priceSubtitle='￥'
        priceDiscount={`已优惠￥ ${numeral(numeral(productSdk.getProductsOriginPrice()).value() - numeral(productSdk.getProductTransPrice()).value()).format('0.00')}`}
        price={tarnsPrice}
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