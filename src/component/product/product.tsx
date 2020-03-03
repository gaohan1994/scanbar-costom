import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './product.less';
import { ProductInterface } from '../../constants';
import { connect } from '@tarojs/redux';
import { AppReducer } from '../../reducers';
import productSdk, { ProductCartInterface } from '../../common/sdk/product/product.sdk';
import classnames from 'classnames';
import numeral from 'numeral';

const cssPrefix = 'component-product';
interface Props {
  product: ProductInterface.ProductInfo;
  direct?: boolean;
  productInCart?: ProductCartInterface.ProductCartInfo;
  sort?: ProductCartInterface.PAYLOAD_ORDER | ProductCartInterface.PAYLOAD_REFUND;
  last?: boolean;
  isHome?: boolean;
}

interface State {
  priceModal: boolean;
  changePrice: string;
  changeSellNum: string;
}

class ProductComponent extends Taro.Component<Props, State> {

  defaultProps = {
    direct: false
  }

  state = {
    priceModal: false,
    changePrice: '',
    changeSellNum: '',
  };

  public changeValue = (key: string, value: string) => {
    this.setState(prevState => {
      return {
        ...prevState,
        [key]: value
      };
    });
  }

  /**
   * @todo [新增商品点击改价]
   *
   * @memberof ProductComponent
   */
  public changePriceModal = () => {
    const { productInCart, product, sort } = this.props;
    const payloadProduct = productInCart !== undefined ? productInCart : product;
    productSdk.changeProductVisible(true, payloadProduct, sort);
  }

  public manageProduct = (type: ProductCartInterface.ProductCartAdd | ProductCartInterface.ProductCartReduce, e: any) => {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    const { product, sort } = this.props;
    productSdk.manage({ type, product, sort });
  }

  public onContentClick = () => {
    const { product } = this.props;
    Taro.navigateTo({
      url: `/pages/product/product.detail?id=${product.id}`
    })
  }

  public renderPrice = () => {
    const { product } = this.props;
    const priceNum = product && product.price ? numeral(product.price).value() : 0;
    const price = numeral(priceNum).format('0.00');
    const discountPriceNum = numeral(productSdk.getProductItemDiscountPrice(product)).value();
    const discountPrice = numeral(discountPriceNum).format('0.00');
    return (
      <View className={`${cssPrefix}-normal`}>
        <Text className={`${cssPrefix}-price-bge`}>￥</Text>
        <Text className={`${cssPrefix}-price`}>{discountPrice.split('.')[0]}</Text>
        <Text className={`${cssPrefix}-price-bge ${cssPrefix}-price-pos`}>{`.${discountPrice.split('.')[1]}`}</Text>
        {
          priceNum !== discountPriceNum && (
            <Text className={`${cssPrefix}-price-origin`}>{price}</Text>
          )
        }

      </View>
    );
  }

  render() {
    const { product, sort, last, isHome } = this.props;
    const showManageDetailToken =
      sort === productSdk.reducerInterface.PAYLOAD_SORT.PAYLOAD_PURCHASE ||
      sort === productSdk.reducerInterface.PAYLOAD_SORT.PAYLOAD_MANAGE;
    return (
      <View
        className={classnames(`${cssPrefix}-border`, {
          [`${cssPrefix} `]: !showManageDetailToken,
          [`${cssPrefix}-manage`]: showManageDetailToken,
          [`${cssPrefix}-last`]: last,
          [`${cssPrefix}-full`]: isHome !== undefined && isHome === false,
        })}
      >
        <View
          className={`${cssPrefix}-content`}
          onClick={this.onContentClick.bind(this)}
        >
          <View className={`${cssPrefix}-content-cover`} >
            {product.saleNumber <= 0 && (
              <View className={`${cssPrefix}-content-cover-empty`} >补货中</View>
            )}
            {product.pictures && product.pictures !== '' ? (
              <View
                className={`${cssPrefix}-content-cover-image`}
                style={`background-image: url(${product.pictures[0]})`}
              />
            ) : (
                <Image 
                  src="//net.huanmusic.com/scanbar-c/v1/pic_nopicture.png" 
                  className={`${cssPrefix}-content-cover-image`} 
                />
              )}
          </View>
          {this.renderDetail()}
          {this.renderStepper()}
        </View>
      </View>
    );
  }

  private renderDetail = () => {
    const { product, sort } = this.props;
    const showManageDetailToken =
      sort === productSdk.reducerInterface.PAYLOAD_SORT.PAYLOAD_PURCHASE ||
      sort === productSdk.reducerInterface.PAYLOAD_SORT.PAYLOAD_MANAGE;

    return (
      <View className={classnames(`${cssPrefix}-content-detail`)}>
        <View>
          <View className={`${cssPrefix}-title`} >
            {product.name}
          </View>
          <View className={`${cssPrefix}-tips`} >
            {product.description && product.description.length > 0 ? product.description : product.name }
          </View>
        </View>
        <View className={`${cssPrefix}-activity`}>
          {
            product && product.saleNumber && product.saleNumber > 0 && product.saleNumber <= 20 && (
              <View className={`${cssPrefix}-inventory`} >
                <Text className={`${cssPrefix}-inventory-text`}>
                  {`仅剩${product.saleNumber}份`}
                </Text>
              </View>
            )
          }
          {
            product && product.activityInfos && product.activityInfos.length && product.activityInfos.map((item) => {
              return (
                <View className={`${cssPrefix}-discount`} >
                  <Text className={`${cssPrefix}-discount-text`}>
                    {`${productSdk.getDiscountString(item)}`}
                  </Text>
                </View>
              )
            })
          }
        </View>
        {showManageDetailToken
          ? (
            <View className={classnames(`${cssPrefix}-content-detail-box`)}>
              <Text className={`${cssPrefix}-manage-font`}>进价: ￥{product.cost}</Text>
              {sort === productSdk.reducerInterface.PAYLOAD_SORT.PAYLOAD_PURCHASE
                ? (
                  <Text className={`${cssPrefix}-manage-font ${cssPrefix}-manage-font-theme`}>
                    库存: {product.saleNumber}
                  </Text>
                )
                : (
                  <Text className={`${cssPrefix}-manage-font ${cssPrefix}-manage-font-theme`}>
                    售价: ￥{product.price}
                  </Text>
                )}
            </View>
          )
          : sort === productSdk.reducerInterface.PAYLOAD_SORT.PAYLOAD_STOCK
            ? (
              <View className={classnames(`${cssPrefix}-content-detail-box`)}>
                <Text className={`${cssPrefix}-manage-font`}>进价: ￥{numeral(product.cost).format('0.00')}</Text>
                <View className={`${cssPrefix}-manage-font ${cssPrefix}-manage-font-theme`}>
                  库存：{` ${product.saleNumber || 0}${product.unit || ''}`}
                </View>
              </View>
            )
            : this.renderPrice()
        }
      </View>
    );
  }

  private renderStepper = () => {
    // direct 黑魔法code 不加这段代码 购物车页面减少时有渲染bug
    const { product, productInCart, direct } = this.props;
    if (direct === true) {
      return (
        <View className={`${cssPrefix}-stepper`}>
          {product !== undefined ? (
            <View className={`${cssPrefix}-stepper-container`}>
              <View
                className={`${cssPrefix}-stepper-touch`}
                onClick={this.manageProduct.bind(this, productSdk.productCartManageType.REDUCE)}
              >
                <View
                  className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-reduce`)}
                />
              </View>
              <Text className={`${cssPrefix}-stepper-text`}>{(product as any).sellNum}</Text>
              <View
                className={`${cssPrefix}-stepper-touch`}
                onClick={this.manageProduct.bind(this, productSdk.productCartManageType.ADD)}
              >
                <View
                  className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-add`)}
                />
              </View>

            </View>
          ) : (product as any).saleNumber <= 0 ? (
            <View className={`${cssPrefix}-stepper-empty`}>
              售罄
            </View>
          ) : (
                <View className={`${cssPrefix}-stepper-container`}>
                  <View
                    className={`${cssPrefix}-stepper-touch`}
                    onClick={this.manageProduct.bind(this, productSdk.productCartManageType.ADD)}
                  >
                    <View
                      className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-add`)}
                    />
                  </View>
                </View>
              )}
        </View>
      )

    }
    return (
      <View className={`${cssPrefix}-stepper`}>
        {productInCart !== undefined ? (
          <View className={`${cssPrefix}-stepper-container`}>
            <View
              className={`${cssPrefix}-stepper-touch`}
              onClick={this.manageProduct.bind(this, productSdk.productCartManageType.REDUCE)}
            >
              <View
                className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-reduce`)}
              />
            </View>
            <Text className={`${cssPrefix}-stepper-text`}>{productInCart.sellNum}</Text>
            <View
              className={`${cssPrefix}-stepper-touch`}
              onClick={this.manageProduct.bind(this, productSdk.productCartManageType.ADD)}
            >
              <View
                className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-add`)}
              />
            </View>
          </View>
        ) : product.saleNumber <= 0 ? (
          <View className={`${cssPrefix}-stepper-empty`}>
            售罄
          </View>
        ) : (
              <View className={`${cssPrefix}-stepper-container`}>
                <View
                  className={`${cssPrefix}-stepper-touch`}
                  onClick={this.manageProduct.bind(this, productSdk.productCartManageType.ADD)}
                >
                  <View
                    className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-add`)}
                  />
                </View>
              </View>
            )}
      </View>
    );
  }
}

const select = (state: AppReducer.AppState, ownProps: Props) => {
  const { product, sort } = ownProps;
  const productKey = productSdk.getSortDataKey(sort);
  const productList = state.productSDK[productKey];
  const productInCart = product !== undefined && productList.find(p => p.id === product.id);
  return {
    product,
    productInCart,
  };
};

export default connect(select)(ProductComponent as any);