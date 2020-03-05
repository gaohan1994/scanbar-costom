import productSdk, { ProductCartInterface } from "./product.sdk";
import { AppReducer } from "../../../reducers";
import { ProductInterface, UserInterface } from "../../../constants";
import merge from 'lodash.merge';

/**
 * @Author: Ghan 
 * @Date: 2019-11-22 14:20:31 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-03 21:25:12
 * @todo productsdk
 */
export declare namespace ProductSDKReducer {

  interface State {
    productCartList: Array<ProductCartInterface.ProductCartInfo>;
    payOrderProductList: Array<ProductCartInterface.ProductCartInfo>;
    payOrderDetail: any;
    payOrderAddress: UserInterface.Address;
  }

  interface ManageCartPayloadBase {
    product: ProductInterface.ProductInfo;
    type: ProductCartInterface.ProductCartAdd | ProductCartInterface.ProductCartReduce;
    num?: number;
  }

  /**
   * @todo 添加/减少 普通商品
   *
   * @author Ghan
   * @interface ProductManageCart
   */
  interface ProductManageCart {
    type: ProductCartInterface.MANAGE_CART_PRODUCT;
    payload: ManageCartPayloadBase;
  }

  namespace Reducers {
    interface ReceivePayOrderReducer {
      type: string;
      payload: {
        productList: ProductCartInterface.ProductCartInfo[];
      }
    }
    interface DeleteProductItemreducer {
      type: ProductCartInterface.DELETE_PRODUCT_ITEM;
      payload: {
        product: ProductCartInterface.ProductCartInfo;
        sort: string;
      };
    }
    interface ManageCartList {
      type: ProductCartInterface.MANAGE_CART;
      payload: { productCartList: ProductCartInterface.ProductCartInfo[] };
    }
  }

  type Action =
    ProductManageCart
    | Reducers.ManageCartList
    | Reducers.ReceivePayOrderReducer
}

const initState: ProductSDKReducer.State = {
  productCartList: [],
  payOrderProductList: [],
  payOrderDetail: {
    deliveryType: 0,
    remark: ''
  },
  payOrderAddress: {} as any,
};

export default function productSDKReducer(
  state: ProductSDKReducer.State = initState,
  action: ProductSDKReducer.Action
): ProductSDKReducer.State {
  switch (action.type) {

    case productSdk.reducerInterface.RECEIVE_ORDER_PAY_DETAIL: {
      const { payload } = action as any;
      if (payload === {}) {
        return {
          ...state,
          payOrderDetail: payload
        }
      }
      return {
        ...state,
        payOrderDetail: {
          ...state.payOrderDetail,
          ...payload
        }
      }
    }

    case productSdk.reducerInterface.RECEIVE_ORDER_PAY_ADDRESS: {
      const { payload } = action as any;

      return {
        ...state,
        payOrderAddress: payload
      };
    }

    case productSdk.reducerInterface.RECEIVE_ORDER_PAY: {
      const { payload } = action as ProductSDKReducer.Reducers.ReceivePayOrderReducer;
      const { productList } = payload;

      return {
        ...state,
        payOrderProductList: productList
      };
    }

    case productSdk.reducerInterface.MANAGE_CART: {
      const { payload } = action as ProductSDKReducer.Reducers.ManageCartList;
      const { productCartList } = payload;
      return {
        ...state,
        productCartList: productCartList
      };
    }
    case productSdk.reducerInterface.MANAGE_EMPTY_CART: {
      return {
        ...state,
        productCartList: [],
      };
    }
    case productSdk.reducerInterface.MANAGE_CART_PRODUCT: {
      const { payload } = action as ProductSDKReducer.ProductManageCart;
      const { product, type, num } = payload;

      const productCartList: Array<ProductCartInterface.ProductCartInfo> = merge([], state.productCartList);
      const index = productCartList.findIndex(p => p.id === product.id);
      if (type === productSdk.productCartManageType.ADD) {
        /**
         * @todo [如果是普通商品，如果购物车中有了则+1]
         * @todo [如果是普通商品，如果购物车中没有则新增一个数量为1]
         */
        let newProductCartList: Array<ProductCartInterface.ProductCartInfo> = merge([], productCartList);
        if (index === -1) {
          newProductCartList.push({
            ...product,
            sellNum: (num || 1)
          });
          return {
            ...state,
            productCartList: newProductCartList
          };
        } else {
          newProductCartList[index].sellNum += (num || 1);;
          return {
            ...state,
            productCartList: newProductCartList
          };
        }
      } else {
        if (index !== -1) {
          let newProductCartList: Array<ProductCartInterface.ProductCartInfo> = merge([], productCartList);
          const currentItem = newProductCartList[index];
          if (currentItem.sellNum === 1) {
            newProductCartList.splice(index, 1);
            return {
              ...state,
              productCartList: newProductCartList,
            };
          } else {
            newProductCartList[index].sellNum -= 1;
            return {
              ...state,
              productCartList: newProductCartList
            };
          }
        } else {
          return { ...state };
        }
      }
    }
    default: {
      return {
        ...state
      };
    }
  }
}

export const getProductCartList = (state: AppReducer.AppState) => state.productSDK.productCartList;

export const getPayOrderAddress = (state: AppReducer.AppState) => state.productSDK.payOrderAddress;

export const getPayOrderDetail = (state: AppReducer.AppState) => state.productSDK.payOrderDetail;