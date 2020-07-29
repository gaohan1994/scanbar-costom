/**
 * @Author: Ghan 
 * @Date: 2019-11-08 17:10:29 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-16 16:33:41
 */

import Taro from '@tarojs/taro';
import md5 from 'blueimp-md5';
import requestHttp from '../../request/request.http';
import { ResponseCode, ActionsInterface, UserInterfaceMap, UserInterface } from '../../../constants/index';
import { Dispatch } from 'redux';

export const CentermOAuthKey: string = 'CentermOAuthTokenCostom';

export declare namespace LoginInterface {

  interface OAuthTokenParams {
    phoneNumber: string;
    password: string;
  }

  interface AuthMenu {
    id: number;
    name: string;
  }

  interface CheckPermissionsResult {
    success: boolean;
    grantedPermissions?: Array<string>;
    declinedPermissions?: Array<string>;
  }

  interface LoginMangerInfo<T> {
    success: boolean;
    result: T;
    msg: string;
  }

  interface OAuthToken {
    token: string;
    phone: string;
    loginId: string;
    name: string;
    menus: AuthMenu[];
    nickname: string;
    avatar: string;
  }

  interface LoginManagerConfig {
    oatuhToken: string;
    login: string;
  }

  type RECEIVE_AUTH = string;
  interface ReducerInterface {
    RECEIVE_AUTH: RECEIVE_AUTH;
  }
}

class LoginManager {

  public reducerInterface: LoginInterface.ReducerInterface = {
    RECEIVE_AUTH: 'RECEIVE_AUTH'
  };

  public LoginManagerConfig: LoginInterface.LoginManagerConfig = {
    oatuhToken: '/oauth/token',
    login: '/customer/login'
  };

  public autoToken = async (params: any): Promise<any> => {
    const result = await requestHttp.post(`${this.LoginManagerConfig.login}`, params);
    if (result.code === ResponseCode.success) {
      return { success: true, result: result.data };
    } else {
      return { success: false, result: result.msg };
    }
  }

  /**
   * @todo [登录]
   *
   * @memberof LoginManager
   */
  public login = async (params: any, dispatch: Dispatch): Promise<LoginInterface.LoginMangerInfo<LoginInterface.OAuthToken>> => {
    const payload: LoginInterface.OAuthTokenParams = {
      ...params,
    };
    const { success, result } = await this.autoToken(payload);

    if (success === true) {
      dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_USERINFO,
        payload: {
          userinfo: result,
        }
      });
      return new Promise((resolve) => {
        Taro
          .setStorage({ key: CentermOAuthKey, data: JSON.stringify(result) })
          .then(() => {
            resolve({success: true, result, msg: ''});
          })
          .catch(error => resolve({success: false, result: {} as any, msg: error.message || '登录失败'}));
      });
    } else {
      return new Promise((resolve) => {
        resolve({success: false, result: {} as any, msg: result || '登录失败'});
      });
    }
  }
  
  /**
   * @todo [退出登陆]
   *
   * @memberof LoginManager
   */
  public logout = async (dispatch: Dispatch): Promise<ActionsInterface.ActionBase<string>> => {
    dispatch({
      type: UserInterfaceMap.reducerInterface.RECEIVE_USERINFO,
      payload: {
        userinfo: {},
      }
    });
    return new Promise((resolve, reject) => {
      Taro
        .setStorage({ key: CentermOAuthKey, data: '' })
        .then(() => {
          resolve({ success: true, result: '' });
        })
        .catch(error => {
          reject({ success: false, result: error.message });
        });
    });
  }

  /**
   * @todo 获取用户信息
   *
   * @memberof LoginManager
   */
  public getUserInfo = (dispatch: Dispatch): Promise<LoginInterface.LoginMangerInfo<LoginInterface.OAuthToken>> => {
    return new Promise((resolve) => {
      Taro
        .getStorage({key: CentermOAuthKey})
        .then(data => {
          if (data.data !== '') {
            resolve({success: true, result: JSON.parse(data.data), msg: ''});
            dispatch({
              type: UserInterfaceMap.reducerInterface.RECEIVE_USERINFO,
              payload: {
                userinfo: JSON.parse(data.data),
              }
            });
          } else {
            resolve({success: true, result: {} as any, msg: ''});
          }
        })
        .catch(error => {
          resolve({success: false, result: {} as any, msg: error.message});
        });
    });
  }

  /**
   * todo 获取用户token
   *
   * @memberof LoginManager
   */
  public getUserToken = (): ActionsInterface.ActionBase<string> => {
    const userinfo = Taro.getStorageSync(CentermOAuthKey);
    if (userinfo) {
      return { success: true, result: JSON.parse(userinfo).token };
    } else {
      return { success: false, result: '' };
    }
  }

  /**
   * @todo 存储用户信息
   *
   * @memberof LoginManager
   */
  public setUserInfo = (userInfo: UserInterface.UserInfo, dispatch: Dispatch) => {
    dispatch({
      type: UserInterfaceMap.reducerInterface.RECEIVE_USERINFO,
      payload: {
        userinfo: userInfo,
      }
    });
    return new Promise((resolve) => {
      Taro
        .setStorage({ key: CentermOAuthKey, data: JSON.stringify(userInfo) })
        .then(() => {
          resolve({success: true, userInfo, msg: ''});
        })
        .catch(error => resolve({success: false, result: {} as any, msg: error.message || '保存用户信息失败'}));
    });
  }
}

export default new LoginManager();