/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-03-03 17:10:08 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-03 17:16:54
 */

export declare namespace UserInterface {

  interface Address {
    address: string;
    contact: string;
    createTime: string;
    houseNumber: string;
    phone: string;
    updateTime: number;
    isDefault: number;
    flag: number;
    id: number;
    latitude: number;
    longitude: number;
    userId: number;
  }

  interface UserInfo {
    avatar: string;
    nickname: string;
    phone: string;
    sex: number;
  }

  namespace ReducerTypes {
    type RECEIVE_USERINFO = string;
    type RECEIVE_ADDRESS_LIST = string;
  }

  interface UserInterfaceMap {
    reducerInterface: {
      RECEIVE_USERINFO: ReducerTypes.RECEIVE_USERINFO;
      RECEIVE_ADDRESS_LIST: ReducerTypes.RECEIVE_ADDRESS_LIST;
    };
  }
}

class UserInterfaceMap implements UserInterface.UserInterfaceMap {
  public reducerInterface = {
    RECEIVE_USERINFO: 'RECEIVE_USERINFO',
    RECEIVE_ADDRESS_LIST: 'RECEIVE_ADDRESS_LIST',
  };
}

export default new UserInterfaceMap();