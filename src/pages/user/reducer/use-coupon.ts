import { IUserStore } from "../types/index";

export const initState: IUserStore.IUserState = {
  couponList: []
};

export const ACTION_TYPES = {
  RECEIVE_COUPON_LIST: "RECEIVE_COUPON_LIST"
};

export default function userCoupon(
  state: IUserStore.IUserState = initState,
  action
): IUserStore.IUserState {
  switch (action.type) {
    case ACTION_TYPES.RECEIVE_COUPON_LIST: {
      const { data } = action.payload;
      return {
        couponList: data
      };
    }
    default:
      // throw new Error("userCoupon reducer error");
      return {
        ...state
      };
  }
}
