import Taro from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import productSdk from '../../../common/sdk/product/product.sdk';
import { AppReducer } from '../../../reducers'
import { ProductCartInterface } from '../../../common/sdk/product/product.sdk'
import numeral from 'numeral'
import CartFooter from '../../../component/cart/cart.footer'
import { Dispatch } from 'redux';
import { getMemberInfo } from '../../../reducers/app.user';

interface Props {
  dispatch: Dispatch;
  activityList: any;
  selectedIndex?: any;
  isCart?: boolean;
  style?: any;
  memberInfo: any;
  productCartList: ProductCartInterface.ProductCartInfo[];
  beforeSubmit: () => boolean;
  productCartSelectedIndex: number[];
}

class Footer extends Taro.Component<Props> {

  defaultProps = {
    productCartList: []
  }

  public onSubmit = async () => {
    /**
     * @todo 这里要把数据传到 order.pay 不是用购物车的数据
     * 
     * @time 0414
     * @todo [新增选择部分商品下单]
     */
    const { productCartList, beforeSubmit, productCartSelectedIndex, dispatch } = this.props;
    if (beforeSubmit) {
      const res = await beforeSubmit();
      if (res === false) {
        return;
      }
    }

    const selectProductList = productCartList.filter((product) => {
      return productCartSelectedIndex.some((id) => id === product.id);
    });
    productSdk.preparePayOrder(dispatch, productCartList, selectProductList);
    productSdk.preparePayOrderDetail({ selectedCoupon: {} }, dispatch);
    Taro.navigateTo({
      url: `/pages/order/order.pay`
    })
  }

  render () {
    const { activityList, memberInfo, selectedIndex, isCart, productCartList, productCartSelectedIndex, dispatch } = this.props;

    const selectProductList = productCartList.filter((product) => {
      return productCartSelectedIndex.some((id) => id === product.id);
    })

    const price = selectProductList && selectProductList.length > 0 
      ? numeral(productSdk.getProductTransPrice(activityList, memberInfo, productCartList,selectProductList)).format('0.00')
      : '0.00';
    const tarnsPrice = selectProductList && selectProductList.length > 0 
      ? numeral(productSdk.getProductTransPrice(activityList, memberInfo, productCartList,selectProductList)).format('0.00')
      : '0.00';
    return (
      <CartFooter
        selectedIndex={selectedIndex}
        isCart={isCart}
        dispatch={dispatch}
        productCartList={productCartList}
        buttonTitle={`结算(${productSdk.getProductNumber(selectProductList)})`}
        buttonClick={() => this.onSubmit()}
        priceTitle={'合计：'}
        priceSubtitle='￥'
        priceDiscount={`已优惠￥ ${numeral(
          numeral(productSdk.getProductsOriginPrice(productCartList, selectProductList)).value() - 
          numeral(productSdk.getProductTransPrice(activityList, memberInfo, productCartList,selectProductList)).value()
        ).format('0.00')}`}
        price={tarnsPrice}
        priceOrigin={price}
        style={this.props.style}
      />
    )
  }
}


const select = (state: AppReducer.AppState ) => {
  return {
    productCartList: state.productSDK.productCartList,
    productCartSelectedIndex: state.productSDK.productCartSelectedIndex,
    activityList: state.merchant.activityList,
    memberInfo: getMemberInfo(state)
  };
};

export default connect(select)(Footer as any);