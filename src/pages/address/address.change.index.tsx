
import Taro, { Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../style/product.less'
import { AppReducer } from '../../reducers'
import { getAddressList, getCurrentPostion, getIndexAddress } from '../../reducers/app.user';
import { UserInterface } from '../../constants'
import AddressItem from '../../component/address/item'
import ButtonFooter from '../../component/button/button.footer';
import WeixinSdk from '../../common/sdk/weixin/weixin'
import invariant from 'invariant'
import './index.less'
import GetUserinfoModal from '../../component/login/login.userinfo'
import LoginModal from '../../component/login/login.modal'
import { LoginManager } from '../../common/sdk'
import { UserAction } from '../../actions'
import { Dispatch } from 'redux';
import { getCurrentMerchantDetail } from '../../reducers/app.merchant';

const prefix = 'address'

type Props = {
  dispatch: Dispatch;
  indexAddress: any;
  currentMerchantDetail: any;
  addressList: UserInterface.Address[];
  currentPostion: UserInterface.Address;
}
type State = {
  getUserinfoModal: boolean;
  loginModal: boolean;
}

class Page extends Taro.Component<Props, State> {

  state = {
    getUserinfoModal: false,
    loginModal: false
  }

  config: Config = {
    navigationBarTitleText: '选择收货地址'
  }

  componentDidShow() {
    const {indexAddress} = this.props;
    UserAction.addressList(this.props.dispatch, indexAddress);
  }

  public onAddressClick = (address: UserInterface.Address) => {
    WeixinSdk.changeCostomIndexAddress(address, this.props.dispatch);
    Taro.navigateBack({})
  }

  public reCurrentPostion = async () => {
    try {
      Taro.showLoading();
      const result = await WeixinSdk.getLocation(this.props.dispatch);
      Taro.hideLoading();
      invariant(!!result.success, result.msg || ' ')
    } catch (error) {
      Taro.showToast({
        title: '获取位置失败, 请开启手机定位',
        icon: 'none'
      })
    }
  }

  public onAdd = async () => {
    const {dispatch} = this.props;
    const result = await LoginManager.getUserInfo(dispatch);
    if (result.success) {
      const userinfo = result.result;
      if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
        Taro.navigateTo({ url: '/pages/login/login.userinfo' })
        return;
      }
      if ((!userinfo.phone || userinfo.phone.length === 0)) {
        Taro.navigateTo({ url: '/pages/login/login' })
        return;
      };
    } else {
      Taro.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      });
    }

    Taro.navigateTo({
      url: '/pages/address/address.add'
    });
  }

  render() {
    const { addressList, currentPostion, currentMerchantDetail } = this.props;
    // const { getUserinfoModal, loginModal } = this.state;
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

        {
          addressList && addressList.length > 0 && (
            <View className={`${prefix}-list`}>
              <View className={`${prefix}-current-title ${prefix}-list-title`}>收货地址</View>
              {addressList.map((address, index) => {
                return (
                  <AddressItem
                    key={`address${index}`}
                    currentMerchantDetail={currentMerchantDetail}
                    address={address}
                    showEdit={false}
                    onClick={() => this.onAddressClick(address)}
                    isBorder={index !== addressList.length - 1}
                  />
                )
              })
              }
            </View>
          )
        }


        <ButtonFooter
          buttons={[{
            title: '新增地址',
            onPress: () => {
              this.onAdd();
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
    indexAddress: getIndexAddress(state),
    currentPostion: getCurrentPostion(state),
    currentMerchantDetail: getCurrentMerchantDetail(state),
  }
}
export default connect(select)(Page);