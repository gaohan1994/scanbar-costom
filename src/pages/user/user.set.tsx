import Taro, { Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.less';
import "../../component/card/form.card.less";
import { AtButton } from 'taro-ui';
import { LoginManager } from '../../common/sdk';
import { Dispatch } from 'redux';
import { connect } from '@tarojs/redux';


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
class Page extends Taro.Component<{dispatch: Dispatch}> {

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

  public logout = async () => {
    const {dispatch} = this.props;
    const res = await LoginManager.logout(dispatch);
    if (res.success) {
      Taro.showToast({
        title: '退出登录成功'
      });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
    } else {
      Taro.showToast({
        title: '退出登录失败',
        icon: 'fail'
      });
    }
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
const select = (state: any) => ({
});

export default connect(select)(Page);