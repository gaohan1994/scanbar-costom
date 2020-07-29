/**
 * @param {http://localhost:3000/list} 
 */
import Taro, { Config } from '@tarojs/taro'
import { View, Button} from '@tarojs/components'
import './index.less';
import { ResponseCode } from '../../constants';
import { UserAction } from '../../actions';
import { getUserinfo } from '../../reducers/app.user';
import { connect } from '@tarojs/redux';
import { Dispatch } from 'redux';
const BlockchainBdPrefix = 'jxc-h5-top';

interface Props {
    dispatch: Dispatch;
    userinfo: any;
}
interface State {
  entry: any;
  param: any;
  id: any;
}
class TopUp extends Taro.Component<Props, State> {
  interval: any;
  constructor (props: Props) {
    super(props);
    this.state = {
      entry: 'nolmal', 
      param: {},
      id: ''
    };
  }
  config: Config = {
    navigationBarTitleText: '充值失败'
    }
  public componentDidMount = () => {
      const { entry, param, id } = this.$router.params;
      this.setState({ entry, id, param: JSON.parse(param) })
  }
  public navTo = (url: string, needLogin: boolean) => {
    if (needLogin) {
        const { userinfo } = this.props;
        if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
            Taro.navigateTo({ url: '/pages/login/login.userinfo' })
            return;
        }
        if ((userinfo.phone === undefined || userinfo.phone.length === 0)) {
            Taro.navigateTo({ url: '/pages/login/login' })
            return;
        };
    }
    Taro.navigateTo({ url: url })
  }
  async pay () {
    const {param} = this.state;
    console.log(param, 'param')
    const result: any = await UserAction.cashierStore(param);
    if (result.code === ResponseCode.success) {
      return new Promise((resolve) => {
          if(process.env.TARO_ENV === 'h5'){
              const data = result.data;
              const url = data.codeUrl.replace('-app', '-customer')
              window.location.href = url;
          } else {
              const payload = JSON.parse(result.data.result.param);
              delete payload.appId;
              const paymentPayload = {
                  ...payload,
                  success: (res) => {
                      resolve(res)
                      Taro.showToast({
                        title: '充值成功',
                        icon: 'success',
                        duration: 2000
                      })
                  },
                  fail: (error) => {
                      resolve(error)
                      Taro.showToast({
                        title: '充值失败',
                        icon: 'none',
                        duration: 2000
                      })
                  }
              };
              Taro.requestPayment(paymentPayload);
          }
      })
    }
  }
  public render() {
    const {id} = this.state;
    return (
      <View className={BlockchainBdPrefix}>
        
        <View className={`${BlockchainBdPrefix}-error`}/>
        <View className={`${BlockchainBdPrefix}-error-message`}>
          <View>sorry~ </View>
          <View>微信充值失败</View>
        </View>
        <View>
          <View className={`${BlockchainBdPrefix}-error-buttons`}>
            <Button className={`${BlockchainBdPrefix}-error-buttons-btn`} onClick={this.pay}>重新充值</Button>
          </View>
          <View className={`${BlockchainBdPrefix}-error-buttons`}>
            <Button className={`${BlockchainBdPrefix}-error-buttons-nobal`} onClick={() => {
              if(this.state.entry === 'nolmal'){
                Taro.navigateBack({delta: 1});
              } else {
                Taro.switchTab({
                  url: '/pages/orderList/order'
                })
                setTimeout(() => {
                  Taro.navigateTo({
                    url: `/pages/order/order.detail?id=${id}`
                  });
                }, 500)
              }
            }}>返回</Button>
          </View>
        </View>
      </View>
    );
  }
}
const select = (state: any) => ({
  userinfo: getUserinfo(state),
});

export default connect(select)(TopUp);