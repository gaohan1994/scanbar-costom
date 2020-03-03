/**
 * @Author: Ghan 
 * @Date: 2019-11-13 10:16:32 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-02-28 16:35:26
 */
import requestHttp from "../../common/request/request.http";
import { OrderInterfaceMap, OrderInterface, HTTPInterface } from '..';

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

}

export default new OrderService();