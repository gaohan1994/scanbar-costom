import Taro from '@tarojs/taro';
import MapSdk from '../../qqmap-wx-jssdk'
import { UserInterface } from '../../../constants';
import invariant from 'invariant'

/**
 * @todo 腾讯地图key LYEBZ-LMSKK-QVBJG-A2MGL-MHYIF-4PFWU    DLFBZ-7AXKW-TWYRV-OLVUQ-FA527-2CBQG
 */
const mapKey = 'LYEBZ-LMSKK-QVBJG-A2MGL-MHYIF-4PFWU'
const mapSdk = new MapSdk({ key: mapKey })

class WeixinSDK {

  public reducerInterface = {
    RECEIVE_CURRENT_ADDRESS: 'RECEIVE_CURRENT_ADDRESS',
    CHANGE_COSTOM_INDEX_ADDRESS: 'CHANGE_COSTOM_INDEX_ADDRESS'
  }

  public checkAuth = (auth: string): Promise<{ success: boolean, result?: any }> => {
    const key = `scope.${auth}`;
    return new Promise((resolve) => {
      Taro.getSetting({
        success: (setting) => {
          if (setting.authSetting && !!setting.authSetting[key]) {
            resolve({ success: true })
          }
          resolve({ success: false })
        },
        fail: (res) => {
          resolve({ success: false, result: res })
        }
      });
    });
  }

  public authorize = async (auth: string): Promise<any> => {
    const key = `scope.${auth}`;
    const result = await Taro.authorize({ scope: key });
    return result;
  }

  public chooseAddress = async (): Promise<{ success: boolean, result: any }> => {
    return new Promise((resolve) => {
      Taro.chooseLocation({
        success: (result) => {
          resolve({ success: true, result })
        },
        fail: (result) => {
          resolve({ success: false, result })
        }
      });
      
    })
    
  }

  public getWeixinCode = async (): Promise<any> => {
    return new Promise((resolve) => {
      Taro.login({
        success: async (res) => {
          const { code } = res;
          resolve({success: true, result: code, msg: ''});
        },
        fail: (error: any) => {
          resolve({ success: false, result: undefined, msg: error.errMsg });
        }
      })
    })
  }

  public getWeixinUserinfo = async () => {
    const authRes: any = await this.checkAuth('userInfo');
    if (authRes.success) {
      return new Promise((resolve) => {
        Taro.getUserInfo({
          success: (res) => {
            resolve({ success: true, result: res.userInfo, msg: '' })
          },
          fail: (error: any) => {
            resolve({ success: false, result: undefined, msg: error.errMsg })
          }
        })
      })
    } else {
      return { success: false, result: undefined, msg: '未授权获取微信头像和昵称' };
    }
  }

  public getLocation = async (dispatch): Promise<{ success: boolean, result: any, msg: string }> => {
    const that = this;
    return new Promise((resolve) => {
      if (process.env.TARO_ENV === 'weapp') {
        // 微信小程序逻辑
        Taro.getLocation({
          success: (res) => {
            mapSdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              success: (result) => {
                dispatch({
                  type: that.reducerInterface.RECEIVE_CURRENT_ADDRESS,
                  payload: {
                    address: result.result.address,
                    latitude: result.result.location.lat,
                    longitude: result.result.location.lng,
                  }
                })
                resolve({ success: true, result: result.result, msg: '' })
              },
              fail: (error) => {
                resolve({ success: false, result: undefined, msg: error.message })
              }
            })
          },
          fail: (error) => {
            resolve({ success: false, result: undefined, msg: error.message })
          }
        })
      }
      if (process.env.TARO_ENV === 'h5') {
        // H5 逻辑
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            // var speed = res.speed; // 速度，以米/每秒计
            // var accuracy = res.accuracy; // 位置精度
            const Option: any = {
              url: 'https://apis.map.qq.com/ws/geocoder/v1/',
              method: 'GET',
              data: {
                location: res.latitude+','+res.longitude,
                key: mapKey,
                output: 'jsonp'
              },
              dataType: 'jsonp',
              jsonp: "callback",
				      jsonpCallback: "QQmap",
              header: {
                'content-type': 'application/json'
              },
              success: (data) => { 
                const result = data.data;
                if(result.result){
                  dispatch({
                    type: that.reducerInterface.RECEIVE_CURRENT_ADDRESS,
                    payload: {
                      address: result.result.address,
                      latitude: result.result.location.lat,
                      longitude: result.result.location.lng,
                    }
                  })
                }
                resolve({ success: true, result: result.result, msg: '' })
              }, 
              fail: (error) => {
                resolve({ success: false, result: undefined, msg: error.message })
              }
            };
            Taro.request(Option);
            
            const param = {
              latitude: res.latitude,
              longitude: res.longitude
            };
            mapSdk.reverseGeocoder({location: param,
              success: (result) => {
                dispatch({
                  type: that.reducerInterface.RECEIVE_CURRENT_ADDRESS,
                  payload: {
                    address: result.result.address,
                    latitude: result.result.location.lat,
                    longitude: result.result.location.lng,
                  }
                })
                resolve({ success: true, result: result.result, msg: '' })
              },
              fail: (error) => {
                resolve({ success: false, result: undefined, msg: error.message })
              }
            })
          }
        });
      }
      
    })
  }

  public changeCostomIndexAddress = (address: UserInterface.Address, dispatch) => {
    dispatch({
      type: this.reducerInterface.CHANGE_COSTOM_INDEX_ADDRESS,
      payload: {
        address
      }
    })
  }

  /**
   * @todo [判断当前redux中是否存在首页地址如果没有则初始化]
   */
  public initAddress = async (dispatch, address) => {
    try {
      // const state = await store.getState();
      // const address = getIndexAddress(state);

      if (address && address.latitude) {
        return;
      }
      const result = await this.getLocation(dispatch);
      invariant(!!result.success, result.msg || '获取位置失败, 请开启手机定位');
      const payload = {
        address: result.result.address,
        latitude: result.result.location.lat,
        longitude: result.result.location.lng,
      }
      this.changeCostomIndexAddress(payload as any, dispatch);
      return result.result.location;
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      })
      return {};
    }
  }
}

export default new WeixinSDK();