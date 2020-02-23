import { MerchantService, MerchantInterface, MerchantInterfaceMap, jsonToQueryString } from "../constants";
import { ResponseCode } from '../constants/index';
import { store } from '../app';
import requestHttp from "../common/request/request.http";

class MerchantAction {

  public merchantDetail = async () => {
    const result = await MerchantService.merchantInfoDetail();
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_DETAIL,
        payload: result.data
      });
    }
    return result;
  }

  public merchantInfoAdd = async (params: MerchantInterface.PayloadInterface.MerchantInfoAdd) => {
    const result = await MerchantService.merchantInfoAdd(params);
    return result;
  }

  public merchantDistance = async (params: any) => {
    const result = await requestHttp.get(`/api/merchantInfo/distance${jsonToQueryString(params)}`)
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_DISTANCE,
        payload: result.data
      })
    }
    return result;
  }

  public profileInfo = async () => {
    const result = await MerchantService.profileInfo();
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_PROFILE_INFO,
        payload: result.data
      });
    }
    return result;
  }

  public addressDelete = async (params: any) => {
    const result = await requestHttp.delete(`/api/address/remove/${params.id}`, '');
    return result;
  }

  public addressList = async () => {
    const result = await MerchantService.addressList();
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_ADDRESS_LIST,
        payload: result.data
      });
    }
    return result;
  }

  public addressEdit = async (params: any) => {
    const result = await MerchantService.addressEdit(params);
    return result;
  }

  public addressAdd = async (params: any) => {
    const result = await MerchantService.addressAdd(params);
    return result;
  }

  public wxUserInfoSave = async (params: Partial<MerchantInterface.WxUserInfo>) => {
    const result = await MerchantService.wxUserInfoSave(params);
    return result;
  }
}

export default new MerchantAction();