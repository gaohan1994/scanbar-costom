import Taro from '@tarojs/taro'
import { View, Image  } from '@tarojs/components'
import './index.less'
import '../../../component/product/product.less'
import { MerchantInterface, UserInterface } from '../../../constants'
import { connect } from '@tarojs/redux'
import { AppReducer } from '../../../reducers'
import { getCurrentMerchantDetail } from '../../../reducers/app.merchant'
import { getIndexAddress } from '../../../reducers/app.user';
import icon_checi from '../../../assets/icon_checi.png';

const prefix = 'index-component-address'

type Props = {
  initDit: () => void;
  indexAddress: UserInterface.Address;
  changeModalStroe: (param) => void;
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
    const { indexAddress, currentMerchantDetail, changeModalStroe, initDit } = this.props;

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
          // onClick={address ? () => this.onNavAddress() : () => {initDit();}}
        >
          <Image className={`${prefix}-title-icon`} src={icon_checi} />
          <View className={`${prefix}-title-text${process.env.TARO_ENV === 'h5' ? '-h5' : ''}`}>
            {/* {address ? address : '点击重新获取定位'} */}
            {
                currentMerchantDetail && currentMerchantDetail.name && currentMerchantDetail.name.length > 0 ? `车次 ${currentMerchantDetail.name}` : '未获取到列车'
              }
          </View>
          {/* <View className={`${prefix}-icon`} /> */}
        </View>
        <View className={`${prefix}-box ${process.env.TARO_ENV === 'h5' ? `${prefix}-box-h5` : ''}`}>
          {/* <View className={`${prefix}-merchant ${process.env.TARO_ENV === 'h5' ? `${prefix}-merchant-h5` : ''}`}>
           <View className={`${prefix}-merchant-name`} onClick={() => {changeModalStroe(true)}}>
              {
                currentMerchantDetail && currentMerchantDetail.name && currentMerchantDetail.name.length > 0 ? currentMerchantDetail.name : '未获取到店名'
              }
            </View>
          </View> */}
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