import Taro from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import './modal.less';
import { AtModal, AtModalContent } from 'taro-ui';
import { LoginManager } from '../../common/sdk';
import invariant from 'invariant';
import { ResponseCode } from '../../constants';
import WeixinSDK from '../../common/sdk/weixin/weixin';
import { UserAction } from '../../actions';
import { Dispatch } from 'redux';

const cssPrefix = 'login-modal';

interface Props {
  dispatch: Dispatch;
  isOpen: boolean;
  onCancle: () => void;
  callback?: (userinfo: any) => void;
}

interface State {

}

class GetUserinfoModal extends Taro.Component<Props, State> {

  public getWxInfo = async (show?: boolean) => {
    const {dispatch} = this.props;
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
    try {
      
      const { callback, onCancle, dispatch } = this.props;
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
      onCancle();
      if (callback) {
        callback(newUserinfo);
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
    const { isOpen, onCancle } = this.props
    return (
      <AtModal isOpened={isOpen} className={`${cssPrefix}-modal`}>
        <AtModalContent>
          <View className={`${cssPrefix}-content`}>
            小程序需要获取您的微信头像和昵称
          </View>
        </AtModalContent>
        <View className={`${cssPrefix}-buttons`}>
          <Button
            className={`${cssPrefix}-button`}
            onClick={onCancle}
          >
            取消
          </Button>
          <Button
            openType='getUserInfo'
            onGetUserInfo={() => this.getWxInfo(true)}
            className={`${cssPrefix}-button ${cssPrefix}-blue`}
          >
            确定
          </Button>
        </View>
      </AtModal>
    )
  }


}

export default GetUserinfoModal;