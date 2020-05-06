import Taro, { Config } from '@tarojs/taro';
import { View, Text, Image, Textarea, ScrollView } from '@tarojs/components';
import { OrderInterface, ResponseCode } from '../../constants';
import orderAction from '../../actions/order.action';
import { AppReducer } from '../../reducers';
import { connect } from '@tarojs/redux';
import { getOrderDetail, getCurrentType } from '../../reducers/app.order';
import './index.less';
import { AtFloatLayout, AtButton } from 'taro-ui';
import classnames from 'classnames';
import { OrderAction } from '../../actions';
import { Dispatch } from 'redux';

interface Props {
  dispatch: Dispatch;
  orderDetail: OrderInterface.OrderDetail;
  currentType: number;
}

interface State {
  remark: string;
  isOpen: boolean;
  selectedNum: number;
}

const cssPrefix = 'order-refund';

class OrderCancel extends Taro.Component<Props, State> {
  config: Config = {
    navigationBarTitleText: '取消订单'
  }

  state = {
    remark: '',
    isOpen: false,
    selectedNum: -1,
  }

  public orderCancel = async () => {
    const { remark } = this.state;
    if (remark.length === 0) {
      return;
    }
    Taro.showLoading();
    const { orderDetail, currentType, dispatch } = this.props;
    const { order, orderDetailList } = orderDetail;
    let productInfoList: OrderInterface.RefundOrderProductItem[] = [];
    if (orderDetailList) {
      for (let i = 0; i < orderDetailList.length; i++) {
        productInfoList.push({
          changeNumber: orderDetailList[i].num,
          orderDetailId: orderDetailList[i].id
        })
      }
    }
    const payload = {
      order: {
        orderNo: order.orderNo,
        orderSource: order.orderSource,
        transAmount: order.transAmount,
        refundByPreOrder: true,
        remark: remark
      },
      productInfoList: productInfoList
    }
    const res = await orderAction.orderRefund(payload);
    if (res.code === ResponseCode.success) {
      Taro.showToast({
        title: '申请取消订单成功'
      });
      Taro.navigateBack();
      OrderAction.orderDetail(dispatch, { orderNo: order.orderNo });
      OrderAction.orderList(dispatch, { pageNum: 1, pageSize: 20, ...orderAction.getFetchType(currentType) });
      OrderAction.orderCount(dispatch);
    } else {
      Taro.showToast({
        title: res.msg || '申请取消订单失败',
        icon: 'none'
      });
    }
  }

  public changeRemark = (value: string) => {
    this.setState({ remark: value })
  }

  public showModal = () => {
    this.setState({ isOpen: true });
  }

  public hideModal = () => {
    this.setState({ isOpen: false });
  }

  public onSelected = (item: string, index: number) => {
    this.setState({
      selectedNum: index,
      remark: item
    });
    this.hideModal();
  }

  render() {
    const { remark } = this.state;
    return (
      <View className={`${cssPrefix}`}>
        <View className={`${cssPrefix}-header`}>
          <Text className={`${cssPrefix}-header-title`}>取消订单原因</Text>
          <View className={`${cssPrefix}-header-right`} onClick={this.showModal}>
            <Text className={`${cssPrefix}-header-right-text`}>请选择（必须）</Text>
            <Image
              className={`${cssPrefix}-header-right-icon`}
              src='//net.huanmusic.com/scanbar-c/icon_commodity_into.png'
            />
          </View>
        </View>

        <View className={`${cssPrefix}-input`}>
          <Textarea
            className={`${cssPrefix}-input-text`}
            value={remark}
            onInput={({ detail: { value } }) => this.changeRemark(value)}
            placeholder='请输入说明'
            maxlength={300}
          />

          <View className={`${cssPrefix}-input-corner`}>
            {`${remark.length}/300`}
          </View>
        </View>
        <View className={`${cssPrefix}-footer`}>
          <AtButton
            className={classnames(`${cssPrefix}-footer-button`, {
              [`theme-button`]: true,
              [`theme-button-cancel`]: remark.length === 0,
            })}
            onClick={() => { this.orderCancel() }}
          >
            <Text className="theme-button-text" >提交</Text>
          </AtButton>
        </View>
        {this.renderModal()}
      </View>
    )
  }

  renderModal() {
    const { isOpen, selectedNum } = this.state;
    const items = [
      '不想要了',
      '信息填写错误',
      '送达时间选错了',
      '买错了/买少了',
      '商家缺货',
      '商家联系我取消',
      '发货太慢',
      '骑手联系我取消'
    ];
    return (
      <AtFloatLayout
        isOpened={isOpen}
        title={'取消订单原因'}
        onClose={this.hideModal}
      >
        <View className={`${cssPrefix}-modal`}>
          <ScrollView scrollY={true} className={`${cssPrefix}-modal-list`}>
            {
              items.map((item, index) => {
                return (
                  <View className={classnames(`${cssPrefix}-modal-list-item`, {
                    [`${cssPrefix}-modal-list-item-border`]: index !== (item.length - 1)
                  })}
                    onClick={() => { this.onSelected(item, index) }}
                  >
                    <Text>{item}</Text>
                    <View
                      // onClick={() => { this.onSelected(item, index) }}
                      className={`${cssPrefix}-modal-list-item-box`}
                    >
                      {index !== selectedNum ? (
                        <View
                          className={`${cssPrefix}-modal-list-item-box-icon`}
                          style='background-image: url(//net.huanmusic.com/weapp/bt_normal.png)'
                        />
                      ) : (
                          <View
                            className={`${cssPrefix}-modal-list-item-box-icon`}
                            style='background-image: url(//net.huanmusic.com/weapp/bt_selected.png)'
                          />
                        )}
                    </View>
                  </View>
                );
              })
            }
          </ScrollView>
        </View>
      </AtFloatLayout>
    )
  }
}

const select = (state: AppReducer.AppState) => ({
  orderDetail: getOrderDetail(state),
  currentType: getCurrentType(state),
});


export default connect(select)(OrderCancel);