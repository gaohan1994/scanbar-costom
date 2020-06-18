import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import '../../pages/product/component/index.less'
import '../product/product.less'
import "./index.less"
import numeral from 'numeral';
import classnames from 'classnames';
import productSdk from '../../common/sdk/product/product.sdk';
import { Dispatch } from 'redux';

const cssPrefix = 'component-product';
const prefix = 'product-detail-component'

interface Props {
  buttonType?: string;
  dispatch: Dispatch;
  buttonTitle: string;
  isCart?: boolean;
  selectedIndex?: any;
  buttonClick: () => void;
  priceDiscountPay?: number;
  style?: any;
  priceTitle: string;
  productCartList: any;
  priceSubtitle: string;
  price: string;
  priceOrigin: string;
  priceDiscount?: string;
}

class Footer extends Taro.Component<Props> {

  public renderStepper = () => {
    const { buttonType, buttonTitle, buttonClick } = this.props;
    return (
      <View className={`${prefix}-cart-right`} >
        <View
          className={`${prefix}-cart-right-button ${prefix}-cart-right-button-pay`}
          onClick={() => buttonClick()}
        >
          {buttonTitle}
        </View>
      </View>
    )
  }

  public renderPrice = () => {
    const { priceTitle, priceSubtitle, price, priceOrigin, priceDiscount, priceDiscountPay, isCart } = this.props;

    return (
      <View className={isCart === true ? `${prefix}-cart-rightPrice` :  `${prefix}-cart-rightPrice-pay`}>
        <View className={`${cssPrefix}-normal ${process.env.TARO_ENV === 'h5' ? `${cssPrefix}-normal-h5` : ''} component-cart-text`} style={process.env.TARO_ENV === 'h5' && !priceDiscountPay ? {lineHeight: 'inherit'} : {height: 'auto'}}>
          {/* <Text className={`${cssPrefix}-price-title`}>{priceTitle}</Text> */}
          {/* {
            priceDiscountPay ? (<Text className={`${cssPrefix}-price-gray `}>已优惠{numeral(priceDiscountPay).format('0.00')}</Text>) : null
          }
          
          {
            priceDiscountPay ? (<Text className={`${cssPrefix}-price-grayT `}>合计：</Text>) : null
          } */}
          {priceSubtitle && (
            <Text className={`${cssPrefix}-price-bge `}>{priceSubtitle}</Text>
          )}
          {price && (
            <Text className={`${cssPrefix}-price component-cart-text-price`}>{price.split('.')[0]}</Text>
          )}
          {price && (
            <Text className={`${cssPrefix}-price-bge ${cssPrefix}-price-pos `}>{`.${price.split('.')[1]}`}</Text>
          )}
          {/* {priceOrigin && ( 
          <Text className={`${cssPrefix}-price-origin `}>{priceOrigin}</Text>
          )} */}

        </View>
        {
          priceDiscount && (
            <Text className={`${cssPrefix}-price-discount `}>{priceDiscount}</Text>
          )
        }
          {
            priceDiscountPay ? (<Text className={`${cssPrefix}-price-gray `}>已优惠{numeral(priceDiscountPay).format('0.00')}</Text>) : null
          }
      </View>

    )
  }

  render() {
    let token = false;
    if(this.props.productCartList && this.props.selectedIndex){
      if(this.props.productCartList.length === this.props.selectedIndex.length){
        token = true;
      }
    }
    return (
      <View className={`${prefix}-cart`} style={this.props.style}>
        <View className={`${prefix}-cart-box`}>
          {
            this.props.isCart === true ? (
              <View className={`${prefix}-cart-left`}
                
              >
                <View 
                    className={classnames(`${cssPrefix}-select-item`, {
                        [`${cssPrefix}-select-normal`]: !token, 
                        [`${cssPrefix}-select-active`]: !!token,
                        [`${prefix}-cart-left-item`]: true,
                    })}
                    onClick={() => {
                      productSdk.selectProduct(this.props.dispatch, !token ? 'all' : 'empty', this.props.productCartList as any);
                    }}
                />
                <View className={`${prefix}-cart-left-item-txt`}>
                  <span>全选</span>
                  <View 
                    onClick={(e) => {
                      e.stopPropagation();
                      Taro.showModal({
                        title: '提示',
                        content: '确认删除所勾选的商品么？',
                        success: async (confirm) => {
                          if (confirm.confirm) {
                            let list: any = [];
                            this.props.selectedIndex.map(element => {
                              const filter = this.props.productCartList.filter(val => val.id === element);
                              list = [
                                ...list,
                                ...filter,
                              ];
                            });
         
                            productSdk.deleteGroup(this.props.dispatch, list)
                            Taro.showToast({
                              title: '删除成功',
                            });
                          }
                        }
                      })
                    }} 
                    className={`${prefix}-cart-left-item-txt-delete`} 
                  >删除</View>
                </View>
              </View>
            ) : null
          }
         

          {this.renderStepper()}
          {this.renderPrice()}
        </View>
      </View>
    )
  }
}

export default Footer