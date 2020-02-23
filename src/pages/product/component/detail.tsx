import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import '../../../component/product/product.less'
import { ProductInterface } from '../../../constants/index'
import numeral from 'numeral'

const cssPrefix = 'component-product';
const prefix = 'product-detail-component'

type Props = {
  product: ProductInterface.ProductInfo;
}

class Page extends Taro.Component<Props> {

  defaultProps = {
    product: {}
  }

  public renderPrice = () => {
    const { product } = this.props;
    const price = product && product.price ? numeral(product.price).format('0.00') : '0.00';
    return (
      <View className={`${cssPrefix}-normal ${prefix}-detail-price`}>
        <Text className={`${cssPrefix}-price-bge`}>￥</Text>
        <Text className={`${cssPrefix}-price ${prefix}-detail-price-big`}>{price.split('.')[0]}</Text>
        <Text className={`${cssPrefix}-price-bge ${cssPrefix}-price-pos`}>{`.${price.split('.')[1]}`}</Text>
        <Text className={`${cssPrefix}-price-origin ${prefix}-detail-price-gory`}>{price}</Text>
      </View>
    )
  }

  render () {
    const { product } = this.props;
    return (
      <View className={`${prefix}-detail`}>
        <View className={`${prefix}-detail-box ${prefix}-detail-box-bor`}>
          <View className={`${prefix}-detail-name`}>{product.name}</View>
          <View className={`${prefix}-detail-tip`}>{product.name}</View>
          <View className={`${prefix}-detail-items`}>
            <View className={`${prefix}-detail-inventory`}>{`仅剩${product.number}份`}</View>
          </View>
         
          {this.renderPrice()}
        </View>
        <View className={`${prefix}-detail-box ${prefix}-detail-act`}>
          <View className={`${prefix}-detail-act-title`}>活动</View>
          <View className={`${prefix}-detail-act-boxs`}>
            <View className={`${prefix}-detail-act-box ${prefix}-detail-act-bor`}>
              <View className={`${prefix}-detail-act-discount`}>活动</View>
              <View className={`${prefix}-detail-act-text`}>7折 限1份</View>
            </View>
            <View className={`${prefix}-detail-act-box`}>
              <View className={`${prefix}-detail-act-reduce`}>满减</View>
              <View className={`${prefix}-detail-act-text`}>满100减20，满200减45</View>
            </View>
          </View>
        </View>

        <View className={`${prefix}-detail-box ${prefix}-message`}>
          <View className={`${prefix}-message-title`}>商品信息</View>
          <View className={`${prefix}-message-item`}>
            <View className={`${prefix}-message-subtitle`}>规格</View>
            <View className={`${prefix}-message-text`}>2.5KG</View>
          </View>
          <View className={`${prefix}-message-item`}>
            <View className={`${prefix}-message-subtitle`}>单位</View>
            <View className={`${prefix}-message-text`}>箱</View>
          </View>
        </View>
        <View style='width: 100%; height: 100px' />
      </View>
    )
  }
}

export default Page;