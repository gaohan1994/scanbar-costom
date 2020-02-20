import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.less'
import '../../../component/product/product.less'
import classnames from 'classnames'
import { MerchantInterface } from '../../../constants'
import { connect } from '@tarojs/redux'
import productSdk from '../../../common/sdk/product/product.sdk';
import { AppReducer } from 'src/reducers'
import numeral from 'numeral'
import AddressItem from '../../../component/address/item'
import { getPayOrderAddress } from '../../../common/sdk/product/product.sdk.reducer'
import merchantAction from '../../../actions/merchant.action'
import { getMerchantDistance, getCurrentPostion } from '../../../reducers/app.merchant'

const tabs = [
  {
    title: '配送上门',
    id: 0,
  },
  {
    title: '到店自提',
    id: 1
  }
];

const prefix = 'order-component-address'

type Props = {
  payOrderAddress: MerchantInterface.Address;
  merchantDistance: MerchantInterface.Distance;
  currentPostion: any;
}

type State = {
  currentTab: number;
}

class Comp extends Taro.Component<Props, State> {

  state = {
    currentTab: 0
  }

  componentDidShow () {
    const { currentPostion } = this.props;
    this.changeTab(tabs[0])
    merchantAction.merchantDistance({
      latitude: currentPostion.latitude,
      longitude: currentPostion.longitude,
      merchantId: 1,
    })
  }

  public changeTab = (tab) => {
    this.setState({
      currentTab: tab.id
    }, () => {
      if (tab.id === 1) {
        /**
         * @todo 自提
         */
        productSdk.preparePayOrderDetail({deliveryType: 0})
      } else {
        productSdk.preparePayOrderDetail({deliveryType: 1})
      }
    })
  } 

  public onAddAddress = () => {
    Taro.navigateTo({
      url: `/pages/address/address.list?entry=order.pay`
    })
  }

  render () {
    const { currentTab } = this.state;
    return (
      <View 
        className={classnames(`${prefix}`, {
          [`${prefix}-pad`]: true
        })}
      >
        <View className={`${prefix}-tabs`}>
          <View className={`${prefix}-tabs-bg`} />
          {tabs.map((tab) => {
            return (
              <View
                key={tab.id}
                className={classnames(`${prefix}-tab`, {
                  [`${prefix}-tab-active`]: currentTab === tab.id,
                  [`${prefix}-tab-disable`]: currentTab !== tab.id,
                  [`${prefix}-tab-active-left`]: currentTab === tab.id && tab.id === 0,
                  [`${prefix}-tab-active-right`]: currentTab === tab.id && tab.id === 1,
                })}
                onClick={() => this.changeTab(tab)}
              >
                {tab.title}
              </View>
            )
          })}
        </View>
        {this.renderDetail()}
      </View>
    )
  }

  private renderDetail = () => {
    const { currentTab } = this.state;
    const { payOrderAddress, merchantDistance } = this.props;

    if (currentTab === 1) {
      return (
        <View className={`${prefix}-detail`}>
          <AddressItem 
            address={{
              contact: merchantDistance.name,
              phone: `${numeral(merchantDistance.distance).format('0')}米`,
              address: merchantDistance.location,
            } as any} 
            pre={true}
            showEdit={false}
            showArrow={true}
          />
          <View className={`${prefix}-detail-row ${prefix}-detail-row-border `}>
            <View className={`${prefix}-detail-row-title`}>自提时间</View>
            <View 
              className={classnames(`${prefix}-detail-row-title`, {
                [`${prefix}-detail-row-main`]: true,
                [`${prefix}-detail-row-title-right`]: true,
              })}
            >
              立即送出
            </View>
            <Image className={`${prefix}-detail-row-arrow`} src='//net.huanmusic.com/scanbar-c/icon_commodity_into.png' />
          </View>
          <View className={`${prefix}-detail-row`}>
            <View className={`${prefix}-detail-row-title`}>支付方式</View>
            <View className={classnames(`${prefix}-detail-row-title`)}>微信支付</View>
          </View>
        </View>
      );
    }
    return (
      <View className={`${prefix}-detail`}>
        {payOrderAddress.address ? (
          <View>
            <AddressItem 
              address={payOrderAddress} 
              showEdit={false}
              showArrow={true}
              onClick={() => this.onAddAddress()}
            />
          </View>
        ) : (
          <View className={`${prefix}-detail-empty`}>
            <View 
              className={`${prefix}-detail-button`}
              onClick={() => this.onAddAddress()}
            >
              <Image className={`${prefix}-detail-button-icon`} src='//net.huanmusic.com/scanbar-c/icon_add.png' />
              <View className={`${prefix}-detail-button-text`}>新增收货地址</View>
            </View>
          </View>
        )}
        <View className={`${prefix}-detail-row ${prefix}-detail-row-border `}>
          <View className={`${prefix}-detail-row-title`}>配送时间</View>
          <View 
            className={classnames(`${prefix}-detail-row-title`, {
              [`${prefix}-detail-row-main`]: true,
              [`${prefix}-detail-row-title-right`]: true,
            })}
          >
            立即送出
          </View>
          <Image className={`${prefix}-detail-row-arrow`} src='//net.huanmusic.com/scanbar-c/icon_commodity_into.png' />
        </View>
        <View className={`${prefix}-detail-row`}>
          <View className={`${prefix}-detail-row-title`}>支付方式</View>
          <View className={classnames(`${prefix}-detail-row-title`)}>微信支付</View>
        </View>
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    currentPostion: getCurrentPostion(state),
    payOrderAddress: getPayOrderAddress(state),
    merchantDistance: getMerchantDistance(state)
  }
}

export default connect(select)(Comp);