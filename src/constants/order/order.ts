
/**
 * @Author: Ghan 
 * @Date: 2019-11-13 10:10:53 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-17 17:45:58
 * 
 * @todo [商品相关的类型定义]
 */

import { jsonToQueryString } from "../index";
import { HTTPInterface } from '..';

export declare namespace OrderInterface {

  interface OrderDetailItem {
    id: number;
    costAmount: number;
    discountAmount: number;
    discountType: number;
    merchantId: number;
    num: number;
    ableRefundNum: number;
    productId: number;
    profit: number;
    totalAmount: number;
    transAmount: number;
    type: number;
    unitPrice: number;
    productName: string;
    remark: string;
    standard: string;
    barcode: string;
    brand: string;
    orderNo: string;
    picUrl: string;
  }

  interface OrderInfo {
    pointDiscount: any;
    detail: string;
    merchantName: string;
    orderNo: string;
    platformNo: string;
    terminalCd: string;
    terminalSn: string;
    transTime: string;
    username: string;
    cashierId: number;
    discount: number;
    erase: number;
    memberId: number;
    merchantId: number;
    orderSource: number;
    payType: number;
    totalAmount: number;
    totalNum: number;
    transAmount: number;
    transFlag: number;
    transType: number;
    createTime: string;
    planDeliveryTime: string;
    deliveryType: number;
    deliveryFee: number;
    remark: string;
    expireMinute?: number;
    address: string;
    receiver: string;
    receiverPhone: string;
    merchantAddress: string;
    lastRefundStatus: number;
    ableRefund: boolean;
    couponDiscount: number;
  }

  interface RefundOrderItem {
    couponDiscount: number;
    createTime: string;
    discount: number;
    memberDiscount: number;
    memberId: number;
    merchantId: number;
    numDiscount: number;
    orderNo: string;
    orderPhone: string;
    orderSource: number;
    originOrderNo: string;
    payType: number;
    reduceDiscount: number;
    remark: string;
    cancelRemark: string;
    totalAmount: number;
    totalNum: number;
    transAmount: number;
    transFlag: number;
    transTime: string;
    transType: number;
  }

  interface OrderDetail {
    order: OrderInfo;
    orderDetailList?: Array<OrderDetailItem>;
    orderNo: string;
    orderActivityInfoList: Array<OrderActivityInfoItem>;
    refundOrderList: Array<RefundOrderItem>;
    orderRefundIndices: Array<RefundIndices>;
  }

  interface OrderActivityInfoItem {
    activityId: number;
    activityName: string;
    activityType: number;
    createTime: string;
    discountAmount: number;
    merchantId: number;
  }

  interface RefundIndices {
    id: string;
    createTime: string;
    clinchTime: string;
    refundingTime: string;
    transFlag: number;
  }

  interface OrderListFetchFidle extends HTTPInterface.FetchField {
    cashierId?: number;
    memberId?: number;
    merchantId?: number;
    orderByColumn?: string;
    orderNo?: string;
    orderSource?: number;
    payType?: number;
    terminalCd?: string;
    terminalSn?: string;
    transFlag?: number;
    transType?: number;
    startTime?: string;
    endTime?: string;
  }

  interface OrderDetailFetchField {
    orderNo: string;
    payType?: any;
  }

  interface OrderCount {
    inTransNum: number;         // 待收货/配送中数量
    initNum: number;            // 待付款数量
    waitForReceiptNum: number;  // 待自提
    waitForDelivery: number;    // 待发货
    // waitForSend: number;
  }

  interface OrderAllStatus {
    dictValue: string;
    dictLabel: string;
  }

  interface DateItem {
    id: number;
    name: string;
  }

  interface RefundOrderParams {
    order: {
      orderNo: string;
      orderSource: number;
      refundByPreOrder: boolean;
      transAmount: number;
      remark: string;
    },
    productInfoList: RefundOrderProductItem[],
  }

  interface RefundOrderProductItem {
    orderDetailId: number;
    changeNumber: number;
  }

  type CHANGR_CURRENT_TYPE = string;
  type RECEIVE_ORDER_DETAIL = string;
  type RECEIVE_ORDER_LIST = string;
  type RECEIVE_ORDER_COUNT = string;
  type RECEIVE_ORDER_ALL_STATUS = string;
  type RECEIVE_ABLE_TO_USE_COUPONS = string;
  type RECEIVE_POINTCONFIG = string;
  type RECEIVE_DELIVERYFEE = string;

  type ReducerInterface = {
    CHANGR_CURRENT_TYPE: CHANGR_CURRENT_TYPE;
    RECEIVE_ORDER_LIST: RECEIVE_ORDER_LIST;
    RECEIVE_ORDER_DETAIL: RECEIVE_ORDER_DETAIL;
    RECEIVE_ORDER_COUNT: RECEIVE_ORDER_COUNT;
    RECEIVE_ORDER_ALL_STATUS: RECEIVE_ORDER_ALL_STATUS;
    RECEIVE_ABLE_TO_USE_COUPONS: RECEIVE_ABLE_TO_USE_COUPONS;
    RECEIVE_POINTCONFIG: RECEIVE_POINTCONFIG;
    RECEIVE_DELIVERYFEE: RECEIVE_DELIVERYFEE;
  };

  interface OrderInterfaceMapImp {
    reducerInterfaces: ReducerInterface;
    orderList: (params: OrderListFetchFidle) => string;
    orderDetail: (params: OrderDetailFetchField) => string;
  }
}

class OrderInterfaceMap implements OrderInterface.OrderInterfaceMapImp {

  public reducerInterfaces = {
    CHANGR_CURRENT_TYPE: 'CHANGR_CURRENT_TYPE',
    RECEIVE_DELIVERYFEE: 'RECEIVE_DELIVERYFEE',
    RECEIVE_ORDER_LIST: 'RECEIVE_ORDER_LIST',
    RECEIVE_ORDER_DETAIL: 'RECEIVE_ORDER_DETAIL',
    RECEIVE_ORDER_COUNT: 'RECEIVE_ORDER_COUNT',
    RECEIVE_ORDER_ALL_STATUS: 'RECEIVE_ORDER_ALL_STATUS',
    RECEIVE_ABLE_TO_USE_COUPONS: 'RECEIVE_ABLE_TO_USE_COUPONS',
    RECEIVE_POINTCONFIG: 'RECEIVE_POINTCONFIG',
  };
  
  public getPointConfig = () => {
    return `/api/merchant/point/config/detail`;
  }
  public getDeliveryFee = (param) => {
    return `/api/cashier/getDeliveryFee${jsonToQueryString(param)}`;
  }
  public orderList = (params?: OrderInterface.OrderListFetchFidle) => {
    return `/order/list${params ? jsonToQueryString(params) : ''}`;
  }

  public orderDetail = (params: OrderInterface.OrderDetailFetchField) => {
    return `/order/detail/${params.orderNo}`;
  }

  public orderCount = () => {
    return `/order/count`;
  }

  public orderClose = (params: OrderInterface.OrderDetailFetchField) => {
    return `/order/closeOrder/${params.orderNo}`;
  }

  public orderAllStatus = () => {
    return `/order/getAllOrderStatus`;
  }

  public orderRefund = () => {
    return `/cashier/refundByOrder`;
  }

  public orderRefundCancel = (params: OrderInterface.OrderDetailFetchField) => {
    return `/order/cancelRefund/${params.orderNo}`;
  }
}

export default new OrderInterfaceMap();