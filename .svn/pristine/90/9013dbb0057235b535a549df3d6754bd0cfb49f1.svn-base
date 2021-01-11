import Taro from '@tarojs/taro'
import { AtTabBar }  from 'taro-ui'

const pages = [
  '/index/index',
  '/order/order',
  '/cart/cart',
  '/user/user'
];

export default class Tabbar extends Taro.Component<any, any> {
  constructor () {
    super(...arguments)
    this.state = {
      current: 0
    }
  }

  handleClick (value) {
    Taro.navigateTo({
      url: `/pages${pages[value]}`
    });
    this.setState({
      current: value
    })
  }
  render () {
    return (
      <AtTabBar
        fixed={true}
        tabList={[
          { 
            title: '首页', 
            image: '//net.huanmusic.com/scarbar-c/icon_nav_home.png', 
            selectedImage: '//net.huanmusic.com/scarbar-c/icon_nav_home_selected.png', 
          },
          { 
            title: '订单', 
            image: '//net.huanmusic.com/scarbar-c/icon_nav_order.png', 
            selectedImage: '//net.huanmusic.com/scarbar-c/icon_nav_order_selected.png', 
          },
          { 
            title: '购物车', 
            image: '//net.huanmusic.com/scarbar-c/icon_nav_cart.png', 
            selectedImage: '//net.huanmusic.com/scarbar-c/icon_nav_cart_selected.png', 
            text: `10`
          },
          { 
            title: '我的', 
            image: '//net.huanmusic.com/scarbar-c/icon_nav_mine.png', 
            selectedImage: '//net.huanmusic.com/scarbar-c/icon_nav_mine_selected.png',
          },
        ]}
        onClick={this.handleClick.bind(this)}
        current={this.state.current}
      />
    )
  }
}