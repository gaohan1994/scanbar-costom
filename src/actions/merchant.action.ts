/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-03-03 17:19:06 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-16 09:52:08
 */
import { 
  MerchantService, 
  MerchantInterface, 
  MerchantInterfaceMap, 
} from "../constants";
import { ResponseCode } from '../constants/index';
import { store } from '../app';

class MerchantAction {

  /**
   * @todo 根据商户id获取商户详情
   *
   * @memberof MerchantAction
   */
  public merchantDetail = async (params: MerchantInterface.merchantDetailFetchField) => {
    const result = await MerchantService.merchantInfoDetail(params);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_DETAIL,
        payload: result.data
      });
    }
    return result;
  }

  /**
   * @todo 获取门店列表
   *
   * @memberof MerchantAction
   */
  public merchantList = async () => {
    const result = await MerchantService.merchantList();
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_LIST,
        payload: result.data.rows
      });
      if (result.data.rows && result.data.rows.length > 0) {
        store.dispatch({
          type: MerchantInterfaceMap.reducerInterface.RECEIVE_CURRENT_MERCHANT_DETAIL,
          payload: result.data.rows[0]
        });
        this.advertisement({merchantId: result.data.rows[0].id});
      }
    }
    return result;
  }

  /**
   * @todo 获取商户距离
   *
   * @memberof MerchantAction
   */
  public merchantDistance = async (params: MerchantInterface.merchantDistanceFetchField) => {
    const result = await MerchantService.merchantDistance(params);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_DISTANCE,
        payload: result.data
      })
    }
    return result;
  }

  public advertisement = async(params: MerchantInterface.merchantDetailFetchField) => {
    const result = await MerchantService.advertisement(params);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ADVERTISEMENT,
        payload: result.data.rows
      });
    }
    return result;
  }
}

export default new MerchantAction();