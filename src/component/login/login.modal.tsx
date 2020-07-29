import Taro from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import './modal.less';
import { AtModal, AtModalContent } from 'taro-ui';
import requestHttp from '../../common/request/request.http';
import { LoginManager } from '../../common/sdk';
import invariant from 'invariant';
import { ResponseCode } from '../../constants';
import { UserAction } from '../../actions';
import WeixinSDK from '../../common/sdk/weixin/weixin';
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

class LoginModal extends Taro.Component<Props, State> {

  public onGetPhoneNumber = async (params) => {
    const { onCancle, callback, dispatch } = this.props;

    const { detail } = params;
    if (detail.errMsg === "getPhoneNumber:ok") {
      const codeRes = await WeixinSDK.getWeixinCode();
      invariant(codeRes.success, codeRes.msg || '请先登录微信');
      const payload = {
        encryptedData: detail.encryptedData,
        ivStr: detail.iv,
        code: codeRes.result,
      };

      try {
        onCancle();
        const result = await requestHttp.post('/customer/decrypt', payload);

        invariant(result.code === ResponseCode.success, result.msg || '获取手机号失败');
        const getResult = await LoginManager.getUserInfo(dispatch);
        invariant(getResult.success, getResult.msg || '获取用户信息失败');
        const userinfo = getResult.result;
        const newCodeRes = await WeixinSDK.getWeixinCode();
        const loginRes = await LoginManager.login({ phone: JSON.parse(result.data).phoneNumber, code: newCodeRes.result}, dispatch);
        invariant(loginRes.success, loginRes.msg || '登录失败');
        const newUserinfo = {
          ...userinfo,
          phone: JSON.parse(result.data).phoneNumber,
          // token: loginRes.result.token
        };
        const saveResult: any = await UserAction.userInfoSave(newUserinfo);
        invariant(saveResult.code === ResponseCode.success, saveResult.msg || '保存用户信息失败');
        const localUserinfo = {
          ...newUserinfo,
          token: loginRes.result.token
        }
        const setResult: any = await LoginManager.setUserInfo(localUserinfo, dispatch);
        invariant(setResult.success, setResult.msg || '存储用户信息失败');
        if (callback) {
          callback(newUserinfo);
        }
      } catch (error) {
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
            部分功能需要登录才能使用
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
            className={`${cssPrefix}-button ${cssPrefix}-blue`}
            openType='getPhoneNumber'
            onGetPhoneNumber={this.onGetPhoneNumber}
          // onClick={onCancle}
          >
            确定
        </Button>
        </View>
      </AtModal>
    )
  }


}

export default LoginModal;