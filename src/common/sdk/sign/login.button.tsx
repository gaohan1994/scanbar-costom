import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

class LoginButton extends Taro.Component {

  public onGetPhoneNumber = (params) => {
    console.log('params: ', params)
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