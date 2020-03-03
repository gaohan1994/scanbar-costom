import Taro, { Config } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import TabsSwitch from '../../component/tabs/tabs.switch';
import './index.less'
import { OrderInterface, ResponseCode } from '../../constants';
import { OrderAction } from '../../actions';
import invariant from 'invariant';
import { getOrderList, getOrderListTotal, getOrderCount, getOrderAllStatus } from '../../reducers/app.order';
import { connect } from '@tarojs/redux';
import OrderItem from '../../component/order/order';
import "../style/product.less";
import Empty from '../../component/empty';
import GetUserinfoModal from '../../component/login/login.userinfo';
import LoginModal from '../../component/login/login.modal';
import { LoginManager } from '../../common/sdk';

const cssPrefix = 'order';

let pageNum: number = 1;
const pageSize: number = 20;



interface Props {
  orderList: OrderInterface.OrderDetail[];
  orderListTotal: number;
  orderCount: OrderInterface.OrderCount;
  orderAllStatus: any[];
}

interface State {
  currentType: number;
  getUserinfoModal: boolean;
  loginModal: boolean;
}
class Order extends Taro.Component<Props, State> {
  state = {
    currentType: 0,
    getUserinfoModal: false,
    loginModal: false
  }

  config: Config = {
    navigationBarTitleText: '订单',
  }

  async componentDidShow() {
    const { orderAllStatus } = this.props;
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

    this.init();
  }

  // componentDidMount() {
  //   this.init();
  // }

  public onChangeTab = (tabNum: number) => {
    this.setState({
      currentType: tabNum
    }, () => {
      this.fetchOrder(1);
      OrderAction.orderCount();
    });
  }

  public init = async () => {
    pageNum = 1;
    OrderAction.orderList({ pageNum: pageNum++, pageSize, ...this.getFetchType() });
    OrderAction.orderCount();
  }

  public getFetchType = () => {
    const { currentType } = this.state;
    switch (currentType) {
      case 0:
        return {};
      case 1:
        return {
          transFlags: 0
        }
      case 2:
        return {
          transFlags: '10,12,3,4'
        }
      case 3:
        return {
          transFlags: 11
        }
      default:
        return {};
    }
  }

  public fetchOrder = async (page?: number) => {
    try {
      let payload: OrderInterface.OrderListFetchFidle = {
        pageNum: typeof page === 'number' ? page : pageNum,
        pageSize: 20,
        ...this.getFetchType()
      };

      const result = await OrderAction.orderList(payload);
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      if (typeof page === 'number') {
        pageNum = page;
      } else {
        pageNum += 1;
      }
    } catch (error) {
      Taro.showToast({
        title: error.message,
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

  render() {
    const { orderList, orderListTotal, orderAllStatus} = this.props;
    const hasMore = orderList.length < orderListTotal;
    const { getUserinfoModal, loginModal } = this.state;
    return (
      <View className={`container ${cssPrefix}`}>
        <View className={`${cssPrefix}-tabs`}>
          {this.renderTabs()}
        </View>
        {
          orderList && orderList.length > 0
            ? (
              <ScrollView
                scrollY={true}
                className={`${cssPrefix}-scrollview`}
                onScrollToLower={() => {
                  if (hasMore) {
                    this.fetchOrder();
                  }
                }}
              >
                {
                  orderList.map((item: any) => {
                    return (
                      <View className={`${cssPrefix}-scrollview-item`} key={item.orderNo}>
                        <OrderItem data={item} orderAllStatus={orderAllStatus}/>
                      </View>
                    )
                  })
                }

                {!hasMore && orderList.length > 0 && (
                  <View className={`${cssPrefix}-scrollview-bottom`}>已经到底了</View>
                )}
              </ScrollView>
            )
            : (
              <Empty
                img='//net.huanmusic.com/img_order_empty.png'
                text='还没有订单，快去选购吧'
                button={{
                  title: '去选购',
                  onClick: () => {
                    Taro.switchTab({
                      url: `/pages/index/index`
                    })
                  }
                }}
              />
            )
        }

        <GetUserinfoModal isOpen={getUserinfoModal} onCancle={() => { this.setState({ getUserinfoModal: false }) }} callback={(userinfo: any) => this.getPhoneNumber(userinfo)} />
        <LoginModal isOpen={loginModal} onCancle={() => { this.setState({ loginModal: false }) }} />

      </View>
    )
  }

  private renderTabs = () => {
    const { currentType } = this.state;
    const { orderCount } = this.props;
    const orderTypes = [
      {
        title: '全部'
      },
      {
        title: '待支付',
        num: orderCount.initNum || 0,
      },
      {
        title: '待收货',
        num: orderCount.inTransNum || 0,
      },
      {
        title: '待自提',
        num: orderCount.waitForReceiptNum || 0,
      },
    ];
    return (
      <TabsSwitch
        current={currentType}
        tabs={orderTypes}
        onChangeTab={this.onChangeTab}
      />
    )

  }
}

const select = (state: any) => ({
  orderList: getOrderList(state),
  orderListTotal: getOrderListTotal(state),
  orderCount: getOrderCount(state),
  orderAllStatus: getOrderAllStatus(state)
});

export default connect(select)(Order);