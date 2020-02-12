
import Taro from '@tarojs/taro'
import { View  } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import '../style/product.less'

import invariant from 'invariant'
import { ProductAction } from '../../actions'

import ProductSwiper from './component/swiper';
import ProductDetail from './component/detail';
import ProductCart from './component/cart';
import { AppReducer } from 'src/reducers'

const cssPrefix = 'product';

class Page extends Taro.Component<any> {

  defaultProps = {
    productDetail: {}
  }

  componentWillMount () {
    try {
      const { id } = this.$router.params;
      invariant(!!id, '请传入商品id')

      this.init(Number(id));
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      }) 
    }
  }

  public init = async (id: number) => {
    ProductAction.productInfoDetail({id});
  }

  render () {
    const { productDetail } = this.props;
    const { id } = this.$router.params;
    return (
      <View className='container'>
        <ProductSwiper 
          images={productDetail.pictures || []}
        />
        <ProductDetail
          product={productDetail}
        />
        {productDetail && productDetail.id && `${productDetail.id}` === id && (
          <ProductCart 
            product={productDetail}
          />
        )}
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    productDetail: state.product.productDetail,
    productList: state.productSDK.productCartList
  }
}

export default connect(select)(Page);
