import Taro from '@tarojs/taro'
import { View, Image  } from '@tarojs/components'
import './index.less'
import '../../../component/product/product.less'
import { MerchantInterface, UserInterface } from '../../../constants'
import { connect } from '@tarojs/redux'
import { AppReducer } from '../../../reducers'
import { getCurrentMerchantDetail } from '../../../reducers/app.merchant'
import { getIndexAddress } from '../../../reducers/app.user'

const prefix = 'index-component-address'

type Props = {
  indexAddress: UserInterface.Address;
  currentMerchantDetail: MerchantInterface.MerchantDetail;
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
    const { indexAddress, currentMerchantDetail } = this.props;

    const address = indexAddress && indexAddress.address 
      ? indexAddress.address.indexOf('市') !== -1
        ? indexAddress.address.split('市')[1]
        : indexAddress.address
      : ''

    return (
      <View 
        className={`${prefix} ${process.env.TARO_ENV === 'h5' ? `${prefix}-h5` : ''}`}
      >
        <View 
          className={`${prefix}-title  ${process.env.TARO_ENV === 'h5' ? `${prefix}-title-h5` : ''}`}
          onClick={() => this.onNavAddress()}
        >
          <Image className={`${prefix}-title-icon`} src='//net.huanmusic.com/scanbar-c/icon_location.png' />
          <View className={`${prefix}-title-text${process.env.TARO_ENV === 'h5' ? '-h5' : ''}`}>
          {address}
          </View>
          <View className={`${prefix}-icon`} />
        </View>
        <View className={`${prefix}-box ${process.env.TARO_ENV === 'h5' ? `${prefix}-box-h5` : ''}`}>
          <View className={`${prefix}-merchant ${process.env.TARO_ENV === 'h5' ? `${prefix}-merchant-h5` : ''}`}>
            <View className={`${prefix}-merchant-name`}>
              {
                currentMerchantDetail && currentMerchantDetail.name && currentMerchantDetail.name.length > 0 ? currentMerchantDetail.name : '未获取到店名'
              }
            </View>
          </View>
          <View 
            className={`${prefix}-search ${process.env.TARO_ENV === 'h5' ? `${prefix}-search-h5` : ''}`}
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
        
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    indexAddress: getIndexAddress(state),
    currentMerchantDetail: getCurrentMerchantDetail(state),
  }
}

export default connect(select)(Comp as any);