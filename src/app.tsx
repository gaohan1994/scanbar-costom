import '@tarojs/async-await'
import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import { View } from '@tarojs/components'

// import Index from './pages/index'
import "./styles/reset.less";
import configStore from './store'
import 'taro-ui/dist/style/index.scss' // 引入组件样式 - 方式一

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

export const store = configStore()

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/order/order',
      'pages/order/order.pay',
      'pages/user/user',
      'pages/test/test',
      'pages/cart/cart',
      'pages/product/product.detail',
      'pages/address/address.list',
      'pages/address/address.add',
      'pages/address/address.change.index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#2a86fc',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'white',
    },
    tabBar: {
      color: "#ACACAC",
      selectedColor: "#2EAAF8",
      backgroundColor: "#ffffff",
      borderStyle: 'black',
      list: [{
        pagePath: "pages/index/index",
        iconPath: "./assets/tab-bar/icon_nav_home.png",
        selectedIconPath: "./assets/tab-bar/icon_nav_home_selected.png",
        text: "首页"
      }, {
        pagePath: "pages/order/order",
        iconPath: "./assets/tab-bar/icon_nav_order.png",
        selectedIconPath: "./assets/tab-bar/icon_nav_order_selected.png",
        text: "订单"
      }, {
        pagePath: "pages/cart/cart",
        iconPath: "./assets/tab-bar/icon_nav_cart.png",
        selectedIconPath: "./assets/tab-bar/icon_nav_cart_selected.png",
        text: "购物车"
      }, {
        pagePath: "pages/user/user",
        iconPath: "./assets/tab-bar/icon_nav_mine.png",
        selectedIconPath: "./assets/tab-bar/icon_nav_mine_selected.png",
        text: "我的"
      }]
    },
    permission: {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示" // 高速公路行驶持续后台定位
      }
    }
  }
  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        {/* <Index /> */}
        <View>asd</View>
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
