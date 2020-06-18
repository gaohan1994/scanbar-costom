
import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../style/product.less'
import { AppReducer } from '../../reducers'
import { getAddressList, getIndexAddress } from '../../reducers/app.user';
import { UserInterface } from '../../constants'
import AddressItem from '../../component/address/item'
import ButtonFooter from '../../component/button/button.footer'
import productSdk from '../../common/sdk/product/product.sdk'
import Empty from '../../component/empty'
import { UserAction } from '../../actions'
import { Dispatch } from 'redux';

type Props = {
  dispatch: Dispatch;
  addressList: UserInterface.Address[];
  indexAddress: any;
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

  componentWillMount () {
    const { entry } = this.$router.params;
    if (entry) {
      this.setState({ entry })
    }
    
  }
  componentDidMount() {
    this.init();

  }
  componentDidShow () {
    this.init();
  }
  async init () {
    const {indexAddress} = this.props;
    try {
      Taro.showLoading({title: '', mask: true});
      await UserAction.addressList(this.props.dispatch, indexAddress);
      Taro.hideLoading();
    } catch (error) {
      Taro.hideLoading();
    }
  }

  public onAddressClick = (address: UserInterface.Address) => {
    const { entry } = this.state;
    const { dispatch} = this.props;
    if (entry === 'order.pay') {
      productSdk.preparePayOrderAddress(address, dispatch);
      Taro.navigateBack({})
      return;
    }

    Taro.navigateTo({
      url: `/pages/address/address.edit?address=${JSON.stringify(address)}`
    })
  }

  render () {
    const { addressList } = this.props;
    return (
      <View className='container'>
        {addressList && addressList.length > 0 ? addressList.map((address, index) => {
          return(
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
    indexAddress: getIndexAddress(state)
  }
}
export default connect(select)(Page);