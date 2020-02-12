import Taro, { clearStorage } from '@tarojs/taro';

class WeixinSDK {

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
    // return result;
  }

  public chooseAddress = async () => {

    return new Promise((resolve) => {
      Taro.chooseAddress({
        success: (result) => {
          console.log('result: ', result);
          resolve({success: true, result})
        },
        fail: (result) => {
          console.log('result: ', result);
          resolve({success: false, result})
        }
      });
    })
  }
}

export default new WeixinSDK();