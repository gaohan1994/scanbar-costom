import Taro from '@tarojs/taro'
import { View, Image  } from '@tarojs/components'
import './index.less'
import '../../../component/product/product.less'
import { MerchantInterface, UserInterface } from '../../../constants'
import { connect } from '@tarojs/redux'
import { AppReducer } from '../../../reducers'
import { getCurrentMerchantDetail } from '../../../reducers/app.merchant'
import { getIndexAddress } from '../../../reducers/app.user'
import { BASE_PARAM } from '../../../common/util/config';
import icon_store from '../../../assets/icon_store.png';

const prefix = 'index-component-address'

type Props = {
  initDit: () => void;
  advertisement?: any;
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
    const { indexAddress, advertisement, currentMerchantDetail, changeModalStroe, initDit } = this.props;

    const address = indexAddress && indexAddress.address 
      ? indexAddress.address.indexOf('市') !== -1
        ? indexAddress.address.split('市')[1]
        : indexAddress.address
      : ''

    return (
      <View 
        className={`${prefix} ${process.env.TARO_ENV === 'h5' ? `${prefix}-h5` : ''}`}
        style={advertisement && advertisement.length > 0 ? {height: '3.56rem'} : {}}
      >
        <View 
          style={BASE_PARAM.ishomeAdress ? {} : {display: 'none'}}
          className={`${prefix}-title  ${process.env.TARO_ENV === 'h5' ? `${prefix}-title-h5` : ''}`}
          onClick={address ? () => this.onNavAddress() : () => {initDit();}}
        >
          <Image className={`${prefix}-title-icon`} src='//net.huanmusic.com/scanbar-c/icon_location.png' />
          <View className={`${prefix}-title-text${process.env.TARO_ENV === 'h5' ? '-h5' : ''}`}>
            {address ? address : '点击重新获取定位'}
          </View>
          <View className={`${prefix}-icon`} />
        </View>
        <View className={`${prefix}-box ${process.env.TARO_ENV === 'h5' ? `${prefix}-box-h5` : ''}`} style={BASE_PARAM.ishomeAdress ? {} : {marginTop: '0.7rem'}}>
          <View className={`${prefix}-merchant ${process.env.TARO_ENV === 'h5' ? `${prefix}-merchant-h5` : ''}`}>
            <Image className={`${prefix}-merchant-icon`} src={icon_store} />

            <View className={`${prefix}-merchant-name`} onClick={() => {changeModalStroe(true)}}>
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
            <View className={`${prefix}-search-text`}>商品名称</View>
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