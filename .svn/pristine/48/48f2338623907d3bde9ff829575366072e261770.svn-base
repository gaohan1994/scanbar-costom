import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import requestHttp from '../../../common/request/request.http';

const PhoneKey = ''

class LoginButton extends Taro.Component {

  public onGetPhoneNumber = async (params) => {

    const { detail } = params;
    if (detail.errMsg === "getPhoneNumber:ok") {
      const payload = {
        encryptedData: detail.encryptedData,
	      ivStr: detail.iv
      };
      const result = await requestHttp.post('/customer/decrypt', payload)

      return new Promise((resolve) => {
        Taro
          .setStorage({ key: PhoneKey, data: JSON.stringify(result) })
          .then(() => {
            resolve({success: true, result, msg: ''});
          })
          .catch(error => resolve({success: false, result: {} as any, msg: error.message || '登录失败'}));
      });
    }
  }

  render () {
    return (
      <Button
        openType='getPhoneNumber'
        onGetPhoneNumber={this.onGetPhoneNumber}
      >
        LoginButton
      </Button>
    )
  }
}

export default LoginButton;