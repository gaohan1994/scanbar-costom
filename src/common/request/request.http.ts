import Taro from '@tarojs/taro';
import getBaseUrl from './base.url';
import interceptors from './interceptors';
import { LoginManager } from '../sdk';

interceptors.forEach(i => Taro.addInterceptor(i));

class HttpRequest {
  baseOptions(params: any, method: string = "GET"): Promise<any> {
    const { result } = LoginManager.getUserToken();
    let { url, data } = params;
    const BASE_URL = getBaseUrl(url);
    let contentType = "application/json";
    contentType = params.contentType || contentType;
    const option: any = {
      url: BASE_URL + url,
      data: data,
      method: method,
      header: {
        'content-type': contentType
      },
      fail: (res) => {
        console.log(res);
        if(res.errMsg === "request:fail "){
          Taro.setStorage({ key: 'CentermOAuthTokenCostom', data: '' });
        }
      }
    };


    const list = ['/customer/product/type/', '/customer/merchantInfo/merchantList', 
    '/customer/advertisement/getAdvertisements/', '/customer/product/list', '/customer/merchantInfo/listSubMerchant'];

    let haToken = true;
    list.forEach(element => {
      if(url.indexOf(element) !== -1){
        haToken = false;
      }
    });
    console.log('token______________', result,'haToken', haToken)
    if (!!result && haToken) {
      option.header.Authorization = result;
    }
    // console.log('option: ', option);
    return Taro.request(option);
  }

  get (url: string, data: string = "") {
    let option = { url, data };
    return this.baseOptions(option);
  }

  post (url: string, data: any, contentType?: string) {
    let params = { url, data: typeof data === 'string' ? data : JSON.stringify(data), contentType };
    return this.baseOptions(params, "POST");
  }

  put (url: string, data: string = "") {
    let option = { url, data };
    return this.baseOptions(option, "PUT");
  }

  delete (url: string, data: string = "") {
    let option = { url, data };
    return this.baseOptions(option, "DELETE");
  }
}

export default new HttpRequest();