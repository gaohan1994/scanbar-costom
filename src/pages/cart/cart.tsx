
import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../style/product.less'
import ProductComponent from '../../component/product/product'
import Footer from './component/footer'
import { AppReducer } from '../../reducers'
import productSdk, { ProductCartInterface } from '../../common/sdk/product/product.sdk'
import Empty from '../../component/empty'
import { LoginManager } from '../../common/sdk'
import GetUserinfoModal from '../../component/login/login.userinfo'
import LoginModal from '../../component/login/login.modal'

type Props = {
  productCartList: ProductCartInterface.ProductCartInfo[]
}

type State = {
  getUserinfoModal: boolean;
  loginModal: boolean;
}
class Page extends Taro.Component<Props, State> {
  config: Config = {
    navigationBarTitleText: '购物车'
  }

  state = {
    getUserinfoModal: false as any,
    loginModal: false as any
  }

  async componentDidShow() {
    productSdk.refreshCartNumber();
    const result = await LoginManager.getUserInfo();
    if (result.success) {
      const userinfo = result.result;
      if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
        this.setState({ getUserinfoModal: true });
        return;
      }
      if ((!userinfo.phone || userinfo.phone.length === 0)) {
        this.setState({ loginModal: true });
        return;
      };
    } else {
      Taro.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      });
    }
  }

  getPhoneNumber = (userinfo: any) => {
    if (userinfo.phone === undefined || userinfo.phone.length === 0) {
      this.setState({
        loginModal: true
      });
    }
  }

  public beforeSubmit = async () => {
    const result = await LoginManager.getUserInfo();
    if (result.success) {
      const userinfo = result.result;
      if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
        this.setState({ getUserinfoModal: true });
        return false;
      }
      if ((!userinfo.phone || userinfo.phone.length === 0)) {
        this.setState({ loginModal: true });
        return false;
      };
    } else {
      Taro.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      });
      return false;
    }
    return true;
  }

  render() {
    const { productCartList } = this.props;
    const { getUserinfoModal, loginModal } = this.state;
    return (
      <View className='container'>
        {productCartList && productCartList.length > 0
          ? productCartList.map((item, index) => {
            return (
              <ProductComponent
                direct={true}
                key={item.id}
                product={item}
                last={index === (productCartList.length - 1)}
                isHome={false}
              />
            )
          })
          : (
            <Empty
              img='//net.huanmusic.com/scanbar-c/v1/img_cart.png'
              text='还没有商品，快去选购吧'
              button={{
                title: '去选购',
                onClick: () => {
                  Taro.switchTab({
                    url: `/pages/index/index`
                  })
                }
              }}
            />
          )}
        {productCartList && productCartList.length > 0 && (
          <Footer beforeSubmit={this.beforeSubmit} />
        )}
        <GetUserinfoModal isOpen={getUserinfoModal} onCancle={() => { this.setState({ getUserinfoModal: false }) }} callback={(userinfo: any) => this.getPhoneNumber(userinfo)} />
        <LoginModal isOpen={loginModal} onCancle={() => { this.setState({ loginModal: false }) }} />
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    productCartList: state.productSDK.productCartList
  }
}
export default connect(select)(Page);