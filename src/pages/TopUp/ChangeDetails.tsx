
import Taro, { Config } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import Empty from '../../component/empty';
import './index.less';
import { connect } from '@tarojs/redux';
import numeral from 'numeral';
import { Dispatch } from 'redux';
import { getMemberInfo, getBalanceChange } from '../../reducers/app.user';
import { UserAction } from '../../actions';

const BlockchainBdPrefix = 'jxc-h5-change';
interface Props {
    dispatch: Dispatch;
    memberInfo: any;
    balanceChange: any;
}
interface State {
    key: any;
    pageNum: any;
    pageSize: any;
}
class ChangeDetails extends Taro.Component<Props, State> {
  config: Config = {
    navigationBarTitleText: '变动明细'
  }
  interval: any;
  constructor (props: Props) {
    super(props);
    this.state = {
      key: 1,
      pageNum: 1,
      pageSize: 20,
    };
  }

  public componentDidMount = () => {
    this.init();
  }
  init() {
    // /api/order/balanceChange/list
    console.log('getBalanceChange')
    const {dispatch} = this.props;
    const param = {
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
      orderByColumn: 'changeTime desc',
    }
    UserAction.getMemberInfo(this.props.dispatch);
    UserAction.getBalanceChange(dispatch, param)
  }
  async loadData () {
    const {dispatch} = this.props;
    const params = {
      pageSize: this.state.pageSize,
      pageNum: this.state.pageNum + 1,
      orderByColumn: 'changeTime desc',
    }
    Taro.showLoading();
    UserAction.getBalanceChangeMore(dispatch, params)
    Taro.hideLoading();
  }
  public render() {
    // const userInfo = localStorage.getItem('userInfo');
    // const user = userInfo ? JSON.parse(userInfo) : {};
    const {memberInfo, balanceChange: {rows, total} } = this.props;
    if(rows.length === 0){
      return (
        <View className={BlockchainBdPrefix}>
          <Empty
            img='//net.huanmusic.com/scanbar-c/v1/img_order.png'
            text='暂无记录'
            button={null}
          />
        </View>
      );
    }
    return (
      <View className={BlockchainBdPrefix}>
        <View className={`${BlockchainBdPrefix}-bg`}>
          <View className={`${BlockchainBdPrefix}-bg-title`}>
            <Image className={`${BlockchainBdPrefix}-bg-title-img`} src={'//net.huanmusic.com/weapp/icon_payment_chuzhi.png'} />
            
            <View className={`${BlockchainBdPrefix}-bg-title-money`}>
              ￥{memberInfo&&memberInfo.overage ? numeral(memberInfo.overage).format('0.00') : '0.00'}
            </View>
            <View className={`${BlockchainBdPrefix}-bg-title-name`}>
              储值余额
            </View>
          </View>
        </View>
        <View className={`${BlockchainBdPrefix}-content`}>
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
                            <Image className={`${BlockchainBdPrefix}-content-title-icon`} src={this.state.key === 1 ?  '//net.huanmusic.com/weapp/icon_dot_blue.png' : '//net.huanmusic.com/weapp/icon_dot_red.png'}/>
                            <View className={`${BlockchainBdPrefix}-content-title-message`} style={index === list.length - 1 ? {border: 'none'} : {}}>
                                <Image className={`${BlockchainBdPrefix}-content-title-message-img`} src={this.state.key === 1 ? '//net.huanmusic.com/weapp/icon_details_pay.png' : '//net.huanmusic.com/weapp/icon_details_income.png'}/>
                                <View className={`${BlockchainBdPrefix}-content-title-message-money`}>+{100}</View>
                                <View className={`${BlockchainBdPrefix}-content-title-message-time`}>{val.time}</View>
                            </View>
                       </View> 
                    );
                })
            }
          </ScrollView>
        </View>
       </View>
    );
  }
}
const select = (state: any) => ({
  memberInfo: getMemberInfo(state),
  balanceChange: getBalanceChange(state),
});

export default connect(select)(ChangeDetails);