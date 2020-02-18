import Taro from '@tarojs/taro';
import MapSdk from '../../qqmap-wx-jssdk'
import { MerchantInterface } from '../../../constants';
import { store } from '../../../app';
import { getIndexAddress } from '../../../reducers/app.merchant';
import invariant from 'invariant'

/**
 * @todo 腾讯地图key
 */
const mapKey = 'DLFBZ-7AXKW-TWYRV-OLVUQ-FA527-2CBQG'
const mapSdk = new MapSdk({key: mapKey})

class WeixinSDK {

  public reducerInterface = {
    RECEIVE_CURRENT_ADDRESS: 'RECEIVE_CURRENT_ADDRESS',
    CHANGE_COSTOM_INDEX_ADDRESS: 'CHANGE_COSTOM_INDEX_ADDRESS'
  }

  public checkAuth = (auth: string): Promise<{success: boolean, result?: any}> => {
    const key = `scope.${auth}`;
    return new Promise((resolve) => {
      Taro.getSetting({
        success: (setting) => {
          console.log(setting);
          if (setting.authSetting && !!setting.authSetting[key]) {
            resolve({success: true})
          }
          resolve({success: false})
        },
        fail: (res) => {
          resolve({success: false, result: res})
        }
      });
    });
  }

  public authorize = async (auth: string): Promise<any> => {
    const key = `scope.${auth}`;
    const result = await Taro.authorize({ scope: key });
    console.log('result', result);
    return result;
  }

  public chooseAddress = async (): Promise<{success: boolean, result: any}> => {
    return new Promise((resolve) => {
      Taro.chooseLocation({
        success: (result) => {
          resolve({success: true, result})
        },
        fail: (result) => {
          resolve({success: false, result})
        }
      });
    })
  }

  public getWeixinUserinfo = async () => {
    return new Promise((resolve) => {
      Taro.getUserInfo({
        
      })
    })
  }

  public getLocation = async (): Promise<{success: boolean, result: any, msg: string}> => {
    const that = this;
    return new Promise((resolve) => {
      Taro.getLocation({
        success: (res) => {
          mapSdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: (result) => {
              store.dispatch({
                type: that.reducerInterface.RECEIVE_CURRENT_ADDRESS,
                payload: {
                  address: result.result.address,
                  latitude: result.result.location.lat,
                  longitude: result.result.location.lng,
                }
              })
              resolve({success: true, result: result.result, msg: ''})
            },
            fail: (error) => {
              resolve({success: false, result: undefined, msg: error.message})
            }
          })
        },
        fail: (error) => {
          resolve({success: false, result: undefined, msg: error.message})
        }
      })
    })
  }

  public changeCostomIndexAddress = (address: MerchantInterface.Address) => {
    store.dispatch({
      type: this.reducerInterface.CHANGE_COSTOM_INDEX_ADDRESS,
      payload: {
        address
      }
    })
  }

  /**
   * @todo [判断当前redux中是否存在首页地址如果没有则初始化]
   */
  public initAddress = async () => {
    try {
      const state = await store.getState();
      const address = getIndexAddress(state);

      if (address && address.latitude) {
        return;
      }
      const result = await this.getLocation();
      invariant(!!result.success, result.msg || '获取地理位置失败');
      const payload = {
        address: result.result.address,
        latitude: result.result.location.lat,
        longitude: result.result.location.lng,
      }
      this.changeCostomIndexAddress(payload as any);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      })
    }
  }
}

export default new WeixinSDK();