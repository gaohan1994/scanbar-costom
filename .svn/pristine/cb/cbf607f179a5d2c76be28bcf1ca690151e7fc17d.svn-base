/**
 * @Author: Ghan 
 * @Date: 2019-11-13 10:16:32 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-09 14:06:46
 */
import requestHttp from "../../common/request/request.http";
import ProductInterfaceMap, { ProductInterface } from "./product";
import { HTTPInterface } from "..";
import { ProductCartInterface } from "../../common/sdk/product/product.sdk";

class ProductService {
  /**
   * @todo 商品管理用的查询商品接口
   *
   * @memberof ProductService
   */
  public productInfoList = async (params?: ProductInterface.ProductInfoListFetchFidle): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.get(ProductInterfaceMap.productInfoList(params));
  }

  public productInfoType = async (params?: ProductInterface.ProductInfoTypeFetchFidle): Promise<HTTPInterface.ResponseResultBase<ProductInterface.ProductTypeInfo[]>> => {
    return requestHttp.get(ProductInterfaceMap.productInfoType(params));
  }

  /**
   * @todo 查询商品详情
   *
   * @memberof ProductService
   */
  public productInfoDetail = async (params: ProductInterface.ProductDetailFetchFidle): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.get(ProductInterfaceMap.productInfoDetail(params));
  }
  
  public confirmOrder = async (params: ProductCartInterface.ProductPayPayload): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.post(ProductInterfaceMap.confirmOrder, params);
  }
  public cashierOrder = async (params: ProductCartInterface.ProductPayPayload): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.post(ProductInterfaceMap.cashierOrder, params);
  }

  public cashierPay = async (params: ProductCartInterface.ProductPayPayload): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return requestHttp.post(ProductInterfaceMap.cashierPay, params);
  }

  /**
   * @todo 查询支付状态
   *
   * @memberof ProductService
   */
  public cashierQueryStatus = async (params: ProductInterface.ProductCashierQueryStatus): 
    Promise<HTTPInterface.ResponseResultBase<ProductCartInterface.QueryStatus>> => {
    return requestHttp.post(ProductInterfaceMap.cashierQueryStatus(params), '');
  }
}

export default new ProductService();