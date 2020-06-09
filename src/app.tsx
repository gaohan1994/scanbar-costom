import "@tarojs/async-await";
import Taro, { Component, Config } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";
import Index from "./pages/index";
import "./styles/reset.less";
import configStore from "./store";
import "taro-ui/dist/style/index.scss"; // 引入组件样式 - 方式一
import getBaseUrl from "./common/request/base.url";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
if (process.env.NODE_ENV !== "production" && process.env.TARO_ENV === "h5") {
  require("nerv-devtools");
}

export const store = configStore();

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   * 回退版本
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      "pages/index/index",
      "pages/index/home",
      "pages/orderList/order",
      // 'pages/order/order.pay',
      // 'pages/order/order.pay.remark',
      // 'pages/order/order.detail',
      // 'pages/order/order.cancel',
      // 'pages/order/order.refund',
      "pages/user/user",
      "pages/user/user.set",
      "pages/user/user.coupon",
      "pages/user/user.code",
      "pages/test/test",
      "pages/cart/cart",
      "pages/user/user.couponCenter",
      "pages/product/product.detail",
      "pages/product/product.search"
      // 'pages/address/address.list',
      // 'pages/address/address.add',
      // 'pages/address/address.edit',
      // 'pages/address/address.change.index'
    ],
    subPackages: [
      {
        root: "pages/order/",
        pages: [
          "order.pay",
          "order.pay.remark",
          "order.pay.coupon",
          "order.detail",
          "order.cancel",
          "order.refund",
          "order.refund.schedule"
        ]
      },
      // {
      //   root: 'pages/user/',
      //   pages: [
      //     'user.set',
      //   ]
      // },
      {
        root: "pages/address/",
        pages: [
          "address.list",
          "address.add",
          "address.edit",
          "address.change.index"
        ]
      },
      {
        root: "pages/login/",
        pages: ["login", "login.userinfo"]
      }
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#2a86fc",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "white"
    },
    tabBar: {
      color: "#ACACAC",
      selectedColor: "#2EAAF8",
      backgroundColor: "#ffffff",
      borderStyle: "black",
      list: [
        {
          pagePath: "pages/index/index",
          iconPath: "./assets/tab-bar/icon_nav_home.png",
          selectedIconPath: "./assets/tab-bar/icon_nav_home_selected.png",
          text: "首页"
        },
        {
          pagePath: "pages/orderList/order",
          iconPath: "./assets/tab-bar/icon_nav_order.png",
          selectedIconPath: "./assets/tab-bar/icon_nav_order_selected.png",
          text: "订单"
        },
        {
          pagePath: "pages/cart/cart",
          iconPath: "./assets/tab-bar/icon_nav_cart.png",
          selectedIconPath: "./assets/tab-bar/icon_nav_cart_selected.png",
          text: "购物车"
        },
        {
          pagePath: "pages/user/user",
          iconPath: "./assets/tab-bar/icon_nav_mine.png",
          selectedIconPath: "./assets/tab-bar/icon_nav_mine_selected.png",
          text: "我的"
        }
      ]
    },
    permission: {
      "scope.userLocation": {
        desc: "你的位置信息将用于小程序位置接口的效果展示" // 高速公路行驶持续后台定位
      }
    }
  };
  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  componentWillMount() {
    if (process.env.TARO_ENV === "h5") {
      const hash = window.location.hash.split("?");
      const keywords = hash[1] ? hash[1] : "";
      const result = keywords.replace(/&/g, '","').replace(/=/g, '":"');
      if (result) {
        const reqDataString = '{"' + result + '"}';
        const key = JSON.parse(reqDataString);
        if (key.merchantId) {
          localStorage.setItem("merchantId", `${key.merchantId}`);
        }
        localStorage.setItem("search", `?keywords`);
      }
      this.initWx();
    }
  }
  initWx() {
    console.log(window.location);
    const href = window.location.href;
    const data = href.split("#")[0];
    const BASE_URL = getBaseUrl("/customer/wx/init");
    let contentType = "application/json";
    const option: any = {
      url: BASE_URL + "/customer/wx/init",
      data: {
        url: data
      },
      method: "GET",
      header: {
        "content-type": contentType
      },
      success: res => {
        console.log("success++++++++++++++++++++++++++++++", res);
        if (
          res.statusCode === 200 &&
          res.data &&
          res.data.code === "response.success"
        ) {
          const data = res.data.data;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            jsApiList: ["getLocation", "openLocation", "chooseWXPay"] // 必填，需要使用的JS接口列表
          });
          wx.ready(function(res) {
            console.log(
              "res-----------------------------------------++++",
              res
            );
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
          });
        }
      },
      fail: res => {
        console.log("fail+++++++++++++++++++++++++++++++++++", res);
      }
    };
    // console.log('option: ', option);
    Taro.request(option);
  }
  render() {
    return (
      <Provider store={store}>
        <Index />
        {/* {
          process.env.TARO_ENV === 'h5' ? 'h5' : <View>asd</View>
        } */}
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
