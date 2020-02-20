import Taro from '@tarojs/taro';
import { View, Image, Button } from '@tarojs/components';
import './modal.less';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';
import requestHttp from '../../common/request/request.http';
import { LoginManager } from '../../common/sdk';
import invariant from 'invariant';
import { ResponseCode } from '../../constants';

const cssPrefix = 'login-modal';

interface Props {
  isOpen: boolean;
  onCancle: () => void;
}

interface State {

}

class LoginModal extends Taro.Component<Props, State> {

  public onGetPhoneNumber = async (params) => {
    const { onCancle } = this.props;
    console.log('params: ', params)
    const { detail } = params;
    if (detail.errMsg === "getPhoneNumber:ok") {
      const payload = {
        encryptedData: detail.encryptedData,
        ivStr: detail.iv
      };
      
      try {
        onCancle();
        const result = await requestHttp.post('/api/decrypt', payload);
        console.log('result: ', result);
        invariant(result.code === ResponseCode.success, result.msg || '登录失败');
        const getResult = await LoginManager.getUserInfo();
        invariant(getResult.success, getResult.msg || '获取用户信息失败');
        const userinfo = getResult.result;
        const newUserinfo = {
          ...userinfo,
          phone: JSON.parse(result.data).phoneNumber,
        };
        const setResult: any = await LoginManager.setUserInfo(newUserinfo);
        invariant(setResult.success, setResult.msg || '存储用户信息失败');
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
      <AtModal isOpened={isOpen}>
        <AtModalHeader>请先登录</AtModalHeader>
        <AtModalContent>
          <View className={`${cssPrefix}-content`}>
            部分功能需要登录才能使用
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={onCancle}>取消</Button>
          <Button
            openType='getPhoneNumber'
            onGetPhoneNumber={this.onGetPhoneNumber}
            // onClick={onCancle}
          >
            确定
          </Button>
        </AtModalAction>
      </AtModal>
    )
  }


}

export default LoginModal;