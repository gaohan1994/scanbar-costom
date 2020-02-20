import Taro, { Config } from '@tarojs/taro'
import { View, ScrollView, Image, Text } from '@tarojs/components'
import TabsSwitch from '../../component/tabs/tabs.switch';
import classnames from 'classnames';
import './index.less'
import { AtButton } from 'taro-ui';
import { OrderInterface, ResponseCode } from '../../constants';
import { OrderAction } from '../../actions';
import invariant from 'invariant';
import { getOrderList, getOrderListTotal, getOrderCount } from '../../reducers/app.order';
import { connect } from '@tarojs/redux';
import numeral from 'numeral';
import OrderItem from '../../component/order/order';
import "../style/product.less";

const cssPrefix = 'order';

let pageNum: number = 1;
const pageSize: number = 20;



interface Props {
  orderList: OrderInterface.OrderDetail[];
  orderListTotal: number;
  orderCount: OrderInterface.OrderCount;
}

interface State {
  currentType: number;
}
class Order extends Taro.Component<Props, State> {
  state = {
    currentType: 0
  }

  config: Config = {
    navigationBarTitleText: '订单'
  }

  componentDidMount() {
    this.init();
  }

  public onChangeTab = (tabNum: number) => {
    this.setState({
      currentType: tabNum
    }, () => {
      this.fetchOrder(1);
    });
  }

  public onOrderPress = (order: any) => {
    console.log('test fff', order);
    // Taro.navigateTo({
    //   url: `/pages/order/order.detail?id=${order.orderNo}`
    //   // url: `/pages/order/order.detail`
    // });
  }

  public init = async () => {
    pageNum = 1;
    OrderAction.orderList({ pageNum: pageNum++, pageSize });
    OrderAction.orderCount();
  }

  public getFetchType = () => {
    const { currentType } = this.state;
    switch (currentType) {
      case 0:
        return {};
      case 1:
        return {
          transFlag: 0,
          transType: 0,
        }
      case 2:
        return {
          transFlag: 4,
          transType: 0,
          deliveryType: 1
        }
      case 3:
        return {
          transFlag: 4,
          transType: 0,
          deliveryType: 0
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

  render() {
    const { orderList, orderListTotal } = this.props;
    const hasMore = orderList.length < orderListTotal;
    return (
      <View className={`container ${cssPrefix}`}>
        <View className={`${cssPrefix}-tabs`}>
          {this.renderTabs()}
        </View>
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
            orderList.length > 0
              ? orderList.map((item: any) => {
                return (
                  <View className={`${cssPrefix}-scrollview-item`} key={item.orderNo}>
                    <OrderItem data={item} />
                  </View>
                )
              })
              : (
                <View className={`product-suspension order-list-empty`}>
                  <Image src="//net.huanmusic.com/weapp/img_kong.png" className={`product-suspension-image`} />
                  <Text className={`product-suspension-text`}>暂无内容</Text>
                </View>
              )
          }

          {!hasMore && orderList.length > 0 && (
            <View className={`${cssPrefix}-scrollview-bottom`}>已经到底了</View>
          )}
        </ScrollView>

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
    ]
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
});

export default connect(select)(Order);