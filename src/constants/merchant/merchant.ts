
export declare namespace MerchantInterface {

  interface MerchantItem {
    address: string;
    contactName: string;
    createBy: string;
    createTime: string;
    id: number;
    institutionCode: number;
    latitude: number;
    longitude: number;
    location: string;
    logo: string;
    name: string;
    parentId: number;
    phoneNumber: string;
    prop: number;
    type: number;
    updateBy: string;
    updateTime: string;
  }
  interface MerchantDetail {
    address: string;
    contactName: string;
    customerMallConfig: CustomerMallConfig;
    id: number;
    industry: number;
    latitude: number;
    longitude: number;
    location: string;
    logo: string;
    name: string;
    phoneNumber: string;
    prop: number;
  }

  interface CustomerMallConfig {
    businessEndTime: string;
    businessStartTime: string;
    createTime: string;
    deliveryFeeRule: string;
    deliveryFreeThreshold: number;
    deliveryThreshold: number;
    maxDeliveryDistance: number;
    merchantId: number;
    servicePhone: string;
    status: number;
    updateTime: string;
  }

  interface Distance {
    distance: number;
    location: string;
    name: string;
    deliveryFee: number;
  }

  interface merchantDetailFetchField {
    merchantId: number;
  }

  interface merchantDistanceFetchField {
    merchantId: number;
    latitude: number;
    longitude: number;
  }


  namespace ReducerTypes {
    type RECEIVE_MERCHANT_LIST = string;
    type RECEIVE_MERCHANT_DETAIL = string;
    type RECEIVE_CURRENT_MERCHANT_DETAIL = string;
    type RECEIVE_MERCHANT_DISTANCE = string;
  }

  interface MerchantInterfaceMap {
    reducerInterface: {
      RECEIVE_MERCHANT_LIST: ReducerTypes.RECEIVE_MERCHANT_LIST;
      RECEIVE_MERCHANT_DETAIL: ReducerTypes.RECEIVE_MERCHANT_DETAIL;
      RECEIVE_CURRENT_MERCHANT_DETAIL: ReducerTypes.RECEIVE_CURRENT_MERCHANT_DETAIL;
      RECEIVE_MERCHANT_DISTANCE: ReducerTypes.RECEIVE_MERCHANT_DISTANCE;
    };

    merchantInfoDetail: string;
  }
}

class MerchantInterfaceMap implements MerchantInterface.MerchantInterfaceMap {
  public reducerInterface = {
    RECEIVE_MERCHANT_LIST: 'RECEIVE_MERCHANT_LIST',
    RECEIVE_MERCHANT_DETAIL: 'RECEIVE_MERCHANT_DETAIL',
    RECEIVE_CURRENT_MERCHANT_DETAIL: 'RECEIVE_CURRENT_MERCHANT_DETAIL',
    RECEIVE_MERCHANT_DISTANCE: 'RECEIVE_MERCHANT_DISTANCE',
  };
  public merchantInfoDetail = '/merchantInfo/detail';
  public merchantList = '/merchantInfo/merchantList';
  public merchantDistance = '/merchantInfo/distance';
}

export default new MerchantInterfaceMap();