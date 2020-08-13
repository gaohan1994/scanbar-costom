import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.less'
import '../../../component/product/product.less'
import classnames from 'classnames'
import { AtActionSheet, AtActionSheetItem, AtFloatLayout } from 'taro-ui';
import { MerchantInterface, UserInterface } from '../../../constants'
import { connect } from '@tarojs/redux'
import productSdk from '../../../common/sdk/product/product.sdk';
import { AppReducer } from '../../../reducers'
import numeral from 'numeral'
import AddressItem from '../../../component/address/item'
import { getPayOrderAddress } from '../../../common/sdk/product/product.sdk.reducer'
import merchantAction from '../../../actions/merchant.action'
import { getMerchantDistance, getCurrentMerchantDetail, getOrderPayType } from '../../../reducers/app.merchant';
import { getCurrentPostion, getIndexAddress, getAddressList } from '../../../reducers/app.user';
import { Dispatch } from 'redux';
import { BASE_PARAM } from "../../../common/util/config";
import UserAction from '../../../actions/user.action';
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
  dispatch: Dispatch;
  isPay?: boolean;
  orderPayType: any;
  onAddressClick: (param: any) => void;
  indexAddressObj: any;
  payOrderAddress: UserInterface.Address;
  merchantDistance: MerchantInterface.Distance;
  currentMerchantDetail: MerchantInterface.MerchantDetail;
  currentPostion: any;
  onRefProductPayListViewObj?: any;
  timeSelectClick?: () => void;
  addressList: any[];
  currentTime?: string;
  changeTabCallback?: () => void;
}

type State = {
  currentTab: number;
  choosePayWay: boolean;
  payType: any;
}

class Comp extends Taro.Component<Props, State> {

  state = {
    currentTab: 0,
    choosePayWay: false,
    payType: 8,
  }

  async componentDidMount() {
    const { indexAddressObj, currentMerchantDetail, dispatch, addressList } = this.props;
    this.changeTab(tabs[0])
    merchantAction.merchantDistance(dispatch, {
      latitude: indexAddressObj.latitude,
      longitude: indexAddressObj.longitude,
      merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : BASE_PARAM.MCHID,
    })
    const result = await UserAction.addressList(dispatch, indexAddressObj);
    if(result && result.data && result.data[0]){
      productSdk.preparePayOrderAddress(result.data[0], dispatch);
    }
  }
  componentWillUnmount () {
    merchantAction.setPayType(this.props.dispatch, 8);
  }
  public changeTab = (tab) => {
    const { changeTabCallback, dispatch, onRefProductPayListViewObj } = this.props;
    this.setState({
      currentTab: tab.id
    }, async () => {
      if (tab.id === 1) {
        /**
         * @todo 自提
         */
        await productSdk.preparePayOrderDetail({ deliveryType: 0 }, dispatch)
      } else {
        await productSdk.preparePayOrderDetail({ deliveryType: 1 }, dispatch)
      }
      if(onRefProductPayListViewObj){
        onRefProductPayListViewObj.changePointSet();
      }
      const points = {
        pointsTotalSell: 0, 
        pointsTotal: 0, 
      }
      productSdk.preparePayOrderPoints(points, dispatch);
      if (changeTabCallback) {
        changeTabCallback();
      }
    })
  }

  public onAddAddress = () => {
    Taro.navigateTo({
      url: `/pages/address/address.list?entry=order.pay`
    })
  }

  public onTimeClick = () => {
    const { timeSelectClick } = this.props;
    timeSelectClick ? timeSelectClick() : () => { };
  }
  public onChangePayType (type) {
    const {dispatch} = this.props;
    merchantAction.setPayType(dispatch, type);
    this.setState({
      choosePayWay: false,
    })
  }
  public renderDetail = () => {
    const { currentTab } = this.state;
    const { payOrderAddress, timeSelectClick, merchantDistance, currentTime, currentMerchantDetail, isPay, onAddressClick, orderPayType } = this.props;
    const locations = currentMerchantDetail.location ? currentMerchantDetail.location.split(',') : [];
    const addressNew = locations.join('') + currentMerchantDetail.address;
    const self = this;
    if (currentTab === 1) {
      return (
        <View className={`${prefix}-detail`}>
          <AddressItem
            currentMerchantDetail={currentMerchantDetail}
            address={{
              contact: merchantDistance.name,
              phone: `${numeral(merchantDistance.distance).format('0')}米`,
              address: addressNew,
            } as any}
            pre={true}
            showEdit={false}
            showArrow={true}
            onClick={() => {
              if(process.env.TARO_ENV === 'weapp'){
                Taro.navigateTo({
                  url: `/pages/order/store?entry=order.pay`
                })
              }
            }}
          />
          <View className={`${prefix}-detail-row ${prefix}-detail-row-border `}>
            <View className={`${prefix}-detail-row-title`}>自提时间</View>
            <View onClick={(e) => {
              e.stopPropagation();
              timeSelectClick ? timeSelectClick() : () => { };
            }}>
              <View
                className={classnames(`${prefix}-detail-row-title`, {
                  [`${prefix}-detail-row-main`]: true,
                  [`${prefix}-detail-row-title-right`]: true,
                })}
              >
                {currentTime || ''}
            </View>
              <Image className={`${prefix}-detail-row-arrow`} src='//net.huanmusic.com/scanbar-c/icon_commodity_into.png' />
            </View>
          </View>
          <View className={`${prefix}-detail-row`} >
            <View className={`${prefix}-detail-row-title`}>支付方式</View>
            <View onClick={(e) => {
                e.stopPropagation();
                self.setState({
                  choosePayWay: true
                })
              }} className={classnames(`${prefix}-detail-row-title`)}>
              <View className={classnames(`${prefix}-detail-row-title-txt`)}>{orderPayType === 8 || orderPayType === 2? '微信支付' : '储值支付'}</View>
            <Image className={`${prefix}-detail-row-arrow`} src='//net.huanmusic.com/scanbar-c/icon_commodity_into.png' /></View>
          </View>
        </View>
      );
    }
    return (
      <View className={`${prefix}-detail`}>
        {payOrderAddress.address ? (
          <View>
            <AddressItem
              isPay={isPay}
              currentMerchantDetail={currentMerchantDetail}
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
                <View className={`${prefix}-detail-button-text`}>选择收货地址</View>
              </View>
            </View>
          )}
        <View className={`${prefix}-detail-row ${prefix}-detail-row-border `}>
          <View className={`${prefix}-detail-row-title`}>配送时间</View>
          <View>
            <View
              className={classnames(`${prefix}-detail-row-title`, {
                [`${prefix}-detail-row-main`]: true,
                [`${prefix}-detail-row-title-right`]: true,
              })}
              onClick={(e) => {
                e.stopPropagation();
                timeSelectClick ? timeSelectClick() : () => { };
              }}
            >
              {currentTime || '立即送出'}
          </View>
            <Image className={`${prefix}-detail-row-arrow`} src='//net.huanmusic.com/scanbar-c/icon_commodity_into.png' />
          </View>
        </View>
        <View className={`${prefix}-detail-row`} >
          <View className={`${prefix}-detail-row-title`}>支付方式</View>
          <View onClick={(e) => {
              e.stopPropagation();
              self.setState({
                choosePayWay: true
              })
            }} className={classnames(`${prefix}-detail-row-title`)}>
            <View className={classnames(`${prefix}-detail-row-title-txt`)}>{orderPayType === 8 || orderPayType === 2? '微信支付' : '储值支付'}</View>
            <Image className={`${prefix}-detail-row-arrow`} src='//net.huanmusic.com/scanbar-c/icon_commodity_into.png' />
          </View>
        </View>
      </View>
    )
  }
  render() {
    const { currentTab } = this.state;
    const {currentMerchantDetail} = this.props;
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
        {/* <PickerComponent /> */}
        {/* <AtFloatLayout
          isOpened={this.state.choosePayWay}
          title={'选择支付方式'}
          onClose={this.hideModal}
        >

        </AtFloatLayout> */}
        <AtActionSheet className={`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}`} title={'选择支付方式'} isOpened={this.state.choosePayWay}>
          <Image onClick={() => {this.setState({choosePayWay: false})}} src={'//net.huanmusic.com/weapp/icon_close.png'} className={`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-close`}/>
          <View onClick={() => {
            if(process.env.TARO_ENV === 'weapp'){
              this.setState({payType: 8})
            } else {
              this.setState({payType: 2})
            }
          }} className={`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-pay`}>
            <Image src={'//net.huanmusic.com/weapp/icon_payment_wechat.png'} className={`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-pay-image`}/>
            <View>微信支付</View> 
            <View 
              className={classnames(`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-pay-select-item`, {
                  [`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-pay-select-normal`]: this.state.payType === 7, 
                  [`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-pay-select-active`]: this.state.payType === 8 || this.state.payType === 2, 
              })}
            />
          </View>
          <View onClick={() => {
            if (currentMerchantDetail.storedCard) {
              this.setState({payType: 7})
            } else {
                Taro.showToast({
                    title: '该门店暂未开通储值，请联系商户',
                    duration: 2000
                });
            }
            }} className={`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-pay ${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-pay-border`}>
            <Image src={'//net.huanmusic.com/weapp/icon_payment_chuzhi.png'} className={`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-pay-image`}/>
            <View>储值支付</View> 
            <View 
              className={classnames(`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-pay-select-item`, {
                  [`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-pay-select-active`]: this.state.payType === 7, 
                  [`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-pay-select-normal`]: this.state.payType === 8 || this.state.payType === 2, 
              })}
            />
          </View>
          <View onClick={() => {this.onChangePayType(this.state.payType);}} className={`${prefix}${process.env.TARO_ENV === 'h5' ? '-h5wx' : '-wx'}-button`}>
            确定
          </View>
        </AtActionSheet>
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    indexAddressObj: getIndexAddress(state),
    orderPayType: getOrderPayType(state),
    currentPostion: getCurrentPostion(state),
    addressList: getAddressList(state),
    payOrderAddress: getPayOrderAddress(state),
    merchantDistance: getMerchantDistance(state),
    currentMerchantDetail: getCurrentMerchantDetail(state),
  }
}

export default connect(select)(Comp as any);