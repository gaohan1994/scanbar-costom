/**
 * @Author: Ghan 
 * @Date: 2019-11-13 10:16:32 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-13 09:27:25
 */
import requestHttp from "../../common/request/request.http";
import { OrderInterfaceMap, OrderInterface, HTTPInterface } from '..';
import { BASE_PARAM } from '../../common/util/config'

class OrderService {
  public orderList = async (params?: OrderInterface.OrderListFetchFidle): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.get(OrderInterfaceMap.orderList(params));
  }

  public orderDetail = async (params: OrderInterface.OrderDetailFetchField): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.get(OrderInterfaceMap.orderDetail(params));
  }

  public orderCount = async (): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.get(OrderInterfaceMap.orderCount());
  }

  public orderClose = async (params: OrderInterface.OrderDetailFetchField): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.post(OrderInterfaceMap.orderClose(params), params);
  }

  public orderAllStatus = async (): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.get(OrderInterfaceMap.orderAllStatus());
  }

  public orderRefund = async (params: OrderInterface.RefundOrderParams): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.post(OrderInterfaceMap.orderRefund(), params)
  }

  public orderRefundCancel = async (params: OrderInterface.OrderDetailFetchField): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.post(OrderInterfaceMap.orderRefundCancel(params), params);
  }

  public getAbleToUseCoupon = async (params: any): Promise<HTTPInterface.ResponseResultBase<any>> => {
  const result = await requestHttp.post('/api/coupon/getAbleToUseCoupon', {
        merchantId: BASE_PARAM.MCHID,
        ...params,
    });
    return result;
  }
  public getDeliveryFee = async (param): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.get(OrderInterfaceMap.getDeliveryFee(param));
  }
  public getPointConfig = async (merchantId: number): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.get(OrderInterfaceMap.getPointConfig(merchantId));
  }
}

export default new OrderService();