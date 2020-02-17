
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../style/product.less'
import { AtButton } from 'taro-ui'
import { AppReducer } from '../../reducers'
import merchantAction from '../../actions/merchant.action'
import { MerchantInterface, ResponseCode } from '../../constants'
import WeixinSdk from '../../common/sdk/weixin/weixin'
import './index.less'
import Row from '../../component/address/row'
import invariant from 'invariant'
import dayJs from 'dayjs'

const prefix = 'address'

type Props = {
}

type State = {
  address: string,
  latitude: number;
  longitude: number;
  detail: string;
  contact: string;
  phone: string;
  sex: string;
  flag: number;
}

class Page extends Taro.Component<Props, State> {

  state = {
    address: '',
    latitude: 0,
    longitude: 0,
    detail: '',
    contact: '',
    phone: '',
    sex: 'man',
    flag: 0,
  }

  public chooseAddress = async () => {
    const result = await WeixinSdk.chooseAddress();
    console.log('result', result)
    if (!!result.success) {
      this.setState({
        address: result.result.address,
        latitude: result.result.latitude,
        longitude: result.result.longitude,
      })
    }
  }

  public changeValue = (key: string, value: any) => {
    this.setState(prevState => {
      return {
        ...prevState,
        [key]: value
      }
    })
  }

  public submit = async () => {
    try {
      const { 
        address,
        latitude,
        longitude,
        detail,
        contact,
        phone,
        sex,
        flag,
      } = this.state;
      invariant(!!address, '请选择地址');
      invariant(!!latitude, '请选择地址');
      invariant(!!longitude, '请选择地址');
      invariant(!!detail, '请输入地址详情');
      invariant(!!contact, '请输入联系人');
      invariant(!!phone, '请输入手机号');

      const payload: Partial<MerchantInterface.Address> = {
        address: address,
        contact: contact,
        createTime: dayJs().format('YYYY-MM-DD HH:mm:ss'),
        houseNumber: '',
        phone: phone,
        isDefault: 0,
        flag: flag,
        latitude: latitude,
        longitude: longitude,
        userId: 1,
      }
      console.log('payload: ', payload)
      const result = await merchantAction.addressAdd(payload);
      console.log('result: ', result)
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      Taro.showToast({
        title: '添加成功',
      });

      setTimeout(() => {
        Taro.navigateBack({})
      }, 1000);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      })
    }
  }

  render () {
    const { address, detail, contact, phone } = this.state;
    return (
      <View className='container'>
        <Row
          isBorder={true}
          title='地址'
          inputDisable={true}
          isInput={true}
          arrow={true}
          inputValue={address}
          inputPlaceHolder='请选择地址'
          inputOnChange={() => {}}
          onClick={() => this.chooseAddress()}
        />
        <Row
          isBorder={true}
          title='门牌号'
          isInput={true}
          inputValue={detail}
          inputPlaceHolder='如：1号楼100室'
          inputOnChange={(value) => this.changeValue('detail', value)}
        />
        <Row
          isBorder={false}
          title='联系人'
          isInput={true}
          inputValue={contact}
          inputPlaceHolder='联系人名称'
          inputOnChange={(value) => this.changeValue('contact', value)}
          buttons={[
            {title: '先生', onPress: () => this.changeValue('sex', 'man'), type: this.state.sex === 'man' ? 'confirm' : 'cancel'},
            {title: '女士', onPress: () => this.changeValue('sex', 'woman'), type: this.state.sex === 'woman' ? 'confirm' : 'cancel'}
          ]}
          buttonPos='bottom'
        />
        <Row
          isBorder={true}
          title='手机号'
          isInput={true}
          inputValue={phone}
          isBorderTop={true}
          inputPlaceHolder=''
          inputOnChange={(value) => this.changeValue('phone', value)}
        />

        <Row
          isBorder={false}
          title='标签'
          buttons={[
            {title: '家', onPress: () => this.changeValue('flag', 0), type: this.state.flag === 0 ? 'confirm' : 'cancel'},
            {title: '公司', onPress: () => this.changeValue('flag', 1), type: this.state.flag === 1 ? 'confirm' : 'cancel'},
            {title: '学校', onPress: () => this.changeValue('flag', 2), type: this.state.flag === 2 ? 'confirm' : 'cancel'}
          ]}
        />

        <View className={`${prefix}-button`}>
          <AtButton 
            className={'theme-button'}
            onClick={() => this.submit()}
          >
            <Text className="theme-button-text" >保存</Text>
          </AtButton>
        </View>
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
  }
}
export default connect(select)(Page);