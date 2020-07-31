
import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../style/product.less'
import { AppReducer } from '../../reducers'
import { getAddressList, getIndexAddress } from '../../reducers/app.user'
import { UserInterface } from '../../constants'
import AddressItem from '../../component/address/item'
import ButtonFooter from '../../component/button/button.footer'
import productSdk from '../../common/sdk/product/product.sdk'
import Empty from '../../component/empty'
import { UserAction, OrderAction } from '../../actions'
import { Dispatch } from 'redux';
import { getCurrentMerchantDetail } from '../../reducers/app.merchant';
import { BASE_PARAM } from '../../common/util/config'

type Props = {
  dispatch: Dispatch;
  addressList: UserInterface.Address[];
  indexAddress: any;
  currentMerchantDetail: any;
}

type State = {
  entry: string;
}

class Page extends Taro.Component<Props, State> {

  config: Config = {
    navigationBarTitleText: '我的地址'
  }

  state = {
    entry: ''
  }

  componentWillMount() {
    const { entry } = this.$router.params;
    if (entry) {
      this.setState({ entry })
    }
  }

  componentDidShow() {
    const { indexAddress, dispatch } = this.props;
    UserAction.addressList(dispatch, indexAddress);
  }

  public onAddressClick = async (address: UserInterface.Address) => {
    const { entry } = this.state;
    const { dispatch, currentMerchantDetail } = this.props;
    if (entry === 'order.pay') {
      productSdk.preparePayOrderAddress(address, dispatch);
      const param = {
        latitude:  address.latitude,
        longitude: address.longitude,
        merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : BASE_PARAM.MCHID
      }
      const result = await OrderAction.getDeliveryFee(dispatch, param);
      Taro.navigateBack({})
      return;
    }

    Taro.navigateTo({
      url: `/pages/address/address.edit?address=${JSON.stringify(address)}`
    })
  }

  render() {
    const { addressList } = this.props;
    return (
      <View className='container'>
        {addressList && addressList.length > 0 ? addressList.map((address, index) => {
          return (
            <AddressItem
              key={`address${index}`}
              address={address}
              onClick={() => this.onAddressClick(address)}
              onEditClick={() => {
                Taro.navigateTo({
                  url: `/pages/address/address.edit?address=${JSON.stringify(address)}`
                })
              }}
            />
          )
        }) : (
            <Empty
              img='//net.huanmusic.com/scanbar-c/v1/img_location.png'
              text='还没有地址，快去新增吧'
            />
          )}

        <ButtonFooter
          buttons={[{
            title: '新增地址',
            onPress: () => {
              Taro.navigateTo({
                url: '/pages/address/address.add'
              })
            }
          }]}
        />
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    addressList: getAddressList(state),
    indexAddress: getIndexAddress(state),
    currentMerchantDetail: getCurrentMerchantDetail(state),
  }
}
export default connect(select)(Page as any);