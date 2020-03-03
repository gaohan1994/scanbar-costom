
export declare namespace MerchantInterface {
  interface MerchantDetail {
    address: string;
    contactName: string;
    createBy: string;
    createTime: string;
    institutionCode: string;
    location: string;
    logo: string;
    name: string;
    phoneNumber: string;
    updateBy: string;
    updateTime: string;
    id: number;
    industry: number;
    isDeleted: number;
    parentId: number;
    prop: number;
    status: number;
    type: number;
  }

  interface Distance {
    distance: number;
    location: string;
    name: string;
  }

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

  interface WxUserInfo {
    avatar: string;
    nickname: string;
  }

  namespace PayloadInterface {

  }

  namespace ReducerTypes {
    type RECEIVE_MERCHANT_DETAIL = string;
    type RECEIVE_PROFILE_INFO = string;
    type RECEIVE_MERCHANT_LIST = string;
    type RECEIVE_CURRENT_MERCHANT_LIST = string;
  }

  interface MerchantInterfaceMap {
    reducerInterface: {
      RECEIVE_MERCHANT_DETAIL: ReducerTypes.RECEIVE_MERCHANT_DETAIL;
      RECEIVE_MERCHANT_LIST: ReducerTypes.RECEIVE_MERCHANT_LIST;
      RECEIVE_CURRENT_MERCHANT_LIST: ReducerTypes.RECEIVE_CURRENT_MERCHANT_LIST;
    };
    
    merchantInfoDetail: string;
  }
}

class MerchantInterfaceMap implements MerchantInterface.MerchantInterfaceMap {
  public reducerInterface = {
    RECEIVE_MERCHANT_DETAIL: 'RECEIVE_MERCHANT_DETAIL',
    RECEIVE_ADDRESS_LIST: 'RECEIVE_ADDRESS_LIST',
    RECEIVE_MERCHANT_DISTANCE: 'RECEIVE_MERCHANT_DISTANCE',
    RECEIVE_MERCHANT_LIST: 'RECEIVE_MERCHANT_LIST',
    RECEIVE_CURRENT_MERCHANT_LIST: 'RECEIVE_CURRENT_MERCHANT_LIST',
  };
  public merchantInfoDetail = '/merchantInfo/detail';
  public merchantList = '/merchantInfo/merchantList';
}

export default new MerchantInterfaceMap();