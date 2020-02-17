import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import '../../pages/product/component/index.less'
import '../product/product.less'

const cssPrefix = 'component-product';
const prefix = 'product-detail-component'

interface Props {
  buttonType?: string;
  buttonTitle: string;
  buttonClick: () => void;

  priceTitle: string;
  priceSubtitle: string;
  price: string;
  priceOrigin: string;
}

class Footer extends Taro.Component<Props> {

  public renderStepper = () => {
    const { buttonType, buttonTitle, buttonClick } = this.props;
    return (
      <View className={`${prefix}-cart-right`}>
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
    const { priceTitle, priceSubtitle, price, priceOrigin } = this.props;
    return (
      <View className={`${cssPrefix}-normal `}>
        <Text className={`${prefix}-price-title`}>{priceTitle}</Text>
        {priceSubtitle && (
          <Text className={`${cssPrefix}-price-bge `}>{priceSubtitle}</Text>
        )}
        {price && (
          <Text className={`${cssPrefix}-price `}>{price.split('.')[0]}</Text>
        )}
        {price && (
          <Text className={`${cssPrefix}-price-bge ${cssPrefix}-price-pos `}>{`.${price.split('.')[1]}`}</Text>
        )}
        {priceOrigin && ( 
          <Text className={`${cssPrefix}-price-origin `}>{priceOrigin}</Text>
        )}
      </View>
    )
  }

  render () {
    return (
      <View className={`${prefix}-cart`}>
        <View className={`${prefix}-cart-box`}>
          <View className={`${prefix}-cart-left`}>
            {this.renderPrice()}
          </View>
          {this.renderStepper()}
        </View>
      </View>
    )
  }
}

export default Footer