
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

  interface ProfileInfo {
    avatar: string;
    email: string;
    merchantName: string;
    phone: string;
    sex: string;
    userName: string;
  }

  namespace PayloadInterface {
    interface MerchantInfoAdd extends Partial<MerchantDetail> {
      pageNum?: number;
      pageSize?: number;
      parentId?: number;
      prop?: number;
      status?: number;
      type?: number;
      orderByColumn?: string;
      phoneNumber?: string;
    }
  }

  namespace ReducerTypes {
    type RECEIVE_MERCHANT_DETAIL = string;
    type RECEIVE_PROFILE_INFO = string;
  }

  interface MerchantInterfaceMap {
    reducerInterface: {
      RECEIVE_MERCHANT_DETAIL: ReducerTypes.RECEIVE_MERCHANT_DETAIL;
      RECEIVE_PROFILE_INFO: ReducerTypes.RECEIVE_PROFILE_INFO;
    };
    
    merchantInfoAdd: string;
    merchantInfoDetail: string;
    profileInfo: string;
  }
}

class MerchantInterfaceMap implements MerchantInterface.MerchantInterfaceMap {
  public reducerInterface = {
    RECEIVE_MERCHANT_DETAIL: 'RECEIVE_MERCHANT_DETAIL',
    RECEIVE_PROFILE_INFO: 'RECEIVE_PROFILE_INFO',
    RECEIVE_ADDRESS_LIST: 'RECEIVE_ADDRESS_LIST',
    RECEIVE_MERCHANT_DISTANCE: 'RECEIVE_MERCHANT_DISTANCE'
  };
  public merchantInfoAdd = '/merchantInfo/add';
  public merchantInfoDetail = '/merchantInfo/detail';
  public profileInfo = '/user/profile/info';
}

export default new MerchantInterfaceMap();