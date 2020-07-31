import Taro from "@tarojs/taro";
import { HTTP_STATUS } from "./config";
import { ResponseCode } from "../../constants/index";
import { store } from "../../app";
import { getUserinfo } from '../../reducers/app.user';

let timer: any = null;

const customInterceptor = chain => {
  const requestParams = chain.requestParams;

  return chain.proceed(requestParams).then(res => {
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
    } else if (res.data && res.data.code === ResponseCode.unauthorized) {
      console.log("unauthorized");
      Taro.showToast({
        title: "请先登录",
        icon: "none"
      });
      const state = store.getState();
      const userinfo = getUserinfo(state);
      if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
        if (timer === null || (Date.now() - timer) > 1000) {
          timer = Date.now();
          const routes = Taro.getCurrentPages();
          if (routes[routes.length - 1].route !== "pages/login/login.userinfo") {
            Taro.navigateTo({ url: "/pages/login/login.userinfo" });
          }
        }
        return res.data;
      }
      if (userinfo.phone === undefined || userinfo.phone.length === 0) {
        if (timer === null || (Date.now() - timer) > 1000) {
          const routes = Taro.getCurrentPages();
          if (routes[routes.length - 1].route !== "pages/login/login") {
            Taro.navigateTo({ url: "/pages/login/login" });
          }
        }
        return res.data;
      }
      return res.data;
    } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
      return res.data;
    }
  });
};

const interceptors = [customInterceptor, Taro.interceptors.logInterceptor];

export default interceptors;
