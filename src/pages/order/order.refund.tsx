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
import ProductComponent from './component/product';
import { OrderAction } from '../../actions';
import numeral from 'numeral';
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
  remarkTxt: any;
  refundProductList: any[];
}

const cssPrefix = 'order-refund';

class OrderRefund extends Taro.Component<Props, State> {
  config: Config = {
    navigationBarTitleText: '退货'
  }

  state = {
    remark: '',
    isOpen: false,
    selectedNum: -1,
    remarkTxt: '',
    refundProductList: [] as any,
  }

  public orderRefund = async () => {
    const { remark, refundProductList, remarkTxt } = this.state;
    if (remarkTxt.length === 0 && refundProductList === 0 ) {
      return;
    }
    Taro.showLoading();
    const { orderDetail, currentType, dispatch } = this.props;
    const { order } = orderDetail;
    let productInfoList: OrderInterface.RefundOrderProductItem[] = [];
    let transAmount = 0;
    if (refundProductList) {
      for (let i = 0; i < refundProductList.length; i++) {
        productInfoList.push({
          changeNumber: refundProductList[i].changeNumber,
          orderDetailId: refundProductList[i].id
        });
        transAmount += refundProductList[i].changeNumber * refundProductList[i].unitPrice;
      }
    }
    const payload = {
      order: {
        orderNo: order.orderNo,
        orderSource: order.orderSource,
        transAmount: transAmount,
        refundByPreOrder: true,
        remark: `${remarkTxt}；${remark}`
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

  public getTotalAmount = (): number => {
    const { refundProductList } = this.state;
    let transAmount = 0;
    if (refundProductList) {
      for (let i = 0; i < refundProductList.length; i++) {
        transAmount += refundProductList[i].changeNumber * refundProductList[i].unitPrice;
      }
    }
    return transAmount;
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
      remarkTxt: item
    });
    this.hideModal();
  }

  public onSelectAll = () => {
    const token = this.allSellected();
    if (token === false) {
      const { orderDetail } = this.props;
      const { orderDetailList } = orderDetail;
      let productInfoList: any[] = [];
      if (orderDetailList) {
        for (let i = 0; i < orderDetailList.length; i++) {
          if(orderDetailList[i].ableRefundNum > 0){
            productInfoList.push({
              changeNumber: orderDetailList[i].num,
              orderDetailId: orderDetailList[i].id,
              ...orderDetailList[i]
            })
          }
          
        }
      }
      this.setState({
        refundProductList: productInfoList
      });
    } else {
      this.setState({
        refundProductList: []
      });
    }
  }

  public allSellected() {
    const { refundProductList } = this.state;
    const { orderDetail } = this.props;
    const { orderDetailList } = orderDetail;
    if (!orderDetailList) {
      return false;
    }

    if (refundProductList.length !== orderDetailList.length) {
      return false;
    }

    let token = true;
    refundProductList.forEach((item: any) => {
      if (item.changeNumber !== item.num) {
        token = false;
      }
    });
    return token;
  }

  getRefundProduct = (product: any) => {
    const { refundProductList } = this.state;
    if (refundProductList.length === 0) {
      return {};
    }
    let refundProduct = {};
    for (let i = 0; i < refundProductList.length; i++) {
      if (product.id === refundProductList[i].id) {
        refundProduct = refundProductList[i];
        return refundProduct;
      }
    }
    return refundProduct;
  }

  manageRefundProductList = (type: string, product: any) => {
    const { refundProductList } = this.state;
    if (type === 'ADD') {
      let token = false;
      for (let i = 0; i < refundProductList.length; i++) {
        if (refundProductList[i].id === product.id) {
          token = true;
          if (refundProductList[i].changeNumber === product.num) {
            Taro.showToast({
              title: '不可再添加了'
            });
            return;
          }
          refundProductList[i].changeNumber += 1;
        }
      }
      if (token === false) {
        refundProductList.push({
          changeNumber: 1,
          orderDetailId: product.id,
          ...product
        })
      }
      this.setState({
        refundProductList
      });
    } else if (type === 'REDUCE') {
      for (let i = 0; i < refundProductList.length; i++) {
        if (refundProductList[i].id === product.id) {
          if (refundProductList[i].changeNumber === 1) {
            if (refundProductList.length > 0) {
              refundProductList.splice(i, 1)
            }
            this.setState({ refundProductList: refundProductList });
          } else {
            refundProductList[i].changeNumber -= 1;
            this.setState({
              refundProductList
            });
          }
        }
      }
    }
  }

  render() {
    const { remark, refundProductList } = this.state;
    return (
      <View className={`${cssPrefix}`}>
        <View className={`${cssPrefix}-header`}>
          <Text className={`${cssPrefix}-header-title`}>退货原因</Text>
          <View className={`${cssPrefix}-header-right`} onClick={this.showModal}>
            <Text className={`${cssPrefix}-header-right-text`}>{this.state.remarkTxt ? this.state.remarkTxt : '请选择（必须）'}</Text>
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
            placeholder='请输入退货说明'
            maxlength={50}
          />

          <View className={`${cssPrefix}-input-corner`}>
            {`${remark.length}/50`}
          </View>
        </View>
        {this.renderProductList()}
        <View className={`${cssPrefix}-footer`}>
          <Text className={`${cssPrefix}-footer-price`}>
            <Text>￥</Text>
            <Text className={`${cssPrefix}-footer-price-integer`}>{numeral(this.getTotalAmount()).format('0.00').split('.')[0]}</Text>
            <Text>{`.${numeral(this.getTotalAmount()).format('0.00').split('.')[1]}`}</Text>
          </Text>
          <AtButton
            disabled={this.state.remarkTxt.length === 0 || refundProductList.length === 0}
            className={classnames(`${cssPrefix}-footer-button-little`, {
              [`theme-button`]: true,
              ['h5-button-refund']: process.env.TARO_ENV === 'h5' ? true : false,
              [`theme-button-cancel`]: this.state.remarkTxt.length === 0 || refundProductList.length === 0,
            })}
            onClick={() => { this.orderRefund() }}
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
      '商品与描述不符',
      '商品有质量问题',
      '少发/漏发',
      '包装/商品破损',
      '卖家发错货',
      '没收到货',
    ];
    return (
      <AtFloatLayout
        isOpened={isOpen}
        title={'退货原因'}
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

  renderProductList = () => {
    const { orderDetail } = this.props;
    const { orderDetailList } = orderDetail;
    return (
      <View className={`${cssPrefix}-list`}>
        <View className={`${cssPrefix}-header`}>
          <Text className={`${cssPrefix}-header-title`}>退货商品</Text>
          <View className={`${cssPrefix}-header-right`} onClick={this.onSelectAll}>
            {!this.allSellected() ? (
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
            <Text className={`${cssPrefix}-header-right-select`}>全选</Text>
          </View>
        </View>
        {
          orderDetailList && orderDetailList.length > 0 && orderDetailList.map((product, index) => {
            const refundProduct = this.getRefundProduct(product);

            return (
              product.ableRefundNum > 0
                ? (
                  <ProductComponent
                    key={product.productId}
                    product={product}
                    onContentClick={() => { }}
                    border={index !== (orderDetailList.length - 1)}
                    refundProduct={refundProduct}
                    manageRefundProductList={this.manageRefundProductList}
                  />
                )
                : (<View />)
            )
          })
        }

      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => ({
  orderDetail: getOrderDetail(state),
  currentType: getCurrentType(state),
});


export default connect(select)(OrderRefund);