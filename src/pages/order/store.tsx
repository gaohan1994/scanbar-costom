
import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../style/product.less'
import { AppReducer } from '../../reducers'
import { getAddressList, getIndexAddress } from '../../reducers/app.user';
import { UserInterface, MerchantInterfaceMap } from '../../constants'
import AddressItem from '../../component/address/item'
import productSdk from '../../common/sdk/product/product.sdk'
import { Dispatch } from 'redux';
import {BASE_PARAM} from '../../common/util/config';
import { getCurrentMerchantDetail, getMerchantList } from '../../reducers/app.merchant';
import { MerchantAction } from '../../actions'
import { getProductCartListMerchantIndex } from '../../common/sdk/product/product.sdk.reducer';
type Props = {
  dispatch: Dispatch;
  productCartListMerchantIndex: any;
  addressList: UserInterface.Address[];
  indexAddress: any;
  currentMerchantDetail: any;
  merchantList: any;
}

type State = {
  entry: string;
}

class Page extends Taro.Component<Props, State> {

  config: Config = {
    navigationBarTitleText: '门店列表'
  }

  state = {
    entry: ''
  }

  componentWillMount () {
    // const { entry } = this.$router.params;
    // if (entry) {
    //   this.setState({ entry })
    // }
    
  }
  componentDidMount() {
    this.init();

  }
  componentDidShow () {
    this.init();
  }
  async init () {
    const {currentMerchantDetail, indexAddress, dispatch} = this.props;
    try {
      Taro.showLoading({title: '', mask: true});
      const param = {
        merchantId: BASE_PARAM.MCHIDFist,
        latitude: indexAddress.latitude,
        longitude: indexAddress.longitude
    }
      MerchantAction.merchantList(dispatch, param, currentMerchantDetail);
      Taro.hideLoading();
    } catch (error) {
      Taro.hideLoading();
    }
  }

  render () {
    const { merchantList, currentMerchantDetail, dispatch, productCartListMerchantIndex } = this.props;
    return (
      <View className='container'>
          {
            merchantList.map((val) => {
              return (
                <AddressItem
                  currentMerchantDetail={currentMerchantDetail}
                  address={{
                    contact: val.name,
                    phone: val.distanceStr,
                    address: `${val.location.replace(/,/g, "")}${val.address}`,
                  } as any}
                  pre={true}
                  hasRadio={true}
                  productCartListMerchantIndex={productCartListMerchantIndex === val.id}
                  showEdit={false}
                  showArrow={false}
                  onClick={() => {
                    if(productCartListMerchantIndex !== val.id){
                      Taro.showModal({
                        title: '提示',
                        content: '切换门店需要重新确认购物车商品，确定切换？',
                        success: function(res) {
                          if (res.confirm) {
                            dispatch({
                              type: MerchantInterfaceMap.reducerInterface.RECEIVE_CURRENT_MERCHANT_DETAIL,
                              payload: val
                            });
                            productSdk.changeStoreCart(val.id, dispatch);
                            Taro.switchTab({
                              url: `/pages/cart/cart`
                            })
                          }
                        }
                      })
                    }
                    
                  }}
                />
              );
            })
          }
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    addressList: getAddressList(state),
    indexAddress: getIndexAddress(state),
    merchantList: getMerchantList(state),
    productCartListMerchantIndex: getProductCartListMerchantIndex(state),
    currentMerchantDetail: getCurrentMerchantDetail(state),
  }
}
export default connect(select)(Page);