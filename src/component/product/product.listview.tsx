import Taro from '@tarojs/taro';
import { ScrollView, View } from '@tarojs/components';
import ProductComponent from './product';
import "../../pages/style/product.less";
import { ProductInterface } from '../../constants';
import productSdk, { ProductCartInterface } from '../../common/sdk/product/product.sdk';
import { AtActivityIndicator } from 'taro-ui';
import classnames from 'classnames';
import merge from 'lodash.merge'
import Empty from '../empty';

const cssPrefix = 'product';

type Props = { 
  className?: string;
  loading?: boolean;
  title?: string;
  productList: Array<ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo>;
  isRenderFooter?: boolean;
  bottomSpector?: boolean;
  sort?: ProductCartInterface.PAYLOAD_ORDER | ProductCartInterface.PAYLOAD_REFUND;
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
    sort: productSdk.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER,
  };

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
        })
      }
    }
  }

  render () {
    const { className, loading, productList, isRenderFooter, bottomSpector, sort } = this.props;
    return (
      <ScrollView 
        scrollY={true}
        scrollIntoView={this.state.scrollIntoView}
        className={classnames(`${cssPrefix}-list-right`, className)}
      >
        {
          !loading 
          ? productList && productList.length > 0
            ? productList.map((product) => {
              return (
                <View    
                  id={`product${product.id}`}
                  key={product.id}
                >
                  <ProductComponent
                    product={product}
                    sort={sort}
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
              <AtActivityIndicator mode='center' />
            </View>
          )
        }
        {isRenderFooter && productList && productList.length > 0 && (
          <View className={`${cssPrefix}-list-bottom`}>已经到底啦</View>
        )}
        {bottomSpector && (
          <View style="height: 100px" />
        )}
      </ScrollView>  
    );
  }
}

export default ProductListView