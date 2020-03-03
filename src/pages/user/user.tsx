import Taro, { Config } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import LoginButton from '../../common/sdk/sign/login.button';
import WeixinSDK from '../../common/sdk/weixin/weixin';
import './index.less';
import "../../component/card/form.card.less";
import invariant from 'invariant';
import { LoginManager } from '../../common/sdk';
import merchantAction from '../../actions/merchant.action';
import { ResponseCode } from '../../constants';
import LoginModal from '../../component/login/login.modal';
import GetUserinfoModal from '../../component/login/login.userinfo';


const Rows = [
  {
    title: '我的地址',
    url: '/pages/address/address.list',
    icon: '//net.huanmusic.com/weapp/customer/icon_mine_location.png',
  },
  {
    title: '设置',
    url: '/pages/user/user.set',
    icon: '//net.huanmusic.com/weapp/customer/icon_mine_set.png',
  }
];

const cssPrefix = 'user';

interface Props {

}
interface State {
  userinfo: any;
  getUserinfoModal: boolean;
  loginModal: boolean;
}
class User extends Taro.Component<Props, State> {

  state = {
    userinfo: {} as any,
    getUserinfoModal: false as any,
    loginModal: false as any
  }

  config: Config = {
    navigationBarTitleText: '我的'
  }

  async componentDidShow() {
    const result = await LoginManager.getUserInfo();
    if (result.success) {
      this.setState({
        userinfo: result.result,
      }, () => {
        this.getWxInfo(false);
      })
    } else {
      Taro.showToast({
        title: '请先登录',
        icon: 'none'
      });
    }
  }

  public address = async () => {
    const result = await WeixinSDK.chooseAddress();
    console.log(result);
  }

  public onRowClick = (row: any) => {
    if (row.title === '我的地址') {
      const { userinfo } = this.state;
      if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
        this.setState({ getUserinfoModal: true });
        return;
      }
      if ((!userinfo.phone || userinfo.phone.length === 0)) {
        this.setState({ loginModal: true });
        return;
      };
    }
    Taro.navigateTo({
      url: `${row.url}`
    });
  }


  public getWxInfo = async (show?: boolean) => {
    try {
      const { userinfo } = this.state;
      if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
        this.setState({ getUserinfoModal: true });
        return;
      }
      if ((!userinfo.phone || userinfo.phone.length === 0)) {
        this.setState({ loginModal: true });
        return;
      };
      this.getWxUserInfo(show);
    } catch (error) {
      if (show != false) {
        Taro.showToast({
          title: error.message,
          icon: 'none'
        });
      }
    }
  }

  public getWxUserInfo = async (show?: boolean) => {
    try {
      const { userinfo } = this.state;
      const result: any = await WeixinSDK.getWeixinUserinfo();
      invariant(result.success, result.msg || '获取用户昵称和头像失败');
      const newUserinfo = {
        ...userinfo,
        avatar: result.result.avatarUrl,
        nickname: result.result.nickName,
      }
      if (userinfo && userinfo.phone && userinfo.phone.length > 0) {
        const saveResult: any = await merchantAction.wxUserInfoSave(newUserinfo);
        invariant(saveResult.code === ResponseCode.success, saveResult.msg || '保存用户信息失败');
      }

      this.setState({
        userinfo: newUserinfo
      })
      const setResult: any = await LoginManager.setUserInfo(newUserinfo);
      invariant(setResult.success, setResult.msg || '存储用户信息失败');
    } catch (error) {
      if (show != false) {
        Taro.showToast({
          title: error.message,
          icon: 'none'
        });
      }
    }
  }

  getPhoneNumber = (userinfo: any) => {
    this.setState({ userinfo })
    if (userinfo.phone === undefined || userinfo.phone.length === 0) {
      this.setState({
        loginModal: true
      });
    }
  }

  render() {
    // const { userinfo } = this.props;
    const { userinfo, loginModal, getUserinfoModal } = this.state;
    return (
      <View className={`container ${cssPrefix}`}>
        <View className={`${cssPrefix}-bg`} />
        <View className={`${cssPrefix}-container`}>
          {/* <View
            className={`${cssPrefix}-user`}
            onClick={() => this.getWxInfo(true)}
          > */}
          {
            userinfo && userinfo.phone && userinfo.phone.length > 0
              ? (
                <Button
                  openType='getUserInfo'
                  onGetUserInfo={() => this.getWxInfo(true)}
                  className={`${cssPrefix}-user`}
                >
                  {
                    userinfo && userinfo.avatar && userinfo.avatar.length > 0
                      ? (
                        <Image
                          src={userinfo.avatar}
                          className={`${cssPrefix}-user-image`}
                        />
                      )
                      : (
                        <Image
                          src="//net.huanmusic.com/weapp/icon_mine_touxiang.png"
                          className={`${cssPrefix}-user-image`}
                        />
                      )
                  }
                  <View className={`${cssPrefix}-user-box`} >
                    {
                      userinfo && userinfo.nickname && userinfo.nickname.length > 0
                        ? <View className={`${cssPrefix}-user-name`}>
                          {userinfo.nickname}
                        </View>
                        : <View
                          // openType='getUserInfo'
                          // onGetUserInfo={() => this.getWxInfo(true)}
                          className={`${cssPrefix}-user-name ${cssPrefix}-user-name-get`}
                        >
                          点击登录
                  </View>
                    }
                    <View className={`${cssPrefix}-user-phone`}>{userinfo.phone}</View>
                  </View>
                </Button>
              )
              : (
                <View
                  className={`${cssPrefix}-user`}
                >
                  {
                    userinfo && userinfo.avatar && userinfo.avatar.length > 0
                      ? (
                        <Image
                          src={userinfo.avatar}
                          className={`${cssPrefix}-user-image`}
                        />
                      )
                      : (
                        <Image
                          src="//net.huanmusic.com/weapp/icon_mine_touxiang.png"
                          className={`${cssPrefix}-user-image`}
                        />
                      )
                  }
                  <View className={`${cssPrefix}-user-box`} >
                    <View
                      className={`${cssPrefix}-user-name ${cssPrefix}-user-name-get`}
                      onClick={() => {
                        userinfo && userinfo.nickname && userinfo.nickname.length > 0
                          ? this.setState({ loginModal: true })
                          : this.setState({ getUserinfoModal: true })
                      }}
                    >
                      点击登录
                  </View>
                  </View>
                </View>
              )
          }

          <View className={`${cssPrefix}-rows`}>
            {
              Rows.map((item: any) => {
                return (
                  <View
                    className={`${cssPrefix}-rows-item`}
                    key={item.title}
                    onClick={() => this.onRowClick(item)}>
                    <View className={`${cssPrefix}-rows-item-left`}>
                      <Image
                        className={`${cssPrefix}-rows-item-left-icon`}
                        src={item.icon}
                      />
                      <Text className={`${cssPrefix}-rows-item-left-title`} >{item.title}</Text>
                    </View>
                    <Image
                      className={`${cssPrefix}-rows-item-right-icon`}
                      src="//net.huanmusic.com/weapp/icon_commodity_into.png"
                    />
                  </View>
                )
              })
            }
          </View>
        </View>
        <GetUserinfoModal isOpen={getUserinfoModal} onCancle={() => { this.setState({ getUserinfoModal: false }) }} callback={(userinfo: any) => this.getPhoneNumber(userinfo)} />
        <LoginModal isOpen={loginModal} onCancle={() => { this.setState({ loginModal: false }) }} callback={(userinfo: any) => this.setState({ userinfo })} />
      </View>
    );
  }
}

export default User