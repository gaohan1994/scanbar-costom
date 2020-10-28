## 项目文档

### 使用的技术
项目主要使用了Taro框架，具体框架使用及开发，请参照：https://taro-docs.jd.com/taro/docs/README/index.html

### 项目安装和启动
git地址：https://github.com/gaohan1994/scanbar-costom.git

安装： yarn 或者 npm install

启动： taro build --type weapp --watch
编译： taro build --type weapp

### 项目文件结构
```
src
└───action    // 处理器（主要用于获取接口数据并存入redux中）
│   └───index.ts   //主文件
│   └───merchant.action.ts   //商户接口数据处理器
│   └───order.action.ts   //订单接口数据处理器
│   └───product.action.ts   //商品接口数据处理器
│   └───user.action.ts   //用户接口数据处理器
│   assets    // 图片文件夹
└───commom    // 全局通用文件
│   └───request   // 接口通用方法
│   └───sdk   // 全局通用sdk调用方法
│   └───util   // 全局通用方法
│   └───qqmap-wx-jssdk.js   // 微信小程序JavaScriptSDK
└───components   // 组件展示
└───constants   // 接口类
└───styles   // 样式
└───reducers   // 存储数据仓库
└───pages   // 所有页面
│   │   ...
│   │   address   // 地址
│   │   cart  // 购物车
│   │   index  // 首页
│   │   login   // 登录页面
│   │   order  // 订单页面
│   │   orderList  // 订单
│   │   product  // 商品页
│   │   style  // 样式
│   │   TopUp  // 储值模块
│   │   user  // 个人中心
│   │   ...
...
│   app.ts    // 主文件
...
project.config.json   // 项目配置文件
```

### 代码开发思路

* #### 个人信息模块
主要包括：展示个人信息。包括会员，积分，储值余额等信息展示以及入口。
1、会员码：主要用到了taro-code中的Barcode、QRCode
```
<View>
    <View className={`${cssPrefix}-bar-code`}>
        <Barcode text={userinfo.phone}/>
    </View>
    <View className={`${cssPrefix}-qr-code`}>
        <QRCode text={userinfo.phone}/>
    </View>
</View>
```
2、储值：页面没有用到复杂的组件，就是样式调整处理下。
充值明细：
这个列表就有用到分页，使用ScrollView来组件来处理分页，根据onScrollToLower这个方法。当滑动到底部时触发加载下一页的数据。

```
<ScrollView
    scrollY={true}
    className={`${BlockchainBdPrefix}-scrollview`}
    style={process.env.TARO_ENV === 'weapp' ? {display:'flex'} : {}}
    onScrollToLower={rows.length < total ? this.loadData: () => {/** */}}
>
{
    rows.map((val, index) => {
        return (
            <View className={`${BlockchainBdPrefix}-content-title`}>
                <Image className={`${BlockchainBdPrefix}-content-title-icon`} src={val.transType === 3 ?  '//net.huanmusic.com/weapp/icon_dot_blue.png' : '//net.huanmusic.com/weapp/icon_dot_red.png'}/>
                <View className={`${BlockchainBdPrefix}-content-title-message`} style={index === rows.length - 1 ? {border: 'none'} : {}}>
                    <Image className={`${BlockchainBdPrefix}-content-title-message-img`} src={val.transType !== 3  ? '//net.huanmusic.com/weapp/icon_details_pay.png' : '//net.huanmusic.com/weapp/icon_details_income.png'}/>
                    <View className={val.transType === 3 ? `${BlockchainBdPrefix}-content-title-message-money` : `${BlockchainBdPrefix}-content-title-message-money ${BlockchainBdPrefix}-content-title-message-money-red`}>{`${val.transAmount}`.indexOf('-') === -1 ? `+${val.transAmount}` : val.transAmount}</View>
                    <View className={`${BlockchainBdPrefix}-content-title-message-time`}>{val.changeTime}</View>
                </View>
            </View> 
        );
    })
}
</ScrollView>
```
3、优惠券：使用了component中的TabsSwitch组件，呈现tab的切换效果。列表都是使用ScrollView进行分页。
```
<TabsSwitch
    current={currentType}
    tabs={discountTypes}
    onChangeTab={this.onChangeTab}
    isCoupon={true}
/>
```
然后列表中每一个优惠券，又提取出来做成了一个CouponItem组件。这样在其他页面，例如选择优惠券页面就可以复用。

4、我的地址：地址中使用了微信的选择地址的方法
```
  public chooseAddress = async (): Promise<{ success: boolean, result: any }> => {
    return new Promise((resolve) => {
      Taro.chooseLocation({
        success: (result) => {
          resolve({ success: true, result })
        },
        fail: (result) => {
          resolve({ success: false, result })
        }
      });
      
    })
    
  }
```
* #### 首页
首页主要展示：积分，优惠券，地理位置，搜索，广告和菜品。
1、地理位置：初始化获取地理位置，因为Taro支持多端。且该项目需要转化成小程序和h5，所以需要进行这两个端的适配。
```
  public getLocation = async (dispatch): Promise<{ success: boolean, result: any, msg: string }> => {
    const that = this;
    return new Promise((resolve) => {
      if (process.env.TARO_ENV === 'weapp') {
        // 微信小程序逻辑
        Taro.getLocation({
          success: (res) => {
            mapSdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              success: (result) => {
                dispatch({
                  type: that.reducerInterface.RECEIVE_CURRENT_ADDRESS,
                  payload: {
                    address: result.result.address,
                    latitude: result.result.location.lat,
                    longitude: result.result.location.lng,
                  }
                })
                resolve({ success: true, result: result.result, msg: '' })
              },
              fail: (error) => {
                resolve({ success: false, result: undefined, msg: error.message })
              }
            })
          },
          fail: (error) => {
            resolve({ success: false, result: undefined, msg: error.message })
          }
        })
      }
      if (process.env.TARO_ENV === 'h5') {
        // H5 逻辑
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            // var speed = res.speed; // 速度，以米/每秒计
            // var accuracy = res.accuracy; // 位置精度
            const Option: any = {
              url: 'https://apis.map.qq.com/ws/geocoder/v1/',
              method: 'GET',
              data: {
                location: res.latitude+','+res.longitude,
                key: mapKey,
                output: 'jsonp'
              },
              dataType: 'jsonp',
              jsonp: "callback",
				      jsonpCallback: "QQmap",
              header: {
                'content-type': 'application/json'
              },
              success: (data) => { 
                const result = data.data;
                if(result.result){
                  dispatch({
                    type: that.reducerInterface.RECEIVE_CURRENT_ADDRESS,
                    payload: {
                      address: result.result.address,
                      latitude: result.result.location.lat,
                      longitude: result.result.location.lng,
                    }
                  })
                }
                resolve({ success: true, result: result.result, msg: '' })
              }, 
              fail: (error) => {
                resolve({ success: false, result: undefined, msg: error.message })
              }
            };
            Taro.request(Option);
            
            const param = {
              latitude: res.latitude,
              longitude: res.longitude
            };
            mapSdk.reverseGeocoder({location: param,
              success: (result) => {
                dispatch({
                  type: that.reducerInterface.RECEIVE_CURRENT_ADDRESS,
                  payload: {
                    address: result.result.address,
                    latitude: result.result.location.lat,
                    longitude: result.result.location.lng,
                  }
                })
                resolve({ success: true, result: result.result, msg: '' })
              },
              fail: (error) => {
                resolve({ success: false, result: undefined, msg: error.message })
              }
            })
          }
        });
      }
      
    })
  }
```
2、搜索：点击搜索，跳转到搜索页面。并且将每次的搜索记录存在state中，并展示。

3、广告：每一个Banner对应一个商品。点击Banner，则跳转到相应的商品的详情中。
这个Banner也是自己写的一个组件， 主要用到了Swiper，走马灯的形式轮播这个广告。
```
 <View className={`${prefix}-banner`}>
        <View className={`${prefix}-banner-bg`} />
        <Swiper
          className={`${prefix}-banner-swiper`}
          indicatorColor='#E3E3E3'
          indicatorActiveColor='#2C86FE'
          circular
          indicatorDots
          autoplay
        >
          {
            advertisement && advertisement.map((item, index) => {
              return (
                <SwiperItem key={`image${index}`}>
                  <View
                    className={`${prefix}-banner-swiper-item`}
                    style={`background-image: url(${item.pic})`}
                    onClick={() => {
                      if(item.adType === 0 ){
                        Taro.navigateTo({url: '/pages/product/product.detail?id=' + item.param})
                      }
                    }}
                  />
                </SwiperItem>
              )
            })
          }
        </Swiper>
      </View>
```
4、下拉刷新：小程序中下拉刷新需要在页面中进行设置
```
    onPullDownRefresh () {
        this.initDit();
        setTimeout(() => Taro.stopPullDownRefresh(),100)

    }
```
5、 菜品页面：页面采用分类展示的方式，点击分类，记载这一个分类的数据
其中菜品若是往上滑动的时候，就隐藏广告等数据。
```
   public onScroll = (event: any) => {
        const {detail} = event;
        const {scrollTop} = detail;
        const { refreshFlag } = this.common;
        if (refreshFlag) {
            if (!this.common.timeoutFlag) {
                this.common.timeoutFlag = true;
                setTimeout(() => {
                    this.common.timeoutFlag = false;
                    this.common.refreshFlag = false;
                }, 200);
            }
            return;
        }
        if (Number(scrollTop) >= 50) {
            if (this.state.showActivity === true) {
                this.setState({showActivity: false});
            }
        } else {
            if (Number(scrollTop) <= 10) {
                this.setState({showActivity: true});
            }
        }
    }
```
6、优惠信息显示
根据优惠信息的类型显示相应的优惠信息。会员价 》优惠价

```
    public getDiscountString = (memberInfo, activityList: any, product: ProductCartInterface.ProductCartInfo | ProductInterface.ProductInfo, type?: any) => {
        // const memberInfo = store.getState().user.memberInfo;
        const { enableMemberPrice } = memberInfo;
        if (!Array.isArray(activityList) || !activityList.length) {
            if (!enableMemberPrice || product.memberPrice === product.price) return '';
            if (!product.memberPrice) {
                return '';
            }
            return '会员专享';
        }
        const activity = activityList[0];
        const memberFlag = !!enableMemberPrice && activity.discountPrice > product.memberPrice;
        switch (activity.type) {
            case 1:
                return memberFlag 
                    ? '会员专享' 
                    : `${activity.discountAmount}折${activity.limitNum && activity.limitNum > 0 ? ` 限${activity.limitNum}件` : ``}`;
            case 2:
                return memberFlag ? '会员专享' : `优惠${activity.discountAmount}元${activity.limitNum && activity.limitNum > 0 ? ` 限${activity.limitNum}件` : ``}`;
            case 3:
                if (!activity.rule) return '';
                const rules = JSON.parse(activity.rule);
                if (!Array.isArray(rules) || !rules.length || !rules[0].threshold || !rules[0].threshold) {
                    return '';
                }
                if(type === 'all'){
                    const str = rules.map(val => `满${val.threshold}元减${val.discount}元`)
                    return str.join('；');
                } else {
                    return `满${rules[0].threshold}元减${rules[0].discount}元`
                }
               
            case 4:
                if (!activity.rule) return '';
                const ruleList = JSON.parse(activity.rule);
                if (!Array.isArray(ruleList) || !ruleList.length || !ruleList[0].threshold || !ruleList[0].threshold) {
                    return '';
                }
                if(type === 'all'){
                    const strList = ruleList.map(val => `满${val.threshold}件打${val.discount}折`)
                    return strList.join('；');
                } else {
                    return  `满${ruleList[0].threshold}件打${ruleList[0].discount}折`;
                }
                
            default:
                return ``;
        }
    }
```

* #### 购物车
1、购物车中用了footer组件，样式上h5和小程序还做了相应的适配
```
<Footer
    selectedIndex={productCartSelectedIndex}
    isCart={true}
    beforeSubmit={this.beforeSubmit}
    style={process.env.TARO_ENV === "h5" ? { bottom: "50px" } : {}}
/>
```
2、判断购物车中有没有商品，没有就显示空，判断用户有没有登录，没有的话就显示去登录按钮。
```
...
userinfo.nickname === undefined ||
          userinfo.nickname.length === 0 ||
          userinfo.phone === undefined ||
          userinfo.phone.length === 0 ? (
          <Empty
            img="//net.huanmusic.com/scanbar-c/v1/img_cart.png"
            text="完成登录后可享受更多会员服务"
            button={{
              title: "去登录",
              onClick: () => this.loginCheck()
            }}
          />
        ) : (
          <Empty
            img="//net.huanmusic.com/scanbar-c/v1/img_cart.png"
            text="还没有商品，快去选购吧"
            button={{
              title: "去选购",
              onClick: () => {
                Taro.switchTab({
                  url: `/pages/index/index`
                });
              }
            }}
          />
        )}
```

* #### 订单

订单也是有5个tab页面组成, 每个tab页面都是一个列表。
1、订单详情
订单详情中分为几个部分：订单状态（配送、退货），订单菜品详情，订单金额详情。
2、拨打商家电话
```
    Taro.makePhoneCall({
      phoneNumber: phone
    });
```
3、退货进度
一个订单只能取消一次。可以退货3次。
退货情况可以在退货详情中展示，以tab的形式。

4、支付
支付时可以选择抵扣优惠券、抵扣积分；支付方式有储值支付（需要充值），微信支付。
微信支付：
```
       Taro.requestPayment(paymentPayload);  //小程序
       window.location.href = url; // h5直接跳转第三方链接
```
储值支付：直接调接口即可



### 经验总结

1、小程序分享。需要在有需要分享的页面中写入分享的方法，不然无法分享
```
  onShareAppMessage = () => {
    const { productDetail } = this.props;

    return {
      title: productDetail.name,
      path: `/pages/product/product.detail?id=${productDetail.id}`,
      imageUrl: productDetail.shareImagePath
    };
  };
```
2、下拉刷新。需要在有需要刷新的页面中写入下拉刷新的方法，不然无法下拉
```
    onPullDownRefresh () {
        this.initDit();
        setTimeout(() => Taro.stopPullDownRefresh(),100)

    }
```

3、小程序的样式转成h5可能会有一些细微的地方不一样。所以如果有不同端的需要，需要对不同端进行处理。

4、taro转h5时，不允许相互依赖

5、taro转h5时，要改一下h5的配置
config/prod  
```
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
    webpackChain (chain) {
       chain.plugin('analyzer')
         .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    }
  }
```
config/index 
```
  h5: {
    publicPath: process.env.NODE_ENV==='development'?'/':'./',
    staticDirectory: 'static',

    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  }
```