import { ResponseCode, ProductInterfaceMap, ProductInterface, ProductService } from '../constants/index';
import { store } from '../app';
import Taro from '@tarojs/taro';

const CentermProductSearchKey = 'CentermProductSearchKeyC';

class ProductAction {

  public productInfoList = async (params?: ProductInterface.ProductInfoListFetchFidle) => {
    const result = await ProductService.productInfoList(params);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_MANAGE_LIST,
        payload: result.data
      });
      return { success: true, result: result.data };
    } else {
      return { success: false, result: result.msg };
    }
  }

  public productOrderInfoList = async (params?: ProductInterface.ProductInfoListFetchFidle) => {
    const result = await ProductService.productInfoList(params);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_LIST,
        payload: result.data
      });
    }
    return result;
  }


  public productInfoGetList = async (params?: any) => {
    const result = await ProductService.productInfoGetList();
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_LIST,
        payload: result.data
      });
      return { success: true, result: result.data };
    } else {
      return { success: false, result: result.msg };
    }
  }

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

  public productInfoEmptySearchList = async () => {
    store.dispatch({
      type: ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_SEARCH_LIST,
      payload: {rows: []}
    });
  }

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

  public productInfoSupplier = async () => {
    const result = await ProductService.productInfoSupplier();
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_SUPPLIER,
        payload: result.data
      });
      return result;
    } else {
      return result;
    }
  }

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

  public productInfoEdit = async (params: Partial<ProductInterface.ProductInfo>) => {
    return ProductService.productInfoEdit(params);
  }

  public productRefund = async (params: ProductInterface.CashierRefund) => {
    return ProductService.cashierRefund(params);
  }

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