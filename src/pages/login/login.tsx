import Taro, {Config} from '@tarojs/taro';
import {View, Button, Image} from '@tarojs/components';
import './index.less';
import {LoginManager} from '../../common/sdk';
import invariant from 'invariant';
import {ResponseCode, MerchantInterface} from '../../constants';
import WeixinSDK from '../../common/sdk/weixin/weixin';
import {UserAction} from '../../actions';
import requestHttp from '../../common/request/request.http';
import {connect} from '@tarojs/redux';
import {AppReducer} from '../../reducers';
import {getCurrentMerchantDetail} from '../../reducers/app.merchant';

const cssPrefix = 'login';

interface Props {
    currentMerchantDetail: MerchantInterface.MerchantDetail;
}

interface State {

}

class GetUserinfo extends Taro.Component<Props, State> {

    config: Config = {
        navigationBarTitleText: '登录'
    }

    public onGetPhoneNumber = async (params) => {
        // const { onCancle, callback } = this.props;
        const {currentMerchantDetail} = this.props;
        console.log('params: ', params);
        const {detail} = params;
        if (detail.errMsg === "getPhoneNumber:ok") {
            const codeRes = await WeixinSDK.getWeixinCode();
            invariant(codeRes.success, codeRes.msg || '请先登录微信');
            const payload = {
                encryptedData: detail.encryptedData,
                ivStr: detail.iv,
                code: codeRes.result,
                merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : 1,
            };

            try {
                // onCancle();
                const result = await requestHttp.post('/customer/decrypt', payload);
                console.log('result: ', result);
                invariant(result.code === ResponseCode.success, result.msg || '获取手机号失败');
                const getResult = await LoginManager.getUserInfo();
                invariant(getResult.success, getResult.msg || '获取用户信息失败');
                const userinfo = getResult.result;
                const newCodeRes = await WeixinSDK.getWeixinCode();
                const loginRes = await LoginManager.login({
                    phone: JSON.parse(result.data).phoneNumber,
                    code: newCodeRes.result,
                    merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : 1
                });
                invariant(loginRes.success, loginRes.msg || '登录失败');
                const newUserinfo = {
                    ...userinfo,
                    phone: JSON.parse(result.data).phoneNumber,
                    merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : 1
                    // token: loginRes.result.token
                };
                const saveResult: any = await UserAction.userInfoSave(newUserinfo);
                invariant(saveResult.code === ResponseCode.success, saveResult.msg || '保存用户信息失败');
                const localUserinfo = {
                    ...newUserinfo,
                    token: loginRes.result.token
                }
                const setResult: any = await LoginManager.setUserInfo(localUserinfo);
                invariant(setResult.success, setResult.msg || '存储用户信息失败');
                Taro.navigateBack();
            } catch (error) {
                Taro.showToast({
                    title: error.message,
                    icon: 'none'
                });
            }
        }
    }

    render() {
        return (
            <View className={`${cssPrefix}`}>
                <Image
                    className={`${cssPrefix}-img`}
                    src={"//net.huanmusic.com/scanbar-c/v2/img_login.png"}
                />
                <Button
                    className={`${cssPrefix}-button`}
                    openType='getPhoneNumber'
                    onGetPhoneNumber={this.onGetPhoneNumber}
                >
                    微信手机号快捷登录
                </Button>
            </View>
        )
    }
}

const select = (state: AppReducer.AppState) => {
    return {
        currentMerchantDetail: getCurrentMerchantDetail(state),
    }
}

export default connect(select)(GetUserinfo);