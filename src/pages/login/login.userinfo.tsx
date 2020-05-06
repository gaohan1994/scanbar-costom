import Taro, { Config } from '@tarojs/taro';
import { View, Button, Image } from '@tarojs/components';
import './index.less';
import { LoginManager } from '../../common/sdk';
import invariant from 'invariant';
import { ResponseCode } from '../../constants';
import WeixinSDK from '../../common/sdk/weixin/weixin';
import { UserAction } from '../../actions';
import { Dispatch } from 'redux';
import {connect} from '@tarojs/redux';

const cssPrefix = 'login';

interface Props {
  dispatch: Dispatch;
}

interface State {

}

class GetUserinfo extends Taro.Component<Props, State> {
  
  config: Config = {
    navigationBarTitleText: '登录'
  }

  public getWxInfo = async (show?: boolean) => {
    const {dispatch} = this.props;
    console.log(this.props)
    try {
      const codeRes = await WeixinSDK.getWeixinCode();
      invariant(codeRes.success, codeRes.msg || '请先登录微信');
      const result = await LoginManager.getUserInfo(dispatch);
      // invariant(result.success, '');
      let userinfo = {};
      if (result.success) {
        userinfo = result.result;
      }
      this.getWxUserInfo(userinfo, show);
    } catch (error) {
      if (show != false) {
        Taro.showToast({
          title: error.message,
          icon: 'none'
        });
      }
    }
  }

  public getWxUserInfo = async (userinfo: any, show?: boolean, ) => {
    const {dispatch} = this.props;
    try {
      
      // const { callback, onCancle } = this.props;
      const result: any = await WeixinSDK.getWeixinUserinfo();
      invariant(result.success, result.msg || '获取用户昵称和头像失败');
      const newUserinfo = {
        ...userinfo,
        avatar: result.result.avatarUrl,
        nickname: result.result.nickName,
      }

      if (userinfo && userinfo.phone && userinfo.phone.length > 0) {
        const saveResult: any = await UserAction.userInfoSave(newUserinfo);
        invariant(saveResult.code === ResponseCode.success, saveResult.msg || '保存用户信息失败');
      }
      const setResult: any = await LoginManager.setUserInfo(newUserinfo, dispatch);
      invariant(setResult.success, setResult.msg || '存储用户信息失败');
      // onCancle();
      // if (callback) {
      //   callback(newUserinfo);
      // }
      if (userinfo.phone === undefined || userinfo.phone.length === 0) {
        Taro.redirectTo({ url: '/pages/login/login' });
      } else {
        Taro.navigateBack();
      }
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
    return (
      <View className={`${cssPrefix}`}>
        <Image 
          className={`${cssPrefix}-img`}
          src={"//net.huanmusic.com/scanbar-c/v2/img_login.png"}
        />
        <Button 
          openType='getUserInfo'
          className={`${cssPrefix}-button`}
          onGetUserInfo={() => this.getWxInfo(true)}
        >
          立即登录
        </Button>
      </View>
    )
  }
}
const select = (state) => {
  return {
  }
}

export default connect(select)(GetUserinfo);