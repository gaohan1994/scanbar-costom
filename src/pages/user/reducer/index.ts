import { combineReducers } from "redux";
import userCoupon from "./use-coupon";

export default combineReducers({
  coupon: userCoupon
});
