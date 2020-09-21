import Taro from '@tarojs/taro'
import { View, Input, Picker  } from '@tarojs/components'
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
  startTime: any;
  startTimeStr: any;
}

class LoginBefore extends Taro.Component<Props, State> {
  timer;
  state = {
    choose: {},
    car: '',
    count: 61,
    modal: false,
    startTime: '',
    startTimeStr: '',
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
    const myDate = new Date();
    var year = myDate.getFullYear(); //年

    var month = myDate.getMonth() + 1; //月

    var day = myDate.getDate(); //日
    const days = this.getDayStr(`${year}-${month}-${day} 00:00:00`);
    this.setState({
      startTime: `${year}-${month}-${day} 00:00:00`,
      startTimeStr: `${month}月${day}日 ${days}`
    })
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

  onSelectCar = () => {
    const {dispatch} = this.props;
    if (this.state.choose.id && this.state.startTime) {
      const param = {
        merchantId: this.state.choose.id,
        startTime: this.state.startTime,
      }
      MerchantAction.onGetStroke(dispatch, param);
      Taro.navigateTo({url: '/pages/index/index?merchantId=' + this.state.choose.id})
    } else {
      Taro.showToast({
        title: '请选择日期和车次',
        duration: 2000
        })
    }
    
  }
  onDateChange = (e) => {
    //
    console.log(e.detail.value);
    const time = e.detail.value;
    const days = this.getDayStr(`${time} 00:00:00`);
    const times = time.split('-')
    this.setState({
      startTime: `${time} 00:00:00`,
      startTimeStr: `${times[1]}月${times[2]}日 ${days}`
    })
  }
  getDayStr = (e) => {
    const d = new Date(e);
    const key = d.getDay();
    let days = '';
    switch (key) {
      case 1:
        days = '周一';
        break;
      case 2:
        days = '周二';
        break;
      case 3:
        days = '周三';
        break;
      case 4:
        days = '周四';
        break;
      case 5:
        days = '周五';
        break;
      case 6:
        days = '周六';
        break;
      case 0:
        days = '周日';
        break;
      default:
        break;
    }
    return days;
  }
  render () {
    const {onSelectCar} = this;
    const {merchantList, dispatch} = this.props;
    const self = this;
    const list  = merchantList.filter(val => val.parentId !== 0);
    // 08月10日 周一
    return (
      <View className={`loginbrfore`}>
        <View className={`${prefix}_containerbefore_bg`}></View>
        <View className={`${prefix}_content`}>
            <View className={`${prefix}_content_item_title`}>出发日期</View>
            <Picker mode='date' onChange={this.onDateChange}>
              <View className={`${prefix}_content__item`}>
                <View className={`${prefix}_content__item_txt`}>{this.state.startTimeStr}</View>
              </View>
            </Picker>
            
            
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
            <AtButton className={`${prefix}_content__btn_true`} onClick={() => {onSelectCar();}}>开始点餐</AtButton>
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