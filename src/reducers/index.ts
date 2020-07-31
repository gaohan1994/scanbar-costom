import { combineReducers } from "redux";
import product, { ProductReducer } from "./app.product";
import pay, { PayReducer } from "./app.pay";
import order, { OrderReducer } from "./app.order";
import user, { UserReducer } from "./app.user";
import merchant, { MerchantReducer } from "./app.merchant";
import productSDK, {
  ProductSDKReducer
} from "../common/sdk/product/product.sdk.reducer";

export declare namespace AppReducer {
  interface AppState {
    product: ProductReducer.InitState;
    productSDK: ProductSDKReducer.State;
    pay: PayReducer.State;
    order: OrderReducer.State;
    merchant: MerchantReducer.State;
    user: UserReducer.State;
  }
}

export default combineReducers({
  product,
  productSDK,
  pay,
  order,
  merchant,
  user,
});
