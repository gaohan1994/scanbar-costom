import { useRedux } from "../../../common/redux-hooks-util";
const logger = require("redux-logger").createLogger();
import thunkMiddleware from "redux-thunk";
import reducer from "../reducer/use-coupon";
import { Dispatch } from "redux";
import { IUserStore } from "../types";
import { MerchantInterface } from "src/constants";
import { getAvailableCoupon } from "../constant/api";

// const middleWares = [logger, thunkMiddleware];

export const useStore = (
  merchant: MerchantInterface.AlianceMerchant,
  callback?: (errorMessage: string) => void
): {
  state?: any;
  dispatch?: Dispatch;
  couponList: IUserStore.UserCoupon[];
} => {
  const { state, dispatch } = useRedux(reducer);

  return {
    // state,
    dispatch: dispatch,
    couponList: []
  };
};
