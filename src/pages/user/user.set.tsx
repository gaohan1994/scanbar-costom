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
          {/* <View className={`${cssPrefix}-set-button`}>
            <AtButton
              className="theme-button"
              onClick={() => {
                
                const paymentPayload = {
                  timeStamp: '1620801439',
                  package: 'prepay_id=wx12143719065550d2b927d6c4b6c0b40000',
                  paySign: '1VFEx0YEfKRomH1RpD2eaQlTfCqHgO32OGaquhkKWoILoWRv01rVADfqoGtR0zAQe21ywDVuE4kFV6HnlhbhNMipIfrejtS+HONgvlEL7anvDem09Iz9HFdMVa9hdgUzwHDwudcVuncBD2LyigIW4f4dJ1s/Sogtou882NBbtkTkcx/wP4iOJP/OhkNJQWAdvBNZoORUwhg6XgCWVKXFs/kWj2Ypp9LnRdcbgRin315K+AqxcxtOUbtWI/Q72OH0+nHVC1UO3iBCFX3BPpggbBWkgieEWHcOnyrhdzdAENc8HM5pDnJTB0aLH6FNKQGVfbO403fVmeCqlDimcNCOPg==',
                  // appId: 'wxe00658982eae2459',
                  signType: 'RSA', 
                  nonceStr: '124420942b574b32aa8a1e9eed546dea',
                  success: (res) => {
                      console.log(res);
                  },
                  fail: (error) => {
                    console.log(error)
                  }
                };
                Taro.requestPayment(paymentPayload);
              }}
            >
              <Text className="theme-button-text" >测试支付</Text>
            </AtButton>
          </View> */}
        </View>
      </View>
    );
  }
}
const select = (state: any) => ({
});

export default connect(select)(Page);