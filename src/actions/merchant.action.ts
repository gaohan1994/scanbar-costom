/*
 * @Author: centerm.gaozhiying
 * @Date: 2020-03-03 17:19:06
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-07-28 11:18:07
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
import { store } from "../app";
class MerchantAction {
  public addMember = async (
    currentMerchantDetail: MerchantInterface.MerchantDetail
  ) => {
    const result = await requestHttp.post(
      `/memberInfo/add/${currentMerchantDetail.id}`,
      {}
    );
    if (result.code === ResponseCode.success) {
      return { success: true, result: result.data };
    } else {
      return { success: false, result: result.msg };
    }
  };

  public getOrderedMerchant = dispatch => async params => {
    const result = await requestHttp.get(
      `/merchantInfo/getOrderedMerchant${jsonToQueryString(params)}`
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

  public getMerchantDetail = async merchant => {
    Taro.showLoading();
    const result = await requestHttp.get(`/merchantInfo/detail/${merchant.id}`);
    Taro.hideLoading();
    console.log("result", result);
    store.dispatch({
      type:
        MerchantInterfaceMap.reducerInterface.RECEIVE_CURRENT_MERCHANT_DETAIL,
      payload: { ...merchant, ...result.data }
    });
  };

  public getMerchantMoreDetail = async (merchant: any) => {
    const result = await requestHttp.get(
      `/merchantInfo/moreDetail/${merchant.id}`
    );
    if (result.code === ResponseCode.success) {
      return {
        success: true,
        result: result.data
      }
    } else {
      return {
        success: false,
        result: result.msg
      }
    }
  }

  public setCurrentMerchantDetail = dispatch => async merchant => {
    try {
      invariant(!!merchant, "请传入要设置的店铺");
      Taro.showLoading();
      const result = await requestHttp.get(
        `/merchantInfo/moreDetail/${merchant.id}`
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
      `/merchantInfo/getNearbyMerchant${jsonToQueryString(params)}`
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
        this.advertisement(dispatch);
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

  public advertisement = async (dispatch) => {
    const result = await MerchantService.advertisement();
    if (result.code === ResponseCode.success) {
      dispatch({
        type:
          MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ADVERTISEMENT,
        payload: result.data.rows
      });
    }
    return result;
  };

  public addMerchantAttention = async (
    merchant: MerchantInterface.AlianceMerchant
  ) => {
    const result = await requestHttp.post(
      `/merchantInfo/addMerchantAttention/${merchant.id}`,
      {}
    );
    return result;
  };

  public cancelMerchantAttention = async (
    merchant: MerchantInterface.AlianceMerchant
  ) => {
    const result = await requestHttp.delete(
      `/merchantInfo/cancelMerchantAttention/${merchant.id}`
    );
    return result;
  };

  public merchantEmptySearchList = async (dispatch) => {
    dispatch({
      type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_SEARCH_LIST,
      payload: { rows: [], field: { pageNum: 1 }, total: 0 }
    });
  }

  /**
 * @todo 获取搜素商品列表列表
 *
 * @memberof MerchantAction
 */
  public merchantSearchList = async (dispatch, params: any) => {
    const result = await requestHttp.get(
      `/merchantInfo/search/${params.name}`,
      params
    );
    if (result.code === ResponseCode.success) {
      dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_SEARCH_LIST,
        payload: { rows: result.data.rows, field: params, total: result.data.total }
      });
      return { success: true, result: result.data };
    } else {
      return { success: false, result: result.msg };
    }
  }

  public merchantMoreInfo = async (merchantId: number) => {
    const result = await requestHttp.get(
      `/merchantInfo/moreDetail/${merchantId}`,
    );
    if (result.code === ResponseCode.success) {
      return { success: true, result: result.data };
    } else {
      return { success: false, result: result.msg };
    }
  }
}

export default new MerchantAction();
