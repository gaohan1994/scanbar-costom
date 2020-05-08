import Taro from '@tarojs/taro'
import { View, Input  } from '@tarojs/components'
import './index.less'
import { connect } from '@tarojs/redux'
import { AppReducer } from '../../../reducers'
import { AtButton  } from 'taro-ui'
import { UserAction } from '../../../actions'
import { Dispatch } from 'redux';
import { ResponseCode } from '../../../constants/index';
import invariant from 'invariant';
import { HTTPInterface } from '../../../constants/index';
import md5 from 'blueimp-md5';
import { LoginManager } from '../../../common/sdk'

const prefix = 'login'

type Props = {
  dispatch: Dispatch;
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
  public onNavAddress = () => {
    Taro.navigateTo({
      url: `/pages/address/address.change.index`
    })
  }
  async login() {
    const {dispatch} = this.props;
    try {
      const { phone, password } = this.state
      invariant(!!phone, '请输入手机号');
      invariant(phone.length === 11, '请输入正确的手机号');
      invariant(!!password, '请输入验证码');
      const result: HTTPInterface.ResponseResultBase<any> = await UserAction.h5Login(this.props.dispatch, {phone, validCode: md5(password), merchantId: 1});
      console.log(result);
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      if (result.code === ResponseCode.success) {
        Taro.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        });
        let userinfo = {
          nickname: '11',
          avatar: '11',
          token: '11',
          phone: '11'
        };
        if (result.data) {
          userinfo = {
            ...userinfo,
            ...result.data,
          };
        }
        const setResult: any = await LoginManager.setUserInfo(userinfo, dispatch);
        invariant(setResult.success, setResult.msg || '存储用户信息失败');
        Taro.navigateBack();
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
    return (
      <View className={`${prefix}_container`}>
        <View className={`${prefix}_title`}>登录</View>
        <View className={`${prefix}_content`}>
            <View className={`${prefix}_content__item`}>
                <Input type='number' placeholder='输入手机号码' placeholderStyle='color: #CCCCCC' className={`${prefix}_content__input`} onInput={ (e) : void => {this.handleChange('phone', e)} } />
            </View>
            <View className={`${prefix}_content_item_code`}>
              <View className={`${prefix}_content_item_code_i`}>
                  <Input type='number' placeholder='输入手机验证码' placeholderStyle='color: #CCCCCC' className={`${prefix}_content__input`} onInput={ (e) : void => {this.handleChange('password', e)} } />
              </View>
              <View 
                className={this.state.count !== 61 ? `${prefix}_content__code ${prefix}_content__code_wait`: `${prefix}_content__code ${prefix}_content__code_first`}
                onClick={this.state.count !== 61 ? () => {/** */} : getCode}
              >
                {this.state.count !== 61 ? `${this.state.count} 秒` : '发送验证码'}
                
              </View>
            </View>
            {/* <View className={`${prefix}_content__info`}>提示：请确认您的信息已提交系统，并准确填写手机号，进行绑定。</View> */}
            <AtButton className={this.state.phone && this.state.password ? `${prefix}_content__btn_true`: `${prefix}_content__btn_false`} onClick={this.state.phone && this.state.password ? this.login.bind(this): () => {/** */}}>绑定</AtButton>
        </View>
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => {
  return {
  }
}

export default connect(select)(LoginH5);