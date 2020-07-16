import requestHttp from "../../../common/request/request.http";
import { jsonToQueryString } from "../../../constants";

/**
 * @todo 查询我的全部可用优惠券列表
 * @param params 请求参数 空
 * @param callback 请求回调
 */
export const getAvailableCoupon = async (
  params: any,
  callback: (response: any) => void
) => {
  requestHttp
    .get(`/coupon/getMyAvailableCoupon${jsonToQueryString(params)}`)
    .then(response => {
      callback(response);
    });
};

export const getMemberInfo = async (merchantId: string) => {
  const result = await requestHttp.get(
    `/memberInfo/getMemberInfo/${merchantId}`
  );
  return result;
};
