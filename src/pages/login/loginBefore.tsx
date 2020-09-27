import Taro from '@tarojs/taro'
import { View, Input, Picker, Image  } from '@tarojs/components'
import './index.less'
import { connect } from '@tarojs/redux'
import { AppReducer } from '../../reducers'
import { AtButton  } from 'taro-ui'
import {  MerchantAction, UserAction } from '../../actions'
import { Dispatch } from 'redux';
import { BASE_PARAM } from '../../common/util/config'
import { getMerchantList, getCurrentMerchantDetail } from '../../reducers/app.merchant';
import { ResponseCode, MerchantInterfaceMap } from '../../constants/index';
import moment from 'moment';
import icon_arrive from '../../assets/icon_arrive.png';
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
  data: any;
  Stroke: any;
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
    data: [],
    Stroke:{}
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
  renderCar = (data) => {
    const list: any = [];
    const {car} = this.state;
    data.forEach(element => {
      if(element.rosterInfo && element.rosterInfo.rosterDetail)  {
        const rosterDetail = JSON.parse(element.rosterInfo.rosterDetail);
        console.log(rosterDetail)
        rosterDetail.forEach(val => {
          if(car === val.name){
            list.push({
              ...val,
              id: element.id
            });
          }
        });
      }
    });
    return list;
  }
  onSelectCar = async (id) => {
    const {dispatch} = this.props;
    const {renderCar} = this;
    if (id && this.state.startTime) {
      const param = {
        merchantId: id,
        startTime: this.state.startTime,
      }
      const result = await MerchantAction.onGetStroke(dispatch, param);
      const data = renderCar(result.data  && result.data.rows|| [])
      this.setState({
        data: data,
        Stroke: data[0] || {}
      })
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
    console.log(this.state.Stroke);
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
                          onSelectCar(item.id);
                        }}>{item.name}</View>);
                    })
                  }
                </View>
              ) : null
            }
            <View className={`${prefix}_content_item_title ${prefix}_content_item_title_padding`}>行程选择</View>
            {
              this.state.data.map((val: any )=> {
                return (
                <View className={`${prefix}_content_item_code `} style={{height: 'auto', marginBottom: '10px'}} onClick={() => {
                  this.setState({
                    Stroke: val
                  })
                }}>
                  <View className={`${prefix}_content_item_code_i ${this.state.Stroke.id === val.id ? `${prefix}_content_item_code_choose` : ''} `} style={{height: 'auto'}}>
                    
                    <View className={`${prefix}_content_item_code_i_item`}>{val.name}</View>
                    <View className={`${prefix}_content_item_code_i_item`}>
                      <View><View className={`${prefix}_content_item_code_i_item_start`}>始</View>{val.firstStation}</View>
                      <View>{moment(val.firstStationTime).format('HH:mm')}</View>
                      
                    </View>
                    <Image className={`${prefix}_content_item_code_i_img`} src={icon_arrive}></Image>
                    <View className={`${prefix}_content_item_code_i_item`}>
                      <View><View className={`${prefix}_content_item_code_i_item_end`}>终</View>{val.lastStation}</View>
                      <View>{moment(val.lastStationTime).format('HH:mm')}</View>
                    </View>
                  </View>
                  
                </View>
                )
              })
            }
           
            {/* <View className={`${prefix}_content__info`}>提示：请确认您的信息已提交系统，并准确填写手机号，进行绑定。</View> */}
            <AtButton className={`${prefix}_content__btn_true`} onClick={() => {
                    localStorage.setItem('Stroke', JSON.stringify(this.state.Stroke));

                    Taro.navigateTo({url: '/pages/index/index?merchantId=' + this.state.choose.id})
            }}>开始点餐</AtButton>
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