
import Taro, { Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../style/product.less'
import { AppReducer } from '../../reducers'
import { getAddressList, getCurrentPostion } from '../../reducers/app.user'
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

const prefix = 'address'

type Props = {
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
    UserAction.addressList();
  }

  public onAddressClick = (address: UserInterface.Address) => {
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

  public onAdd = async () => {
    const result = await LoginManager.getUserInfo();
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
    const { addressList, currentPostion } = this.props;
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
    currentPostion: getCurrentPostion(state),
  }
}
export default connect(select)(Page);