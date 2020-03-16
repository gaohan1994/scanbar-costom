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
    const index = refundOrderList.length <= 3 ? refundOrderList.length : 3;
    for (let i = 0; i < index; i++) {
      const title = i === 0 ? '第一次' : i === 1 ? '第二次' : '第三次';
      tabs.push({
        title: title,
      })
    }

    const res = await orderAction.orderRefundDetail({ orderNo: refundOrderList[currentTab].orderNo });
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
    const { orderRefundIndices } = orderDetail;
    
    const orderRefundIndicesItem = orderRefundIndices[currentTab];
    let items: any[] = [];
    if (orderRefundIndicesItem.clinchTime && orderRefundIndicesItem.clinchTime.length > 0) {
      const title = orderRefundIndicesItem.transFlag === 6 
        ? '商家拒绝您的退货申请' 
        : orderRefundIndicesItem.transFlag === 9
          ? '您撤销了退货申请'
          : '成功退货';
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
    return items;
  }

  render() {
    return (
      <View className={`container order`}>
        <View className={`${detailCssPrefix}-bg`} />
        {/* <View className={`${cssPrefix}-tabs`}>
          {this.renderTabs()}
        </View> */}
        <ScrollView className={`${detailCssPrefix}-container`} scrollY={true}>
          {this.renderSchedule()}
          {this.renderInfo()}
          {this.renderRefundProductList()}
        </ScrollView>

      </View>
    )
  }

  private renderTabs = () => {
    const { currentTab, tabs } = this.state;
    
    // const orderTypes = [
    //   {
    //     title: '第一次'
    //   },
    //   {
    //     title: '第二次',
    //   },
    //   {
    //     title: '第三次',
    //   },
    // ];
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
        >
        </AtTimeline>
      </View>
    )
  }

  private renderInfo = () => {
    const { currentTab } = this.state;
    const { orderDetail } = this.props;
    const { refundOrderList } = orderDetail;
    return (
      <View className={`${detailCssPrefix}-card ${detailCssPrefix}-card-logistics`}>
        <View className={`${detailCssPrefix}-card-logistics-item`}>
          <Image
            src='//net.huanmusic.com/scanbar-c/v2/icon_order_note.png'
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
    return (
      <ProductRefundListView
        currentRefundOrder={tabs[currentTab].refundOrder}
      />
    )
  }
}

const select = (state: AppReducer.AppState) => ({
  orderDetail: getOrderDetail(state),
});


export default connect(select)(OrderRefundSchedule);