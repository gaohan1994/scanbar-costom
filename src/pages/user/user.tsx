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
  isOpen: boolean;
}
class User extends Taro.Component<Props, State> {

  state = {
    userinfo: {} as any,
    isOpen: false as any,
  }

  config: Config = {
    navigationBarTitleText: '我的'
  }

  async componentDidMount() {
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
      if ((!userinfo.phone || userinfo.phone.length === 0)) {
        this.setState({ isOpen: true });
      };
    }
    Taro.navigateTo({
      url: `${row.url}`
    });
  }


  public getWxInfo = async (show?: boolean) => {
    try {
      const { userinfo } = this.state;
      if ((!userinfo.phone || userinfo.phone.length === 0)) {
        this.setState({ isOpen: true });
      };
      const result: any = await WeixinSDK.getWeixinUserinfo();
      invariant(result.success, result.msg || '获取用户昵称和头像失败');
      const params = {
        avatar: result.result.avatarUrl,
        nickname: result.result.nickName,
      }
      const saveResult: any = await merchantAction.wxUserInfoSave(params);
      invariant(saveResult.code === ResponseCode.success, saveResult.msg || '保存用户信息失败');
      
      const newUserinfo = {
        ...userinfo,
        avatar: result.result.avatarUrl,
        nickname: result.result.nickName,
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

  render() {
    // const { userinfo } = this.props;
    const { userinfo, isOpen } = this.state;
    return (
      <View className={`container ${cssPrefix}`}>
        <View className={`${cssPrefix}-bg`} />
        <View className={`${cssPrefix}-container`}>
          {/* <View
            className={`${cssPrefix}-user`}
            onClick={() => this.getWxInfo(true)}
          > */}
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
                  : <Button
                    openType='getUserInfo'
                    onGetUserInfo={() => this.getWxInfo(true)}
                    className={`${cssPrefix}-user-name ${cssPrefix}-user-name-get`}
                  >
                    获取用户昵称
                </Button>
              }
              <View className={`${cssPrefix}-user-phone`}>{userinfo.phone}</View>
            </View>
          </Button>
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
        <LoginModal isOpen={isOpen} onCancle={() => { this.setState({ isOpen: false }) }}/>
      </View>
    );
  }
}

export default User