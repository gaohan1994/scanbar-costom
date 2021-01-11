import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.less';
import classnames from 'classnames';
import { OrderInterface } from '../../../constants';
import numeral from 'numeral';

const cssPrefix = 'order-component-product';

type Props = {
  product: OrderInterface.OrderDetailItem;
  onContentClick: any;
  border: boolean;
  refundProduct: any;
  manageRefundProductList?: any;
};

class OrderProduct extends Taro.Component<Props> {

  public manageProduct = (type: string) => {
    const { manageRefundProductList, product } = this.props;
    manageRefundProductList(type, product);
  }

  render() {
    const { product, border } = this.props;
    return (
      <View className={classnames(`${cssPrefix}`, {
        [`${cssPrefix}-border`]: border
      })}>
        {product.picUrl && product.picUrl !== '' ? (
          <Image src={product.picUrl} className={`${cssPrefix}-image`} />
        ) : (
            <Image src="//net.huanmusic.com/weapp/empty.png" className={`${cssPrefix}-image`} />
          )}
        {this.renderDetail()}
        {this.renderStepper()}
      </View>
    );
  }

  private renderDetail = () => {
    const { product } = this.props;

    return (
      <View className={classnames(`${cssPrefix}-detail`)}>
        <View className={`${cssPrefix}-detail-title`} >
          {product.productName}
        </View>
        <View className={`${cssPrefix}-detail-box`}>
          <Text className={`${cssPrefix}-detail-price`}>
            <Text>￥</Text>
            <Text className={`${cssPrefix}-detail-price-integer`}>{numeral(product && product.unitPrice ? product.unitPrice : 0).format('0.00').split('.')[0]}</Text>
            <Text>{`.${numeral(product && product.unitPrice ? product.unitPrice : 0).format('0.00').split('.')[1]}`}</Text>
          </Text>
          <View className={`${cssPrefix}-detail-tip`}>可退x{product.ableRefundNum}</View>
        </View>
      </View>
    );
  }

  private renderStepper = () => {
    const { refundProduct } = this.props;
    return (
      <View className={`${cssPrefix}-stepper`}>
        {refundProduct && refundProduct.id ? (
          <View className={`${cssPrefix}-stepper-container`}>
            <View className={`${cssPrefix}-stepper-touch`}>
              <View
                className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-reduce`)}
                onClick={this.manageProduct.bind(this, 'REDUCE')}
              />
            </View>
            <Text className={`${cssPrefix}-stepper-text`}>{refundProduct.changeNumber}</Text>
            <View className={`${cssPrefix}-stepper-touch`}>
              <View
                className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-add`)}
                onClick={this.manageProduct.bind(this, 'ADD')}
              />
            </View>
          </View>
        ) : (
            <View className={`${cssPrefix}-stepper-container`}>
              <View className={`${cssPrefix}-stepper-touch`}>
                <View
                  className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-add`)}
                  onClick={this.manageProduct.bind(this, 'ADD')}
                />
              </View>
            </View>
          )}
      </View>
    );
  }
}

export default OrderProduct;