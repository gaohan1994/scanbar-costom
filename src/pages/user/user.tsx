import Taro, { Config } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import LoginButton from '../../common/sdk/sign/login.button';
import WeixinSDK from '../../common/sdk/weixin/weixin';
import './index.less';
import "../../component/card/form.card.less";


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
class Page extends Taro.Component {

  config: Config = {
    navigationBarTitleText: '我的'
  }

  public address = async () => {
    const result = await WeixinSDK.chooseAddress();
    console.log(result);
  }

  public onRowClick = (row: any) => {
    Taro.navigateTo({
      url: `${row.url}`
    });
  }

  render() {
    // const { userinfo } = this.props;
    // console.log('test kkk', userinfo);
    return (
      <View className="container container-color">
        <View className={`${cssPrefix}-bg`} />
        <View className={`${cssPrefix}-container`}>
          <View
            className={`${cssPrefix}-user`}
            onClick={() => { }}
          >
            <Image
              src="//net.huanmusic.com/weapp/icon_mine_touxiang.png"
              className={`${cssPrefix}-user-image`}
            />
            <View className={`${cssPrefix}-user-box`}>
              <View className={`${cssPrefix}-user-name`}>
                黄小姐
              </View>
              <View className={`${cssPrefix}-user-text`}>1111111111</View>
            </View>
          </View>
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
      </View>
    );
  }
}


export default Page;