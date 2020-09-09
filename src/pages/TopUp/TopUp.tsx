/**
 * @param {http://localhost:3000/list} 
 */
import Taro, { Config } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import './index.less';
import { ResponseCode } from '../../constants';
import { UserAction } from '../../actions';
import { getUserinfo, getMemberInfo, getRechangeRule } from '../../reducers/app.user';
import { connect } from '@tarojs/redux';
import numeral from 'numeral';
import img_jine from '../../assets/img_jine.png';
import { Dispatch } from 'redux';

const BlockchainBdPrefix = 'jxc-h5-top';

interface Props {
    dispatch: Dispatch;
    userinfo: any;
    rechangeRule: any;
    memberInfo: any;
}
interface State {
    key: any;
    id: any;
    entry: any;
}
class TopUp extends Taro.Component<Props, State> {
  interval: any;
  constructor (props: Props) {
    super(props);
    this.state = {
      key: {},
      id: '',
      entry: ''
    };
  }
  config: Config = {
    navigationBarTitleText: '会员充值'
    }
  public componentDidMount = () => {
    this.init(this);
    const { id, entry } = this.$router.params;
    this.setState({ id, entry})
  }
  async init(self) {
    const { dispatch } = self.props;
    UserAction.getMemberInfo(dispatch);
    const result: any = await UserAction.getRechargeRule(dispatch);
    if(result && result.data && result.data[0]) {
      self.setState({
        key: result.data[0]
      })
    }
  }
  async store () {
    const {key, entry, id} = this.state;
    const {init} = this;
    const self = this;
    const param = {
      "authCode": "",
      "payType": process.env.TARO_ENV === 'weapp' ? 8 : 2,
      "rechargeRuleId": key.id,
      "totalAmount": key.faceValue,
      "transAmount": key.sellingPrice,
      "orderSource": process.env.TARO_ENV === 'weapp' ? 3 : 6,
    };
    const result: any = await UserAction.cashierStore(param);
    if (result.code === ResponseCode.success) {
      return new Promise((resolve) => {
          if(process.env.TARO_ENV === 'h5'){
              const data = result.data;
              const url = data.codeUrl.replace('-app', '-customer')
              window.location.href = url;
          } else {
              const payload = JSON.parse(result.data.param);
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
                      init(self);
                  },
                  fail: (error) => {
                      resolve(error)
                      Taro.navigateTo({url: `Error?id=${id}&entry=${entry}&param=${JSON.stringify(param)}`})
                  }
              };
              Taro.requestPayment(paymentPayload);
          }
      })
    }
    
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
  public render() {
    const {rechangeRule, memberInfo} = this.props;
    const {key} = this.state;
    return (
      <View className={BlockchainBdPrefix}>
        <View className={`${BlockchainBdPrefix}-bg`}>
          <View className={`${BlockchainBdPrefix}-bg-title`}>
            <Image className={`${BlockchainBdPrefix}-bg-title-img`} src={'//net.huanmusic.com/weapp/icon_topup.png'} />
            
            <View className={`${BlockchainBdPrefix}-bg-title-money`}>
              ￥{memberInfo&&memberInfo.overage ? numeral(memberInfo.overage).format('0.00') : '0.00'}
            </View>
            <View className={`${BlockchainBdPrefix}-bg-title-name`}>
              储值余额
            </View>
          </View>
          <View className={`${BlockchainBdPrefix}-bg-logo`} onClick={() => { this.navTo('/pages/TopUp/ChangeDetails', true) }}>
            <Image  className={`${BlockchainBdPrefix}-bg-logo-img`} src={'//net.huanmusic.com/weapp/icon_change_details.png'}/>
          </View>
        </View>
        <View className={`${BlockchainBdPrefix}-content`}>
          {
            rechangeRule.length > 0 ? (
              <View className='at-row at-row--wrap' >
                  {
                    rechangeRule.map((val) => {
                      return (
                          <View onClick={() => {this.setState({key: val}); }} className='at-col at-col-6'>
                          <View className={`${BlockchainBdPrefix}-content-item ${val.id === key.id ? `${BlockchainBdPrefix}-content-item-true` : ''}`}>
                            <View className={`${BlockchainBdPrefix}-content-item-sell ${val.faceValue !== val.sellingPrice ? `${BlockchainBdPrefix}-content-item-money-border` : `${BlockchainBdPrefix}-content-item-sell-border`}`}>{val.faceValue}元</View>
                            {val.faceValue !== val.sellingPrice  ? (<View className={`${BlockchainBdPrefix}-content-item-money`}>售价{val.sellingPrice}元</View>) : null}
                            
                          </View>
                          </View>
                      );
                    })
                  }
              </View>
            ) : (
              <View className='at-row at-row--wrap' >
                <Image className={`${BlockchainBdPrefix}-empty`} src={img_jine} />
                <View className={`${BlockchainBdPrefix}-empty-text`}>商户暂未设置充值金额</View>
                <View className={`${BlockchainBdPrefix}-empty-text`}>请联系商户</View>
              </View>
            )
          }
        
        </View>
        {
          rechangeRule.length > 0  ? (
            <View className={`${BlockchainBdPrefix}-buttons`} style={rechangeRule.length > 6 ? {position: 'relative'} : {}}>
                <Button className={`${BlockchainBdPrefix}-buttons-btn`} onClick={this.store}>立即充值</Button>
            </View>
          ) : null
        }
       
      </View>
    );
  }
}
const select = (state: any) => ({
  userinfo: getUserinfo(state),
  memberInfo: getMemberInfo(state),
  rechangeRule: getRechangeRule(state),
});

export default connect(select)(TopUp);