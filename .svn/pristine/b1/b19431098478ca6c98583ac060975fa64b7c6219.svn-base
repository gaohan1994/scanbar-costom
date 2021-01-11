import Taro, { Config } from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { OrderInterface, ResponseCode } from '../../constants';
import orderAction from '../../actions/order.action';
import { AppReducer } from '../../reducers';
import { connect } from '@tarojs/redux';
import { getOrderDetail } from '../../reducers/app.order';
import './index.less';
import { AtTimeline } from 'taro-ui';
import classnames from 'classnames';
import ProductRefundListView from '../../component/product/product.refund.listview';
import numeral from 'numeral';
import TabsSwitch from '../../component/tabs/tabs.switch';
import icon_order_refund from '../../assets/icon_order_refund.png';

interface Props {
  orderDetail: OrderInterface.OrderDetail;
}

interface State {
  currentTab: number;
  tabs: any[];
}

const cssPrefix = 'order-refund-schedule';
const detailCssPrefix = 'order-detail'

class OrderRefundSchedule extends Taro.Component<Props, State> {
  config: Config = {
    navigationBarTitleText: '退货进度'
  }

  state = {
    currentTab: 0,
    tabs: [] as any,
  }

  async componentDidMount() {
    const { currentTab } = this.state;
    const { orderDetail } = this.props;
    const { refundOrderList } = orderDetail;

    let tabs: any[] = [];
    if(refundOrderList){
      const index =  refundOrderList.length <= 3 ? refundOrderList.length : 3;
      for (let i = 0; i < index; i++) {
        // const title = i === 0 ? '第一次' : i === 1 ? '第二次' : '第三次';
        let title = '第一次';
        if (index === 3) {
          title = i === 0 ? '第三次' : i === 1 ? '第二次' : '第一次';
        } else if (index === 2) {
          title = i === 1 ? '第一次' : '第二次';
        }
        tabs.push({
          title: title,
          orderNo: refundOrderList[i].orderNo
        });
      }
    }
    

    const res = await orderAction.orderRefundDetail({ orderNo: tabs[0].orderNo });
    if (res.code === ResponseCode.success) {
      const newTab = { ...tabs[currentTab], refundOrder: res.data };
      tabs[currentTab] = newTab;
      this.setState({ tabs });
    } else {
      Taro.showToast({
        title: res.msg || '获取商品列表失败'
      })
    }
  }

  public onChangeTab = async (tabNum: number) => {
    const { tabs } = this.state;
    const { orderDetail } = this.props;
    const { refundOrderList } = orderDetail;
    if (tabs[tabNum].refundOrder === undefined) {
      const res = await orderAction.orderRefundDetail({ orderNo: refundOrderList[tabNum].orderNo });
      if (res.code === ResponseCode.success) {
        const newTab = { ...tabs[tabNum], refundOrder: res.data };
        tabs[tabNum] = newTab;
        this.setState({ tabs });
      } else {
        Taro.showToast({
          title: res.msg || '获取商品列表失败'
        })
      }
    }

    this.setState({
      currentTab: tabNum,
      tabs: tabs
    })
  }

  public grtOrderRefundIndices = () => {
    const { currentTab } = this.state;
    const { orderDetail } = this.props;
    const { orderRefundIndices, refundOrderList, order } = orderDetail;

    if (orderRefundIndices === undefined || orderRefundIndices.length === 0) {
      return [];
    }
    const orderRefundIndicesItem = orderRefundIndices[currentTab];
    let items: any[] = [];
    console.log(orderRefundIndicesItem, 'orderRefundIndicesItem', orderRefundIndicesItem.clinchTime, orderDetail);
    if (orderRefundIndicesItem.clinchTime && orderRefundIndicesItem.clinchTime.length > 0) {
      let title = orderRefundIndicesItem.transFlag === 6
        ? '商家拒绝您的退货申请'
        : orderRefundIndicesItem.transFlag === 9
          ? '您撤销了退货申请'
          : '成功退货';

      if(refundOrderList) {
        const refundOrderListItem : any = refundOrderList[currentTab];
        if (refundOrderListItem.afterSaleStatus === 3) {
          title = '您撤销了退货申请';
        }
        if (refundOrderListItem.afterSaleStatus === 2) {
          title = '您撤销了取消申请';
        }
        if (refundOrderListItem.afterSaleStatus === 5 && order.deliveryStatus === 1 || order.refundStatus === 0 && order.deliveryStatus === 2 ) {
          title = '商家拒绝您的取消订单申请';
        }
        if (refundOrderListItem.afterSaleStatus === 5 && order.deliveryStatus === 3 || order.refundStatus === 0 && order.deliveryStatus === 2 && order.afterSaleStatus === 5) {
          title = '商家拒绝您的退货申请';
        }
        if (refundOrderListItem.afterSaleStatus === 6) {
          title = '成功退货';
        }
      } else {
        if (order.afterSaleStatus === 3) {
          title = '您撤销了退货申请';
        }
        if (order.afterSaleStatus === 2) {
          title = '您撤销了取消申请';
        }
        if (order.afterSaleStatus === 5 && order.deliveryStatus === 1 
          || order.refundStatus === 0 && order.deliveryStatus === 2
          || order.afterSaleStatus === 5 && order.deliveryStatus === 0) {
          title = '商家拒绝您的取消订单申请';
        }
        if (order.afterSaleStatus === 5 && order.deliveryStatus === 3 || order.refundStatus === 0 && order.deliveryStatus === 2 && order.afterSaleStatus === 5) {
          title = '商家拒绝您的退货申请';
        }
        if (order.afterSaleStatus === 6) {
          title = '成功退货';
        }
      }
      if(refundOrderList && refundOrderList.length > 1 && title === '成功退货' && currentTab !== 0){
        title = '商家拒绝您的退货申请';
      }
      items.push({
        title: title,
        content: [orderRefundIndicesItem.clinchTime],
        icon: 'check-circle'
      })
    }
    if (orderRefundIndicesItem.refundingTime && orderRefundIndicesItem.refundingTime.length > 0) {
      items.push({
        title: '商家同意退货，请尽快将商品退回',
        content: [orderRefundIndicesItem.refundingTime],
        icon: 'check-circle'
      })
    }
    if (orderRefundIndicesItem.createTime && orderRefundIndicesItem.createTime.length > 0) {
      items.push({
        title: '等待商家处理',
        content: [orderRefundIndicesItem.createTime],
        icon: 'check-circle'
      })
    }
    console.log('items', items);
    return items;
  }

  render() {
    const { tabs } = this.state;
    return (
      <View className={`container order`}>
        {/* <View className={`${detailCssPrefix}-bg`} /> */}
        {
          tabs && tabs.length > 1 && (
            <View className={`order-tabs`}>
              {this.renderTabs()}
            </View>
          )
        }
        <ScrollView
          className={`${detailCssPrefix}-container ${cssPrefix}-container`}
          scrollY={true}
        >
          {this.renderSchedule()}
          {this.renderInfo()}
          <View style={{ margin: '10px auto', width: '93.3%'}}>
            {this.renderRefundProductList()}
          </View>
        </ScrollView>

      </View>
    )
  }

  private renderTabs = () => {
    const { currentTab, tabs } = this.state;

    return (
      <TabsSwitch
        current={currentTab}
        tabs={tabs}
        onChangeTab={this.onChangeTab}
      />
    )
  }

  private renderSchedule = () => {
    const items = this.grtOrderRefundIndices();
    return (
      <View className={`${detailCssPrefix}-card ${cssPrefix}-schedule`}>
        <AtTimeline
          pending
          items={items}
          className={process.env.TARO_ENV === 'h5' ? `${detailCssPrefix}-card-AtTimeline` : ''}
        >
        </AtTimeline>
      </View>
    )
  }

  private renderInfo = () => {
    const { currentTab } = this.state;
    const { orderDetail } = this.props;
    const { refundOrderList } = orderDetail;
    if (refundOrderList === undefined || refundOrderList.length === 0) {
      return <View />;
    }
    return (
      <View className={`${detailCssPrefix}-card ${detailCssPrefix}-card-logistics`}>
        <View className={`${detailCssPrefix}-card-logistics-item`}>
          <Image
            // src='//net.huanmusic.com/scanbar-c/v2/icon_order_note.png'
            src={icon_order_refund}
            className={`${detailCssPrefix}-card-logistics-item-img`}
          />

          <View className={`${detailCssPrefix}-card-logistics-item-info`}>
            <Text className={`${detailCssPrefix}-card-logistics-item-info-title`}>
              申请退货原因
            </Text>
            <Text className={`${detailCssPrefix}-card-logistics-item-info-content`}>
              {refundOrderList[currentTab].remark || '无'}
            </Text>
          </View>
        </View>

        <View
          className={classnames(
            `${detailCssPrefix}-card-logistics-item`,
            {
              [`${detailCssPrefix}-card-logistics-item-margin`]: true,
            })}
        >
          <Image
            src='//net.huanmusic.com/scanbar-c/v2/icon_order_money.png'
            className={`${detailCssPrefix}-card-logistics-item-img`}
          />
          <View className={`${detailCssPrefix}-card-logistics-item-info`}>
            <Text className={`${detailCssPrefix}-card-logistics-item-info-title`}>
              退货金额
            </Text>
            <Text className={`${detailCssPrefix}-card-logistics-item-info-price`}>
              ¥{numeral(refundOrderList[currentTab].transAmount || 0).format('0.00')}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  private renderRefundProductList = () => {
    const { tabs, currentTab } = this.state;
    if (tabs && tabs.length > 0 && tabs[currentTab].refundOrder) {
      return (
        <ProductRefundListView
          currentRefundOrder={tabs[currentTab].refundOrder}
        />
      )
    }
    return <View />;


  }
}

const select = (state: AppReducer.AppState) => ({
  orderDetail: getOrderDetail(state),
});


export default connect(select)(OrderRefundSchedule);