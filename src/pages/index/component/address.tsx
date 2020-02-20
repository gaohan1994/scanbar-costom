import Taro from '@tarojs/taro'
import { View, Text, Image  } from '@tarojs/components'
import './index.less'
import '../../../component/product/product.less'
import classnames from 'classnames'
import { ProductInterface, MerchantInterface } from '../../../constants'
import { connect } from '@tarojs/redux'
import { AppReducer } from '../../../reducers'
import { getIndexAddress } from '../../../reducers/app.merchant'

const prefix = 'index-component-address'

type Props = {
  indexAddress: MerchantInterface.Address;
}

type State = {
}

class Comp extends Taro.Component<Props, State> {

  public onNavAddress = () => {
    Taro.navigateTo({
      url: `/pages/address/address.change.index`
    })
  }

  render () {
    const { indexAddress } = this.props;

    const address = indexAddress && indexAddress.address 
      ? indexAddress.address.indexOf('市') !== -1
        ? indexAddress.address.split('市')[1]
        : indexAddress.address
      : ''

    return (
      <View 
        className={`${prefix}`}
      >
        <View 
          className={`${prefix}-title`}
          onClick={() => this.onNavAddress()}
        >
          <Image className={`${prefix}-title-icon`} src='//net.huanmusic.com/scanbar-c/icon_location.png' />
          <View className={`${prefix}-title-text`}>
            {address}
          </View>
        </View>
        <View className={`${prefix}-box`}>
          <View className={`${prefix}-merchant`}>
            <View className={`${prefix}-merchant-name`}>
              商家：阳光便利店晋安店
            </View>
          </View>
        </View>
        <View 
          className={`${prefix}-search`}
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/product/product.search`
            })
          }}
        >
          <Image className={`${prefix}-search-icon`} src='//net.huanmusic.com/scanbar-c/icon_search.png' />
          <View className={`${prefix}-search-text`}>请输入商品名称</View>
        </View>
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    indexAddress: getIndexAddress(state)
  }
}

export default connect(select)(Comp);