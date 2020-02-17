
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../style/product.less'
import { AppReducer } from '../../reducers'
import merchantAction from '../../actions/merchant.action'
import { getAddressList, getCurrentPostion } from '../../reducers/app.merchant'
import { MerchantInterface } from '../../constants'
import AddressItem from '../../component/address/item'
import ButtonFooter from '../../component/button/button.footer';
import WeixinSdk from '../../common/sdk/weixin/weixin'
import invariant from 'invariant'
import './index.less'

const prefix = 'address'

type Props = {
  addressList: MerchantInterface.Address[];
  currentPostion: MerchantInterface.Address;
}

class Page extends Taro.Component<Props> {

  componentDidShow () {
    merchantAction.addressList();
  }

  public onAddressClick = (address: MerchantInterface.Address) => {
    WeixinSdk.changeCostomIndexAddress(address);
    Taro.navigateBack({})
  }

  public reCurrentPostion = async () => {
    try {
      Taro.showLoading();
      const result = await WeixinSdk.getLocation();  
      Taro.hideLoading();
      invariant(!!result.success, result.msg || ' ')
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      }) 
    }
  }

  render () {
    const { addressList, currentPostion } = this.props;
    return (
      <View className='container'>
        <View 
          className={`${prefix}-current`}
          onClick={() => this.reCurrentPostion()}
        >
          <View className={`${prefix}-current-title`}>当前定位</View>
          <View className={`${prefix}-current-address`}>{currentPostion.address}</View>
          <View className={`${prefix}-current-pos`}>
            <Image className={`${prefix}-current-pos-icon`} src='//net.huanmusic.com/scanbar-c/icon_relocate.png' />
            <View className={`${prefix}-current-pos-text`}>重新定位</View>
          </View>
        </View>

        <View className={`${prefix}-list`}>
          {addressList && addressList.length > 0 ? addressList.map((address, index) => {
            return(
              <AddressItem
                key={`address${index}`}
                address={address}
                showEdit={false}
                onClick={() => this.onAddressClick(address)}
              />
            )
          }) : (
            <View>asd</View>
          )}
        </View>

        <ButtonFooter
          buttons={[{
            title: '新增地址',
            onPress: () => {
              Taro.navigateTo({
                url: '/pages/address/address.add'
              })
            }
          }]}
        />
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    addressList: getAddressList(state),
    currentPostion: getCurrentPostion(state),
  }
}
export default connect(select)(Page);