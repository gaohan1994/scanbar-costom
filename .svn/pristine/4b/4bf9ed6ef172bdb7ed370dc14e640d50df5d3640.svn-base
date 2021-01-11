import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import "../card/form.card.less";
import "../../pages/style/product.less";
import '../../styles/theme.less';
import "../cart/cart.less";
import classnames from 'classnames';
import numeral from 'numeral';
import { AppReducer } from '../../reducers';
import { connect } from '@tarojs/redux';
const cssPrefix = 'product';

type Props = {
  currentRefundOrder: any;
};

class ProductRefundListView extends Taro.Component<Props> {

  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    padding: true,
    payOrderDetail: {} as any,
  };

  render() {
    const { currentRefundOrder } = this.props;
    return (
      <View>
        <View
          className={classnames('component-form', {
            'component-form-shadow': true,
            [`${cssPrefix}-row-items`]: true
          })}
        >

          {currentRefundOrder 
          && currentRefundOrder.orderDetailList 
          && currentRefundOrder.orderDetailList.length > 0 
          && currentRefundOrder.orderDetailList.map((item) => {
            return this.renderProductItem(item)
          })
          }
          {this.renderTotal()}
        </View>
      </View>
    );
  }

  private renderProductItem = (item: any) => {
    return (
      <View
        key={item.id}
        className={classnames(`${cssPrefix}-row ${cssPrefix}-row-content`, {
        })}
      >
        <View className={`${cssPrefix}-row-box`}>
          {
            item && item.picUrl && item.picUrl.length > 0
              ? (
                <View
                  className={`${cssPrefix}-row-cover`}
                  style={`background-image: url(${item.picUrl})`}
                />
              )
              : (
                <View
                  className={`${cssPrefix}-row-cover`}
                  style={`background-image: url(${"//net.huanmusic.com/scanbar-c/v1/pic_nopicture.png"})`}
                />
              )
          }

          <View className={`${cssPrefix}-row-content ${cssPrefix}-row-content-box`}>
            <Text className={`${cssPrefix}-row-name`}>{item.productName}</Text>
            <Text className={`${cssPrefix}-row-normal`}>{`x ${item.num}`}</Text>
            <View className={`${cssPrefix}-row-corner`}>
              <View>
                <Text className={`${cssPrefix}-row-corner-price`}>￥</Text>
                <Text className={`${cssPrefix}-row-corner-big`}>{numeral(item.unitPrice).format('0.00').split('.')[0]}</Text>
                <Text className={`${cssPrefix}-row-corner-price`}>{`.${numeral(item.unitPrice).format('0.00').split('.')[1]}`}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  private renderTotal = () => {
    const { currentRefundOrder } = this.props;
    let transAmount = 0;
    if (currentRefundOrder && currentRefundOrder.order && currentRefundOrder.order.transAmount) {
      transAmount = currentRefundOrder.order.transAmount;
    }
    
    return (
      <View className={`${cssPrefix}-row-totals`}>
        <View className={`${cssPrefix}-row-content-item`}>
          <View />
          <View className={`${cssPrefix}-row-tran`}>
            <Text className={`${cssPrefix}-row-tran ${cssPrefix}-row-tran-margin`}>{`合计：`}</Text>
            <Text className={`${cssPrefix}-row-tran-price`}>￥</Text>
            <Text className={`${cssPrefix}-row-tran-price ${cssPrefix}-row-tran-big `}>{numeral(transAmount).format('0.00').split('.')[0]}</Text>
            <Text className={`${cssPrefix}-row-tran-price`}>{`.${numeral(transAmount).format('0.00').split('.')[1]}`}</Text>
          </View>
        </View>
      </View>
    )
  }
}


const select = (state: AppReducer.AppState) => {
  return {
    
  }
}
export default connect(select)(ProductRefundListView as any);