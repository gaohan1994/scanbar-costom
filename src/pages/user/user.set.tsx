import Taro, { Config } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import LoginButton from '../../common/sdk/sign/login.button';
import WeixinSDK from '../../common/sdk/weixin/weixin';
import './index.less';
import "../../component/card/form.card.less";
import { AtButton } from 'taro-ui';


const Rows = [
  {
    title: '用户协议',
    url: '/pages/mine/user.merchant',
    icon: '//net.huanmusic.com/weapp/customer/icon_mine_location.png',
  },
  {
    title: '隐私权政策',
    url: '/pages/mine/user.about',
    icon: '//net.huanmusic.com/weapp/customer/icon_mine_set.png',
  }
];

const cssPrefix = 'user';
class Page extends Taro.Component {

  config: Config = {
    navigationBarTitleText: '设置'
  }

  public onRowClick = (row: any) => {
    // Taro.navigateTo({
    //   url: `${row.url}`
    // });
    Taro.showToast({
      title: '正在开发中...',
      icon: 'none'
    });
  }

  public logout = () => {

  }

  render() {
    // const { userinfo } = this.props;
    return (
      <View className={`container ${cssPrefix}`} >
        <View className={`${cssPrefix}-container`}>
          <View className={`${cssPrefix}-rows`}>
            {
              Rows.map((item: any) => {
                return (
                  <View
                    className={`${cssPrefix}-rows-item`}
                    key={item.title}
                    onClick={() => this.onRowClick(item)}>
                    <View className={`${cssPrefix}-rows-item-left`}>
                      <Text className={`${cssPrefix}-rows-item-left-title`} >
                        {item.title}
                      </Text>
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
          <View className={`${cssPrefix}-set-button`}>
            <AtButton
              className="theme-button"
              onClick={this.logout}
            >
              <Text className="theme-button-text" >退出登录</Text>
            </AtButton>
          </View>

        </View>
      </View>
    );
  }
}


export default Page;