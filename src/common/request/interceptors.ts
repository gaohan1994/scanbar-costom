import Taro from "@tarojs/taro";
import { HTTP_STATUS } from './config';

const customInterceptor = (chain) => {

  const requestParams = chain.requestParams;

  return chain.proceed(requestParams).then(res => {
    // console.log('TODO 根据自身业务修改', res);
    if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
      return Promise.reject("请求资源不存在");

    } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
      return Promise.reject("服务端出现了问题");

    } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
      Taro.setStorageSync("Authorization", "");
      // pageToLogin()
      // TODO 根据自身业务修改

      return Promise.reject("没有权限访问");

    } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
      Taro.setStorageSync("Authorization", "");
      // pageToLogin()
      return Promise.reject("需要鉴权");

    } 
    else if (res.data && res.data.code === 'unauthorized') {
      Taro.setStorage({ key: 'CentermOAuthTokenCostom', data: '' });
      if(process.env.TARO_ENV === 'h5'){
        Taro.navigateTo({url: '/pages/login/login.userinfo'})
      }
      return res.data;
    }
    else if (res.statusCode === HTTP_STATUS.SUCCESS) {
      return res.data;
    } 
  });
};

const interceptors = [customInterceptor, Taro.interceptors.logInterceptor];

export default interceptors;