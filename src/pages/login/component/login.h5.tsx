import Taro from '@tarojs/taro'
import { View, Input  } from '@tarojs/components'
import './index.less'
import { connect } from '@tarojs/redux'
import { AppReducer } from '../../../reducers'
import { AtButton  } from 'taro-ui'
import { UserAction, MerchantAction } from '../../../actions'
import { Dispatch } from 'redux';
import { ResponseCode, MerchantInterface } from '../../../constants/index';
import invariant from 'invariant';
import { HTTPInterface } from '../../../constants/index';
import md5 from 'blueimp-md5';
import { LoginManager } from '../../../common/sdk'
import { BASE_PARAM } from '../../../common/util/config'
import { getCurrentMerchantDetail, getMerchantList } from '../../../reducers/app.merchant';
const prefix = 'login'

type Props = {
  dispatch: Dispatch;
  merchantList: any;
  currentMerchantDetail?: MerchantInterface.MerchantDetail;
}
type InputType = 'phone' | 'password'
type State = {
  phone: any;
  password: any;
  count: any;
}

class LoginH5 extends Taro.Component<Props, State> {
  timer;
  state = {
    phone: '',
    password: '',
    count: 61,
  }
  componentDidMount () {
    // const {dispatch, currentMerchantDetail} = this.props;
    // const params = {
    //   merchantId: BASE_PARAM.MCHIDFist,
    // }
    // MerchantAction.merchantList(dispatch, params, currentMerchantDetail);
  }
  public onNavAddress = () => {
    Taro.navigateTo({
      url: `/pages/address/address.change.index`
    })
  }
  async login() {
    const {dispatch, currentMerchantDetail} = this.props;
    try {
      const { phone, password } = this.state
      invariant(!!phone, '请输入手机号');
      invariant(phone.length === 11, '请输入正确的手机号');
      invariant(!!password, '请输入验证码');
      //currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : BASE_PARAM.MCHID
      const result: HTTPInterface.ResponseResultBase<any> = await UserAction.h5Login(this.props.dispatch, {phone, validCode: md5(password), merchantId: BASE_PARAM.default,});
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      if (result.code === ResponseCode.success) {
        Taro.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        });
        let userinfo = {
          nickname: '',
          avatar: '',
          token: '',
          phone: ''
        };
        const userWx = localStorage.getItem('userWx');
        if (userWx) { 
          userinfo = {
            ...userinfo,
            ...JSON.parse(userWx),
            merchantId: BASE_PARAM.default
          };
        }
        if (result.data) {
          userinfo = {
            ...userinfo,
            ...result.data,
            merchantId: BASE_PARAM.default
          };
        }
        await LoginManager.setUserInfo(userinfo, dispatch);
        await UserAction.userInfoSave(userinfo);
        // Taro.navigateBack();
        // Taro.navigateTo({
        //   url: '/pages/login/loginBefore'
        // })
        window.location.href= `${window.location.origin}/online/#/pages/login/loginBefore`;
        // window.location.reload();
        // invariant(setResult.success, setResult.msg || '存储用户信息失败');
      }
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none',
        duration: 2000
      });
    }
  }
  handleChange (type: InputType, event) {
    const { value } = event.detail
    if (type === 'phone') {
        this.setState({
            phone: value,
        })
    } else {
        this.setState({
            password: value,
        })
    }
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
  getCode = async () => {
    try {
      const { phone } = this.state
      invariant(!!phone, '请输入手机号');
      const result: HTTPInterface.ResponseResultBase<any> = await UserAction.h5Code(this.props.dispatch, {phone});
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      this.setTimer();
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none',
        duration: 2000
      });
    }
  }
  render () {
    const {getCode} = this;
    const {currentMerchantDetail, merchantList} = this.props;
    const mearchantName = localStorage.getItem('mearchantName');
    const ob = merchantList.filter(val => val.id === BASE_PARAM.default)[0];
    return (
      <View className={`${prefix}_container`}>
        <View className={`${prefix}_container_bg`}>
          <View className={`${prefix}_container_bg_title`}>
            <div>欢迎登录</div>
            <div>{
                ob &&ob.name || '未获取到店名'
              }</div>
          </View>
          <View className={`${prefix}_container_bg_logo`}/>
        </View>
        <View className={`${prefix}_content`}>
            <View className={`${prefix}_content__item`}>
                <View className={`${prefix}_content__item_logo`}/>
                <Input type='number' placeholder='输入手机号码' placeholderStyle='color: #CCCCCC' className={`${prefix}_content__input`} onInput={ (e) : void => {this.handleChange('phone', e)} } />
            </View>
            <View className={`${prefix}_content_item_code`}>
              <View className={`${prefix}_content_item_code_i`}>
                  <View className={`${prefix}_content_item_code_i_logo`}/>
                  <Input type='number' placeholder='输入手机验证码' placeholderStyle='color: #CCCCCC' className={`${prefix}_content__input`} onInput={ (e) : void => {this.handleChange('password', e)} } />
              </View>
              <View 
                className={this.state.count !== 61 ? `${prefix}_content__code ${prefix}_content__code_wait`: `${prefix}_content__code ${prefix}_content__code_first`}
                onClick={this.state.count !== 61 ? () => {/** */} : getCode}
              >
                {this.state.count !== 61 ? `重新发送(${this.state.count})s` : '获取验证码'}
                
              </View>
            </View>
            {/* <View className={`${prefix}_content__info`}>提示：请确认您的信息已提交系统，并准确填写手机号，进行绑定。</View> */}
            <AtButton className={`${prefix}_content__btn_true`} onClick={this.state.phone && this.state.password ? this.login.bind(this): () => {/** */}}>登录</AtButton>
        </View>
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    currentMerchantDetail: getCurrentMerchantDetail(state),
    merchantList: getMerchantList(state),
  }
}

export default connect(select)(LoginH5);