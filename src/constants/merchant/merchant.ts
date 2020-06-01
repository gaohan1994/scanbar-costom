export declare namespace MerchantInterface {
  interface AlianceMerchant {
    activityInfo: string[];
    coupons: any[];
    isNew: number;
    deliveryThreshold: string;
    distanceShow: string;
    name: string;
    status: true;
    minDiscount: number;
    distance: number;
    id: number;
    topMerchantId: number;
  }
  interface Activity {
    activityDetailVOList?: Array<{
      giftFlag: boolean;
      identity: string;
      name: string;
      pic: string;
      activityId: number;
      id: number;
      price: number;
    }>;
    auditorName: string;
    createTime: string;
    cycleRule: string;
    docMakerName: string;
    endDetailTime: string;
    endTime: string;
    merchantIds: string;
    merchantName: string;
    name: string;
    startDetailTime: string;
    startTime: string;
    updateTime: string;
    filterType: number;
    id: number;
    isDeleted: number;
    type: number;
    updateBy: number;
    rule: {
      discount: number;
      threshold: number;
    }[];
    status: boolean;
    auditStatus: boolean;
  }

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
    type RECEIVE_MERCHANT_ADVERTISEMENT = string;
    type RECEIVE_MERCHANT_ACTIVITYLIST = string;
  }

  interface MerchantInterfaceMap {
    reducerInterface: {
      RECEIVE_MERCHANT_LIST: ReducerTypes.RECEIVE_MERCHANT_LIST;
      RECEIVE_MERCHANT_DETAIL: ReducerTypes.RECEIVE_MERCHANT_DETAIL;
      RECEIVE_CURRENT_MERCHANT_DETAIL: ReducerTypes.RECEIVE_CURRENT_MERCHANT_DETAIL;
      RECEIVE_MERCHANT_DISTANCE: ReducerTypes.RECEIVE_MERCHANT_DISTANCE;
      RECEIVE_MERCHANT_ADVERTISEMENT: ReducerTypes.RECEIVE_MERCHANT_ADVERTISEMENT;
      RECEIVE_MERCHANT_ACTIVITYLIST: ReducerTypes.RECEIVE_MERCHANT_ACTIVITYLIST;
    };

    merchantInfoDetail: string;
  }
}

class MerchantInterfaceMap implements MerchantInterface.MerchantInterfaceMap {
  public reducerInterface = {
    RECEIVE_MERCHANT_LIST: "RECEIVE_MERCHANT_LIST",
    RECEIVE_MERCHANT_DETAIL: "RECEIVE_MERCHANT_DETAIL",
    RECEIVE_CURRENT_MERCHANT_DETAIL: "RECEIVE_CURRENT_MERCHANT_DETAIL",
    RECEIVE_MERCHANT_DISTANCE: "RECEIVE_MERCHANT_DISTANCE",
    RECEIVE_MERCHANT_ADVERTISEMENT: "RECEIVE_MERCHANT_ADVERTISEMENT",
    RECEIVE_MERCHANT_ACTIVITYLIST: "RECEIVE_MERCHANT_ACTIVITYLIST",
    RECEIVE_MERCHANT_ALIANCE_LIST: "RECEIVE_MERCHANT_ALIANCE_LIST"
  };
  public merchantInfoDetail = "/customer/merchantInfo/detail";
  public merchantList = "/customer/merchantInfo/merchantList";
  public merchantDistance = "/customer/merchantInfo/distance";
  public advertisement = "/customer/advertisement/getAdvertisements";
}

export default new MerchantInterfaceMap();
