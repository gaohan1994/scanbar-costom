import productSdk, { ProductCartInterface } from "./product.sdk";
import { AppReducer } from "../../../reducers";
import { ProductInterface, UserInterface } from "../../../constants";
import merge from 'lodash.merge';

/**
 * @Author: Ghan 
 * @Date: 2019-11-22 14:20:31 
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-04-14 09:51:03
 * @todo productsdk
 */
export declare namespace ProductSDKReducer {

  interface State {
    productCartList: Array<ProductCartInterface.ProductCartInfo>;
    productCartSelectedIndex: Array<number>;
    payOrderProductList: Array<ProductCartInterface.ProductCartInfo>;
    payOrderDetail: any;
    payOrderAddress: UserInterface.Address;
    pointsTotal: number;
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
    interface CartSelectedIndex {
      type: string;
      payload: {
        type: string;
        product: ProductCartInterface.ProductCartInfo;
        products?: ProductCartInterface.ProductCartInfo[];
      }
    }
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
    | Reducers.CartSelectedIndex;
}

const initState: ProductSDKReducer.State = {
  productCartList: [],
  productCartSelectedIndex: [],
  payOrderProductList: [],
  payOrderDetail: {
    deliveryType: 0,
    remark: ''
  },
  payOrderAddress: {} as any,
  pointsTotal: 0,
};

export default function productSDKReducer(
  state: ProductSDKReducer.State = initState,
  action: ProductSDKReducer.Action
): ProductSDKReducer.State {
  switch (action.type) {

    case productSdk.reducerInterface.SELECT_INDEX: {
      const { payload } = action as ProductSDKReducer.Reducers.CartSelectedIndex;
      const { productCartList } = state;
      const { product, products, type = 'normal' } = payload;
      
      if (type === 'empty') {
        let nextProductCartSelectedIndex = merge([], state.productCartSelectedIndex);
        nextProductCartSelectedIndex = nextProductCartSelectedIndex.filter((index) => {
          return products && products.some((p) => p !== index);
        });
        return {
          ...state,
          productCartSelectedIndex: !products
            ? []
            : nextProductCartSelectedIndex
        };
      }

      /**
       * @todo [如果是全选/取消全选]
       */
      if (type === 'all') {
        return {
          ...state,
          productCartSelectedIndex: productCartList.length === 0 
            ? []
              : state.productCartSelectedIndex.length > 0 
                ? [] 
                : productCartList.map((item) => item.id)
        }
      }

      /**
       * @todo [选择/取消选择商品]
       */
      const nextProductCartSelectedIndex: number[] = merge([], state.productCartSelectedIndex);
      const index = nextProductCartSelectedIndex.findIndex((i) => i === product.id);
      if (index !== -1) {
        nextProductCartSelectedIndex.splice(index, 1);
      } else {
        nextProductCartSelectedIndex.push(product.id);
      }
      
      return {
        ...state,
        productCartSelectedIndex: nextProductCartSelectedIndex
      };
    }

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
    case productSdk.reducerInterface.RECEIVE_ORDER_PAY_POINTS: {
      const { payload } = action as any;

      return {
        ...state,
        pointsTotal: payload
      };
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
          const reduceNum = num || 1;
          if (currentItem.sellNum === reduceNum) {
            newProductCartList.splice(index, 1);
            return {
              ...state,
              productCartList: newProductCartList,
            };
          } else {
            newProductCartList[index].sellNum -= reduceNum;
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
    case productSdk.reducerInterface.MANAGE_CART_PRODUCT_REMOVE: {

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