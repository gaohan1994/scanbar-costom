/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-03-03 17:44:36 
 * @Last Modified by:   centerm.gaozhiying 
 * @Last Modified time: 2020-03-03 17:44:36 
 */
import { ResponseCode, ProductInterfaceMap, ProductInterface, ProductService } from '../constants/index';
import { store } from '../app';
import Taro from '@tarojs/taro';

const CentermProductSearchKey = 'CentermProductSearchKeyC';

class ProductAction {

  /**
   * @todo 获取商品列表
   *
   * @memberof ProductAction
   */
  public productInfoList = async (params?: ProductInterface.ProductInfoListFetchFidle) => {
    const result = await ProductService.productInfoList(params);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_LIST,
        payload: result.data
      });
    }
    return result;
  }

  /**
   * @todo 获取搜素商品列表列表
   *
   * @memberof ProductAction
   */
  public productInfoSearchList = async (params: ProductInterface.ProductInfoListFetchFidle) => {
    const result = await ProductService.productInfoList(params);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_SEARCH_LIST,
        payload: result.data
      });
      return { success: true, result: result.data };
    } else {
      return { success: false, result: result.msg };
    }
  }

  /**
   * @todo 清空搜索商品列表
   *
   * @memberof ProductAction
   */
  public productInfoEmptySearchList = async () => {
    store.dispatch({
      type: ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_SEARCH_LIST,
      payload: {rows: []}
    });
  }

  /**
   * @todo 获取商品类型列表
   *
   * @memberof ProductAction
   */
  public productInfoType = async () => {
    const result = await ProductService.productInfoType();
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_TYPE,
        payload: result.data
      });
      return result;
    } else {
      return result;
    }
  }

  /**
   * @todo 获取商品详情
   *
   * @memberof ProductAction
   */
  public productInfoDetail = async (params: ProductInterface.ProductDetailFetchFidle) => {
    const result = await ProductService.productInfoDetail(params);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_DETAIL,
        payload: result.data
      });
      return result;
    } else {
      return result;
    }
  }

  /**
   * @todo 设置搜索记录列表
   *
   * @memberof ProductAction
   */
  public setSearchRecord = (list: string[]) => {
    return new Promise((resolve) => {
      Taro
        .setStorage({ key: CentermProductSearchKey, data: JSON.stringify(list) })
        .then(() => {
          resolve({success: true, list, msg: ''});
        })
        .catch(error => resolve({success: false, result: {} as any, msg: error.message || '保存搜索记录失败失败'}));
    });
  }

  /**
   * @todo 获取搜索记录列表
   *
   * @memberof ProductAction
   */
  public getSearchRecord = (): Promise<any> => {
    return new Promise((resolve) => {
      Taro
        .getStorage({ key: CentermProductSearchKey })
        .then(data => {
          if (data.data !== '') {
            resolve({ success: true, result: JSON.parse(data.data), msg: '' });
          } else {
            resolve({ success: false, result: {} as any, msg: '获取搜索记录失败' });
          }
        })
        .catch(error => {
          resolve({ success: false, result: {} as any, msg: error.message });
        });
    });
  }
}

export default new ProductAction();