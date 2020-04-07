import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './product.less';
import { ProductInterface } from '../../constants';
import { connect } from '@tarojs/redux';
import { AppReducer } from '../../reducers';
import { ProductCartInterface } from '../../common/sdk/product/product.sdk';

const cssPrefix = 'component-product';
interface Props { 
  product: ProductInterface.ProductInfo;
  productInCart?: ProductCartInterface.ProductCartInfo;
}

class ProductManageComponent extends Taro.Component<Props> {

  public onProductClick = () => {
    const { product } = this.props;
    Taro.navigateTo({
      url: `/pages/product/product.detail?id=${product.id}`
    });
  }

  render () {
    const { product } = this.props;
    return (
      <View 
        className={`${cssPrefix}-manage ${cssPrefix}-border`}
        onClick={() => this.onProductClick()}
      >
        <View className={`${cssPrefix}-content`}>
          <View className={`${cssPrefix}-content-cover`}>
            {product.pictures && product.pictures.length > 0 ? (
              <Image src={product.pictures[0]} className={`${cssPrefix}-content-cover-image`} />
            ) : (
              <Image src="//net.huanmusic.com/weapp/img_nolist.png" className={`${cssPrefix}-content-cover-image`} />
            )}
          </View>
          <View className={`${cssPrefix}-content-detail`}>
            <Text className={`${cssPrefix}-title ${cssPrefix}-title-manage`}>{product.name}</Text>
            <View className={`${cssPrefix}-manage-detail`}>
              <Text className={`${cssPrefix}-manage-font`}>进价: ￥{product.cost}</Text>
              <Text className={`${cssPrefix}-manage-font ${cssPrefix}-manage-font-theme`}>
                售价: ￥{product.price}
              </Text>
            </View>
          </View>

          {this.renderCorner()}
        </View>
      </View>
    );
  }

  private renderCorner = () => {
    const { product } = this.props;

    return (
      <View className={`${cssPrefix}-manage-corner`}>
        <Text className={`${cssPrefix}-manage-font`}>库存: {product.saleNumber}{product.unit}</Text>
      </View>
    );
  }
}

const select = (state: AppReducer.AppState, ownProps: Props) => {
  const { product } = ownProps;
  const productList = state.productSDK.productCartList;
  const productInCart = product !== undefined && productList.find(p => p.id === product.id);
  return {
    product,
    productInCart,
  };
};

export default connect(select)(ProductManageComponent as any);