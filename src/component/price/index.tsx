import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import '../product/product.less'

const cssPrefix = 'component-product';

type Props = {
  price: string;
  priceColor?: string;
  priceOrigin?: string;
  preText?: string;
}

class Price extends Taro.Component<Props> {
  render () {
    const { price = '', preText, priceOrigin, priceColor } = this.props;
    return (
      <View className={`${cssPrefix}-normal`}>
        {preText && (
          <Text className={`${cssPrefix}-price-pre`}>{preText}</Text>
        )}
        <Text style={`${!!priceColor ? `color: ${priceColor}` : ''}`} className={`${cssPrefix}-price-bge`}>￥</Text>
        <Text style={`${!!priceColor ? `color: ${priceColor}` : ''}`} className={`${cssPrefix}-price`}>{price.split('.')[0]}</Text>
        <Text style={`${!!priceColor ? `color: ${priceColor}` : ''}`} className={`${cssPrefix}-price-bge ${cssPrefix}-price-pos`}>{`.${price.split('.')[1]}`}</Text>
        {priceOrigin && (
           <Text className={`${cssPrefix}-price-origin`}>{priceOrigin}</Text>
        )}
      </View>
    );
  }
}

export default Price