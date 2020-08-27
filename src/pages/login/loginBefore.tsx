import Taro from '@tarojs/taro'
import { View, Input  } from '@tarojs/components'
import './index.less'
import { connect } from '@tarojs/redux'
import { AppReducer } from '../../reducers'
import { AtButton  } from 'taro-ui'
import {  MerchantAction, UserAction } from '../../actions'
import { Dispatch } from 'redux';
import { BASE_PARAM } from '../../common/util/config'
import { getMerchantList, getCurrentMerchantDetail } from '../../reducers/app.merchant';
import { ResponseCode, MerchantInterfaceMap } from '../../constants/index';
const prefix = 'login'

type Props = {
  dispatch: Dispatch;
  merchantList: any;
  currentMerchantDetail: any;
}
type State = {
  choose: any;
  car: any;
  count: any;
  modal: boolean;
}

class LoginBefore extends Taro.Component<Props, State> {
  timer;
  state = {
    choose: {},
    car: '',
    count: 61,
    modal: false
  }
  async componentDidMount () {
    const {dispatch, currentMerchantDetail }= this.props;
    const { GetRequest } = this;

    const user  = GetRequest();
    localStorage.setItem('userWx', JSON.stringify(user));
    const params = {
        merchantId: BASE_PARAM.MCHIDFist,
    }
    MerchantAction.merchantList(dispatch, params, currentMerchantDetail);
    await UserAction.getMemberInfo(dispatch);
  }
  public onNavAddress = () => {
    Taro.navigateTo({
      url: `/pages/address/address.change.index`
    })
  }
  async login() {

  }
  GetRequest() {   
    let url = decodeURIComponent(location.hash); //获取url中"?"符后的字串   
    let theRequest = new Object();   
    if (url.indexOf("?") != -1) {   
       let str =  url.split("?")[1];   
       let strs = str.split("&");   
       for(let i = 0; i < strs.length; i ++) {   
          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
       }   
    }   
    return theRequest;   
 } 
  handleChange ( event) {
    const { value } = event.detail
    this.setState({
      car: value,
    })
    const {dispatch, currentMerchantDetail } = this.props;
    const param = {
        merchantId: BASE_PARAM.MCHIDFist,
        merchantName: value
    }
    MerchantAction.merchantList(dispatch, param, currentMerchantDetail);
  }
  setTimer = () => {
    const {count} = this.state;
    const {setTimer} = this;
    if (count === 0) {
      clearTimeout(this.timer);
      this.setState({
        count: 61,
      }); 
      return;
    }
    this.setState({
      count: count - 1,
    }); 
    this.timer = setTimeout(setTimer, 1000);  
  }

  onchange = (e) => {
    // console.log('onchange', e);
  }
  render () {
  
    const {merchantList, dispatch} = this.props;
    const self = this;
    const list  = merchantList.filter(val => val.parentId !== 0);
    return (
      <View className={`loginbrfore`}>
        <View className={`${prefix}_containerbefore_bg`}></View>
        <View className={`${prefix}_content`}>
            <View className={`${prefix}_content_item_title`}>出发日期</View>
            <View className={`${prefix}_content__item`}>
                <View className={`${prefix}_content__item_txt`}>08月10日 周一</View>
            </View>
            <View className={`${prefix}_content_item_title ${prefix}_content_item_title_padding`}>订餐车次</View>
            <View className={`${prefix}_content_item_code `}>
              <View className={`${prefix}_content_item_code_i`}>
                  <Input type='text' onFocus={() => {this.setState({modal: true})}} value={this.state.car} placeholder='输入车次号' placeholderStyle='color: #333333' className={`${prefix}_content__input`} onInput={ (e) : void => {this.handleChange(e)} } />
                  
              </View>
              
            </View>
            {
              this.state.modal ? (
                <View className={`${prefix}_content_item_tishi `}>
                  {
                    list.map(function(item){
                      return (
                        <View className={`${prefix}_content_item_tishi_item `} onClick={() => {
                          dispatch({
                              type: MerchantInterfaceMap.reducerInterface.RECEIVE_CURRENT_MERCHANT_DETAIL,
                              payload: item
                          });
                          self.setState({
                            choose: item,
                            modal: false,
                            car: item.name
                          })
                        }}>{item.name}</View>);
                    })
                  }
                </View>
              ) : null
            }
            {/* <View className={`${prefix}_content__info`}>提示：请确认您的信息已提交系统，并准确填写手机号，进行绑定。</View> */}
            <AtButton className={`${prefix}_content__btn_true`} onClick={() => {Taro.navigateTo({url: '/pages/index/index?merchantId=' + this.state.choose.id})}}>开始点餐</AtButton>
        </View>
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    merchantList: getMerchantList(state),
    currentMerchantDetail: getCurrentMerchantDetail(state)
  }
}

export default connect(select)(LoginBefore);