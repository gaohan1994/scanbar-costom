/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-03-03 17:19:06 
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-04-07 18:11:45
 */
import { 
  MerchantService, 
  MerchantInterface, 
  MerchantInterfaceMap, 
} from "../constants";
import { ResponseCode } from '../constants/index';
import { BASE_PARAM } from '../common/util/config';
// import { store } from '../app';

class MerchantAction {
  /**
   * @todo 设置支付方式
   *
   * @memberof MerchantAction
   */
  public setPayType = async (dispatch, type) => {
    dispatch({
      type: MerchantInterfaceMap.reducerInterface.SET_PAYTYPE,
      payload: {
        orderPayType: type
      }
    })
  }
  public activityInfoList = async (dispatch, merchantId) => {
    // const merchantId = store.getState().merchant.currentMerchantDetail.id;
    const result = await MerchantService.activityInfoList(merchantId);
    if (result.code === ResponseCode.success) {

      let data: any[] = [];

      if (result.data.rows.length > 0) {
        result.data.rows.map((item) => {
          const row = {
            ...item,
            rule: !!item.rule && item.rule.length > 0 ? JSON.parse(item.rule) : item.rule,
          };
          data.push(row);
        });
      }
      
      dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ACTIVITYLIST,
        payload: data
      })
    }
    return result;
  }

  /**
   * @todo 根据商户id获取商户详情
   *
   * @memberof MerchantAction
   */
  public merchantDetail = async (dispatch, params: MerchantInterface.merchantDetailFetchField) => {
    const result = await MerchantService.merchantInfoDetail(params);
    if (result.code === ResponseCode.success) {
      dispatch({
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
  public merchantList = async (dispatch, param, currentMerchantDetail) => {
    const result = await MerchantService.merchantList(param);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_LIST,
        payload: result.data.rows
      });
      if (result.data.rows && result.data.rows.length > 0) {
        dispatch({
          type: MerchantInterfaceMap.reducerInterface.RECEIVE_CURRENT_MERCHANT_DETAIL,
          payload: result.data.rows.filter(val => val.id ===  currentMerchantDetail.id)[0] || {merchantId: currentMerchantDetail.id}
        });
        this.advertisement(dispatch, {merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : BASE_PARAM.MCHID});
      }
    }
    return result;
  }

  /**
   * @todo 获取商户距离
   *
   * @memberof MerchantAction
   */
  public merchantDistance = async (dispatch, params: MerchantInterface.merchantDistanceFetchField) => {
    const result = await MerchantService.merchantDistance(params);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_DISTANCE,
        payload: result.data
      })
    }
    return result;
  }
  
  public advertisement = async(dispatch, params: MerchantInterface.merchantDetailFetchField) => {
    const result = await MerchantService.advertisement(params);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ADVERTISEMENT,
        payload: result.data.rows
      });
    }
    return result;
  }
  public onGetStroke = async(dispatch, params: any) => {
    const result = await MerchantService.onGetStroke(params);
    if (result.code === ResponseCode.success) {
      // dispatch({
      //   type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ADVERTISEMENT,
      //   payload: result.data.rows
      // });
      localStorage.setItem('Stroke', JSON.stringify(result.data));
    }
    return result;
  }
}

export default new MerchantAction();