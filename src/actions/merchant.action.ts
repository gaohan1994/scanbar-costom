/*
 * @Author: centerm.gaozhiying
 * @Date: 2020-03-03 17:19:06
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-06-24 13:41:56
 */
import {
  MerchantService,
  MerchantInterface,
  MerchantInterfaceMap,
  jsonToQueryString
} from "../constants";
import invariant from "invariant";
import { ResponseCode } from "../constants/index";
import { BASE_PARAM } from "../common/util/config";
import requestHttp from "../common/request/request.http";
// import { store } from '../app';
import Taro from "@tarojs/taro";
import productSdk from "../common/sdk/product/product.sdk";
class MerchantAction {
  public addMember = async (
    currentMerchantDetail: MerchantInterface.MerchantDetail
  ) => {
    const result = await requestHttp.post(
      `/memberInfo/add/${currentMerchantDetail.id}`,
      {}
    );
    return result;
  };

  public getOrderedMerchant = dispatch => async params => {
    const result = await requestHttp.get(
      `/customer/merchantInfo/getNearbyMerchant${jsonToQueryString(params)}`
    );
    if (result.code === ResponseCode.success) {
      dispatch({
        type:
          MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ALIANCE_LIST,
        payload: {
          ...result.data,
          field: params
        }
      });
    }
    return result;
  };

  public setCurrentMerchantDetail = dispatch => async merchant => {
    try {
      invariant(!!merchant, "请传入要设置的店铺");
      Taro.showLoading();
      const result = await requestHttp.get(
        `/customer/merchantInfo/detail/${merchant.id}`
      );
      Taro.hideLoading();
      console.log("result", result);
      dispatch({
        type:
          MerchantInterfaceMap.reducerInterface.RECEIVE_CURRENT_MERCHANT_DETAIL,
        payload: { ...merchant, ...result.data }
      });

      dispatch({
        type: productSdk.reducerInterface.INIT_ALIANCE_CART,
        payload: {
          merchant
        }
      });
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  };

  public getNearbyMerchant = dispatch => async params => {
    console.log("params: ", params);
    const result = await requestHttp.get(
      `/customer/merchantInfo/getNearbyMerchant${jsonToQueryString(params)}`
    );
    if (result.code === ResponseCode.success) {
      dispatch({
        type:
          MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ALIANCE_LIST,
        payload: {
          ...result.data,
          field: params
        }
      });
    }
    return result;
  };

  public activityInfoList = async (dispatch, merchantId) => {
    // const merchantId = store.getState().merchant.currentMerchantDetail.id;
    const result = await MerchantService.activityInfoList(merchantId);
    if (result.code === ResponseCode.success) {
      let data: any[] = [];

      if (result.data.rows.length > 0) {
        result.data.rows.map(item => {
          const row = {
            ...item,
            rule:
              !!item.rule && item.rule.length > 0
                ? JSON.parse(item.rule)
                : item.rule
          };
          data.push(row);
        });
      }
      console.log("activityInfoList", result);
      dispatch({
        type:
          MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ACTIVITYLIST,
        payload: data
      });
    }
    return result;
  };

  /**
   * @todo 根据商户id获取商户详情
   *
   * @memberof MerchantAction
   */
  public merchantDetail = async (
    dispatch,
    params: MerchantInterface.merchantDetailFetchField
  ) => {
    const result = await MerchantService.merchantInfoDetail(params);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_DETAIL,
        payload: result.data
      });
    }
    return result;
  };

  /**
   * @todo 获取门店列表
   *
   * @memberof MerchantAction
   */
  public merchantList = async dispatch => {
    const result = await MerchantService.merchantList();
    if (result.code === ResponseCode.success) {
      dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_LIST,
        payload: result.data.rows
      });
      if (result.data.rows && result.data.rows.length > 0) {
        dispatch({
          type:
            MerchantInterfaceMap.reducerInterface
              .RECEIVE_CURRENT_MERCHANT_DETAIL,
          payload: result.data.rows.filter(
            val => val.id === BASE_PARAM.MCHID
          )[0] || { merchantId: BASE_PARAM.MCHID }
        });
        this.advertisement(dispatch, { merchantId: BASE_PARAM.MCHID });
      }
    }
    return result;
  };

  /**
   * @todo 获取商户距离
   *
   * @memberof MerchantAction
   */
  public merchantDistance = async (
    dispatch,
    params: MerchantInterface.merchantDistanceFetchField
  ) => {
    const result = await MerchantService.merchantDistance(params);
    if (result.code === ResponseCode.success) {
      dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_DISTANCE,
        payload: result.data
      });
    }
    return result;
  };

  public advertisement = async (
    dispatch,
    params: MerchantInterface.merchantDetailFetchField
  ) => {
    const result = await MerchantService.advertisement(params);
    if (result.code === ResponseCode.success) {
      dispatch({
        type:
          MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ADVERTISEMENT,
        payload: result.data.rows
      });
    }
    return result;
  };
}

export default new MerchantAction();
