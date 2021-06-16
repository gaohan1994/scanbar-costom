/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-03-04 09:02:08 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-10 15:32:33
 * 
 * @todo 商品列表
 */
import Taro from '@tarojs/taro';
import { ScrollView, View, Image } from '@tarojs/components';
import ProductComponent from './product';
import "../../pages/style/product.less";
import { ProductInterface } from '../../constants';
import { ProductCartInterface } from '../../common/sdk/product/product.sdk';
// import { AtActivityIndicator } from 'taro-ui';
import classnames from 'classnames';
import loading1 from '../../assets/loading2.png'
import merge from 'lodash.merge'
import Empty from '../empty';
import {  CommonEventFunction } from '@tarojs/components/types/common';

const cssPrefix = 'product';

type Props = { 
  className?: string;
  loading?: boolean;
  ismenu?: boolean;
  title?: string;
  productList: Array<ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo>;
  isRenderFooter?: boolean;
  bottomSpector?: boolean;
  productListTotal?: number;
  productCartList?: any;
  onScrollToLower?: (e: any) => any;
  isHome?: boolean;
  onScroll?: (e: any) => any;
};

class ProductListView extends Taro.Component<Props> {

  state = {
    scrollIntoView: ''
  }

  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    title: undefined,
    loading: false,
    productList: [],
    isRenderFooter: true,
    bottomSpector: true,
  };

  public onScroll = (event: CommonEventFunction) => {
    // const { detail } = event;
    // console.log('detail: ', detail);
  }

  /**
   * @todo [切换类别滑动到顶端code]
   * @param nextProps 
   */
  componentWillReceiveProps (nextProps: Props) {
    const nextList: any = merge([], nextProps.productList);
    const currentList: any = merge([], this.props.productList);
    if (nextList.length > 0 && currentList.length > 0) { 
      if (nextList.length !== currentList.length || nextList !== currentList) {
        this.setState({
          scrollIntoView: `product${nextList[0].id}`
        });
      }
    }
  }
  
  render () {
    const { className,productCartList, productListTotal, ismenu,onScrollToLower, loading, productList, isRenderFooter, bottomSpector, isHome, onScroll } = this.props;
    return (
      <ScrollView 
        scrollY={true}
        scrollIntoView={this.state.scrollIntoView}
        className={classnames(`${cssPrefix}-list-right ${ process.env.TARO_ENV === 'h5' ? `${cssPrefix}&-h5-height` : ''}`, className)}
        onScroll={onScroll}
        onScrollToLower={productListTotal && productList && productListTotal === productList.length ? ()=>{} : onScrollToLower}
      >
        {
          !loading || productList && productList.length > 0
          ? productList && productList.length > 0
            ? productList.map((product) => {
              const productInCart = product !== undefined && productCartList.find(p => p.id === product.id);
              return (
                <View    
                  id={`product${product.id}`}
                  key={product.id}
                >
                  <ProductComponent
                    product={product}
                    isHome={isHome}
                    ismenu={ismenu}
                    productInCart={productInCart}
                  /> 
                </View>
              );
            })
            : (
              <Empty 
                img={'//net.huanmusic.com/scanbar-c/v1/img_commodity.png'}
                css='index'
                text={'还没有商品'}
              />
            )
          : (
            <View className="container">
              {/* <AtActivityIndicator mode='center' /> */}
              <Image className='container-Loading' src={'//net.huanmusic.com/weapp/loading.gif'}/>
            </View>
          )
        }
        {isRenderFooter && productListTotal && productList && productListTotal === productList.length ? (
          <View className={`${cssPrefix}-list-bottom ${process.env.TARO_ENV === 'h5' ? `${cssPrefix}-list-bottom-h5`: ''}`}>已经到底啦</View> 
        ) : null}
        {isRenderFooter && loading && productList && productList.length > 0 ? (
          <View className={`${cssPrefix}-list-bottom ${process.env.TARO_ENV === 'h5' ? `${cssPrefix}-list-bottom-h5`: ''}`}>
            <Image className={`${cssPrefix}-loading-img`} src={loading1}></Image>
          </View>
        ): null}
        {bottomSpector && (
          <View style="height: 100px" />
        )}
      </ScrollView>  
    );
  }
}

export default ProductListView