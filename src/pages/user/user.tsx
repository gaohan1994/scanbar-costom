import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import LoginButton from '../../common/sdk/sign/login.button';
import WeixinSDK from '../../common/sdk/weixin/weixin';

class Page extends Taro.Component {

  public address = async () => {
    // const result = await WeixinSDK.chooseAddress();
    // console.log(result);
    Taro.navigateTo({
      url: '/pages/address/address.list'
    })
  }
  render () {
    return (
      <View>
        <LoginButton />
        
        <Button onClick={() => this.address()}>address</Button>
      </View>
    )
  }
}


export default Page;