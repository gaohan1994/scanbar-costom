import Taro from "@tarojs/taro";
import productSdk from "../common/sdk/product/product.sdk";
import { getProductCartList } from "../common/sdk/product/product.sdk.reducer";

/**
 * @todo 给购物车加角标
 */

const tabIndex = 2;
export default store => next => action => {
  const state = store.getState();

  const total = productSdk.getProductNumber(getProductCartList(state));
  const { type, payload } = action;

  if (type === "MANAGE_CART_BADGE") {
    if (total === 0) {
      Taro.removeTabBarBadge({ index: tabIndex });
    } else {
      Taro.setTabBarBadge({
        index: tabIndex,
        text: `${total}`
      });
    }
  }

  if (type === "MANAGE_CART_PRODUCT") {
    if (payload.type === "ADD") {
      Taro.setTabBarBadge({
        index: tabIndex,
        text: `${total + (payload.num || 1)}`
      });
    } else {
      if (total - (payload.num || 1) <= 0) {
        Taro.removeTabBarBadge({ index: tabIndex });
      } else {
        Taro.setTabBarBadge({
          index: tabIndex,
          text: `${total - (payload.num || 1)}`
        });
      }
    }
  }

  return next(action);
};
