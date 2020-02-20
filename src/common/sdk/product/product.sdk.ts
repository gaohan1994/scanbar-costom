/**
 * @Author: Ghan 
 * @Date: 2019-11-22 11:12:09 
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-01-17 09:46:34
 * 
 * @todo 购物车、下单模块sdk
 * ```ts
 * import ProductSDK from 'xx/ProductSDK';
 * 
 * ProductSDK.add(product);
 * ProductSDK.reduce(product);
 * 
 * ProductSDK.manage({
 *  type: 'add',
 *  product: product,
 * });
 * ```
 */
import Taro from '@tarojs/taro';
import { ProductInterface, ProductService, MemberInterface, HTTPInterface, MerchantInterface, OrderInterface, ResponseCode } from '../../../constants';
import { store } from '../../../app';
import { ProductSDKReducer, getSuspensionCartList } from './product.sdk.reducer';
import numeral from 'numeral';
import merge from 'lodash.merge';
import productService from '../../../constants/product/product.service';
import requestHttp from '../../../common/request/request.http';

export declare namespace ProductCartInterface {
  interface ProductCartInfo extends ProductInterface.ProductInfo {
    sellNum: number;
    changePrice?: number; // 称重商品修改的价格
  }

  interface ProductOrderPayload {
    address: string;
		addressDetail: string;
		deliveryPhone: string;
    delivery_time: string;
    deliveryType: number;
    receiver: string;
    receiverPhone: string;
    payType: number;
		remark: string;
    discount: number;     // 优惠价格
    erase: number;        // 抹零金额
    merchantId: number;
    memberId: number;     // 会员id，非会员设为-1
    orderSource: number;  // 订单来源 0=收银机,1=微信,2=终端
    totalAmount: number;  // 交易总金额=交易金额就好
    totalNum: number;     // 商品总数量
    transAmount: number;  // 实付金额
  }

  interface ProductOrderActivity {
    auditTime: string;    // 审核时间
    auditor: string;      // 审核人
    createBy: string;     // 创建者
    createTime: string;   // 创建日期
    docMaker: string;     // 制单人
    endTime: string;      // 活动结束时间
    id: number;           // 业务单号id（促销活动id）
    isDeleted: number;    // 是否删除 0:否 1:是
    makeTime: string;     // 制单时间
    merchantId: number;   // 促销门店号
    name: string;         // 促销活动名称
    startTime: string;    // 活动开始时间
    status: string;       // 活动状态(0-未审核，1-已审核)
    type: string;         // 促销模式(1-特价，2-满金额减，3-满件打折，4-满件赠送)
    updateBy: string;     // 更新者
    updateTime: string;   // 更新日期
  }

  interface ProductInfoPayload {
    // activities: Array<Partial<ProductOrderActivity>>;
    // barcode: string;
    // brand: string;
    // discountAmount: number;
    // discountType: number;
    productId: number;
    productName: string;
    sellNum: number;
    // standard: string;
    unitPrice: number;
    totalAmount: number;
    transAmount: number;
    // type: number;
  }

  interface ProductPayPayload {
    // flag: boolean;
    order: ProductOrderPayload;
    pic?: string;
    productInfoList: Array<ProductInfoPayload>;
    // transProp: boolean;   // true=正常支付流程,false=订单再次支付],直接收款=true
  }

  interface QueryStatusListItem extends Partial<ProductInterface.ProductInfo> {
    costAmount: number;
    discountAmount: number;
    discountType: number;
    merchantId: number;
    num: number;
    profit: number;
    totalAmount: number;
    transAmount: number;
    type: number;
  }

  interface QueryStatus {
    orderNo: string;
    status: boolean;
    printInfo?: {
      order: ProductOrderPayload;
      orderDetailList: QueryStatusListItem[];
    };
  }

  type MANAGE_CART = string;
  type MANAGE_CART_PRODUCT = string;
  type MANAGE_CART_WEIGHT_PRODUCT = string;
  type CHANGE_WEIGHT_PRODUCT_MODAL = string;
  type MANAGE_EMPTY_CART = string;
  type ADD_SUSPENSION_CART = string;
  type DELETE_SUSPENSION_CART = string;
  type EMPTY_SUSPENSION_CART = string;
  type DELETE_PRODUCT_ITEM = string;
  type CHANGE_NON_BARCODE_PRODUCT = string;
  type CHANGE_PRODUCT = string;
  type CHANGE_PRODUCT_VISIBLE = string;
  type PAYLOAD_ORDER = string;
  type PAYLOAD_REFUND = string;
  type PAYLOAD_PURCHASE = string;
  type PAYLOAD_MANAGE = string;
  type PAYLOAD_STOCK = string;
  type RECEIVE_ORDER_PAY = string;
  type RECEIVE_ORDER_PAY_ADDRESS = string;
  type RECEIVE_ORDER_PAY_DETAIL = string;
  
  type PAYLOAD_SORT = {
    PAYLOAD_ORDER: PAYLOAD_ORDER;
    PAYLOAD_REFUND: PAYLOAD_REFUND;
    PAYLOAD_PURCHASE: PAYLOAD_PURCHASE;
    PAYLOAD_MANAGE: PAYLOAD_MANAGE;
    PAYLOAD_STOCK: PAYLOAD_STOCK;
  };

  type ReducerInterface = {
    MANAGE_CART: MANAGE_CART;
    MANAGE_EMPTY_CART: MANAGE_EMPTY_CART;
    MANAGE_CART_PRODUCT: MANAGE_CART_PRODUCT;
    MANAGE_CART_WEIGHT_PRODUCT: MANAGE_CART_WEIGHT_PRODUCT;
    CHANGE_WEIGHT_PRODUCT_MODAL: CHANGE_WEIGHT_PRODUCT_MODAL;
    ADD_SUSPENSION_CART: ADD_SUSPENSION_CART;
    DELETE_SUSPENSION_CART: DELETE_SUSPENSION_CART;
    DELETE_PRODUCT_ITEM: DELETE_PRODUCT_ITEM;
    EMPTY_SUSPENSION_CART: EMPTY_SUSPENSION_CART;
    CHANGE_NON_BARCODE_PRODUCT: CHANGE_NON_BARCODE_PRODUCT;
    CHANGE_PRODUCT: CHANGE_PRODUCT; // 改价和改数量
    CHANGE_PRODUCT_VISIBLE: CHANGE_PRODUCT_VISIBLE; // 改价modal是否显示
    PAYLOAD_SORT: PAYLOAD_SORT;
    RECEIVE_ORDER_PAY: RECEIVE_ORDER_PAY;
    RECEIVE_ORDER_PAY_DETAIL: RECEIVE_ORDER_PAY_DETAIL;
    RECEIVE_ORDER_PAY_ADDRESS: RECEIVE_ORDER_PAY_ADDRESS;
  };

  type ProductCartAdd = string;
  type ProductCartReduce = string;
  type ProductCartEmpty= string;
  type ProductCartManageType = {
    ADD: ProductCartAdd;
    REDUCE: ProductCartReduce;
    EMPTY: ProductCartEmpty;
  };

  interface ProductSDKManageInterface {
    type: ProductCartAdd | ProductCartReduce | ProductCartEmpty;
    product: ProductInterface.ProductInfo | ProductCartInfo;
    suspension?: number;
    sort?: PAYLOAD_ORDER | PAYLOAD_REFUND;
    num?: number;
  }
}

class ProductSDK {

  public nonBarcodeKey: string = 'WM';
  
  public productCartManageType: ProductCartInterface.ProductCartManageType = {
    ADD: 'ADD',
    REDUCE: 'REDUCE',
    EMPTY: 'EMPTY',
  };

  public reducerInterface: ProductCartInterface.ReducerInterface = {
    MANAGE_CART: 'MANAGE_CART',
    MANAGE_EMPTY_CART: 'MANAGE_EMPTY_CART',
    MANAGE_CART_PRODUCT: 'MANAGE_CART_PRODUCT',
    MANAGE_CART_WEIGHT_PRODUCT: 'MANAGE_CART_WEIGHT_PRODUCT',
    CHANGE_WEIGHT_PRODUCT_MODAL: 'CHANGE_WEIGHT_PRODUCT_MODAL',
    ADD_SUSPENSION_CART: 'ADD_SUSPENSION_CART',
    DELETE_SUSPENSION_CART: 'DELETE_SUSPENSION_CART',
    EMPTY_SUSPENSION_CART: 'EMPTY_SUSPENSION_CART',
    CHANGE_NON_BARCODE_PRODUCT: 'CHANGE_NON_BARCODE_PRODUCT',
    CHANGE_PRODUCT: 'CHANGE_PRODUCT',
    CHANGE_PRODUCT_VISIBLE: 'CHANGE_PRODUCT_VISIBLE',
    DELETE_PRODUCT_ITEM: 'DELETE_PRODUCT_ITEM',
    RECEIVE_ORDER_PAY: 'RECEIVE_ORDER_PAY',
    RECEIVE_ORDER_PAY_ADDRESS: 'RECEIVE_ORDER_PAY_ADDRESS',
    RECEIVE_ORDER_PAY_DETAIL: 'RECEIVE_ORDER_PAY_DETAIL',
    PAYLOAD_SORT: {
      PAYLOAD_ORDER: 'PAYLOAD_ORDER',
      PAYLOAD_REFUND: 'PAYLOAD_REFUND',
      PAYLOAD_PURCHASE: 'PAYLOAD_PURCHASE',
      PAYLOAD_MANAGE: 'PAYLOAD_MANAGE',
      PAYLOAD_STOCK: 'PAYLOAD_STOCK',
    }
  };
  
  /**
   * @param {erase}
   * [抹零金额]
   *
   * @private
   * @type {string}
   * @memberof ProductSDK
   */
  private erase?: string | number;
  /**
   * @param {member} 
   * [会员]
   * @private
   * @type {*}
   * @memberof ProductSDK
   */
  private member?: MemberInterface.MemberInfo;

  /**
   * @param {sort}
   * [类别：order是开单，refund是退货]
   *
   * @private
   * @type {(ProductCartInterface.PAYLOAD_ORDER | ProductCartInterface.PAYLOAD_REFUND)}
   * @memberof ProductSDK
   */
  private sort?: ProductCartInterface.PAYLOAD_ORDER | ProductCartInterface.PAYLOAD_REFUND;

  constructor () {
    this.erase = undefined;
    this.member = undefined;
    this.sort = this.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER;
  }

  public setErase = (erase?: string): this => {
    this.erase = erase;
    return this;
  }

  public setMember = (member?: MemberInterface.MemberInfo): this => {
    this.member = member;
    return this;
  }

  public setSort = (sort?: ProductCartInterface.PAYLOAD_ORDER | ProductCartInterface.PAYLOAD_REFUND): this => {
    this.sort = sort ? sort : this.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER;
    return this;
  }

  public getErase = (): number => {
    if (this.erase !== undefined) {
      return numeral(this.erase).value();
    } else {
      return 0;
    }
  }

  /**
   * @todo 重置函数
   *
   * @memberof ProductSDK
   */
  public reset = () => {
    this.member = undefined;
    this.erase = 0;
  }

  public getSortDataKey = (sort?: string): string => {
    const data = (sort && typeof sort === 'string') ? sort : this.sort;

    switch (data) {
      case this.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER: {
        return 'productCartList';
      }
      case this.reducerInterface.PAYLOAD_SORT.PAYLOAD_REFUND: {
        return 'productRefundList';
      }
      case this.reducerInterface.PAYLOAD_SORT.PAYLOAD_PURCHASE: {
        return 'productPurchaseList';
      }
      case this.reducerInterface.PAYLOAD_SORT.PAYLOAD_STOCK: {
        return 'productStockList';
      }
      default: {
        return 'productCartList';
      }
    }
  }

  /**
   * @todo 获取商品的数量
   *
   * @memberof ProductSDK
   */
  public getProductNumber = (
    products?: ProductCartInterface.ProductCartInfo[], 
    // sort: ProductCartInterface.PAYLOAD_ORDER | ProductCartInterface.PAYLOAD_REFUND = this.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER
  ) => {
    const key = this.getSortDataKey();
    const productList = products !== undefined 
      ? products 
      : store.getState().productSDK[key];
    const reduceCallback = this.sort !== this.reducerInterface.PAYLOAD_SORT.PAYLOAD_STOCK
      ? (prevTotal: number, item: ProductCartInterface.ProductCartInfo) => prevTotal + item.sellNum
      : (prevTotal: number, item: ProductCartInterface.ProductCartInfo) => prevTotal + (item.sellNum - item.number);
    const total = productList.reduce(reduceCallback, 0);
    return total;
  }

  /**
   * @todo [拿到单个商品的价格，有改价返回改价，有会员价返回会员价，没有就原价]
   */
  public getProductItemPrice = (product: ProductCartInterface.ProductCartInfo) => {
    if (product.changePrice !== undefined) {
      return product.changePrice;
    }
    if (this.member !== undefined) {
      return product.memberPrice || product.price;
    }
    return product.price;
  }

  public getProductsOriginPrice = (products?: ProductCartInterface.ProductCartInfo[]) => {
    const key = this.getSortDataKey();
    const productList = products !== undefined ? products : store.getState().productSDK[key];
    const reduceCallback = (prevTotal: number, item: ProductCartInterface.ProductCartInfo) => {
      if (key === 'productPurchaseList') {
        return prevTotal + (item.cost * item.sellNum);
      }
      return prevTotal + (item.price * item.sellNum);
    };
    const total = productList.reduce(reduceCallback, 0);
    return total;
  }

  /**
   * @todo 获取商品的价格
   *
   * @memberof ProductSDK
   */
  public getProductPrice = (
    products?: ProductCartInterface.ProductCartInfo[],
    // sort: ProductCartInterface.PAYLOAD_ORDER | ProductCartInterface.PAYLOAD_REFUND = this.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER
  ) => {
    const key = this.getSortDataKey();
    const productList = products !== undefined ? products : store.getState().productSDK[key];
    const reduceCallback = (prevTotal: number, item: ProductCartInterface.ProductCartInfo) => {
      const itemPrice = item.memberPrice || item.price;
      return prevTotal + (itemPrice * item.sellNum);
    };
    const total = productList.reduce(reduceCallback, 0);
    return total;
  }

  /**
   * @todo 获取商品会员价格
   *
   * @memberof ProductSDK
   */
  public getProductMemberPrice = (products?: ProductCartInterface.ProductCartInfo[], force?: boolean): number => {
    const hasMember = force ? force : this.member !== undefined;
    if (hasMember) {
      const productList = products !== undefined ? products : store.getState().productSDK.productCartList;
      const reduceCallback = (prevTotal: number, item: ProductCartInterface.ProductCartInfo) => {

        /**
         * @todo 如果有改价价格，则计算改价价格
         */
        if (item.changePrice !== undefined) {
          return prevTotal + (item.changePrice * item.sellNum); 
        }

        return prevTotal + (item.memberPrice * item.sellNum);
      };
      const total = productList.reduce(reduceCallback, 0);
      return total;
    } else {
      return this.getProductPrice();
    }
  }

  public preparePayOrderAddress = async (address: MerchantInterface.Address) => {
    store.dispatch({
      type: this.reducerInterface.RECEIVE_ORDER_PAY_ADDRESS,
      payload: address
    })
  }

  public preparePayOrderDetail = async (params) => {
    store.dispatch({
      type: this.reducerInterface.RECEIVE_ORDER_PAY_DETAIL,
      payload: params
    })
  }

  /**
   * @todo 把要下单的数据传到order.pay redux中
   */
  public preparePayOrder = async (products?: ProductCartInterface.ProductCartInfo[]) => {
    const productList = products !== undefined ? products : store.getState().productSDK.productCartList;
    store.dispatch({
      type: this.reducerInterface.RECEIVE_ORDER_PAY,
      payload: {productList}
    });
  }

  public prepareEmptyPayOrder = async () => {
    this.preparePayOrder([]);
  }

  /**
   * @todo 计算交易价格
   * 
   * ```ts
   * import productSdk from 'xxx';
   * 
   * const total = productSdk
   * .setErase(1)
   * .setMember(member)
   * .getProductTransPrice()
   * 
   * ```
   *
   * @memberof ProductSDK
   */
  public getProductTransPrice = () => {
    // 计算如果有会员的话使用会员价格，如果没有会员则返回原价
    let total: number = this.getProductMemberPrice();
    // 抹零价格在会员价之后减去
    total = total - this.getErase();
    return total;
  }

  /**
   * @todo 返回支付需要的数据格式
   * 
   * ```ts
   * import productSdk from 'xxx';
   * const payload = productSdk
   * .setErase(1)
   * .setMember(member)
   * .getProductInterfacePayload()
   * ```
   *
   * @memberof ProductSDK
   */
  public getProductInterfacePayload = (products?: ProductCartInterface.ProductCartInfo[], address?: MerchantInterface.Address, payOrderDetail?: any): ProductCartInterface.ProductPayPayload => {
    const productList = products !== undefined ? products : store.getState().productSDK.productCartList;
    const payload: ProductCartInterface.ProductPayPayload = {
      order: {
        address: payOrderDetail.deliveryType === 1 ? address && address.address || '' : '',
        addressDetail: payOrderDetail.deliveryType === 0 ? address && address.address || '' : '',
        deliveryPhone: '',
        delivery_time: payOrderDetail.delivery_time || '',
        deliveryType: payOrderDetail.deliveryType || 0,
        receiver: address && address.contact || "",
        receiverPhone: address && address.phone || '',
        remark: payOrderDetail.remark || "",
        payType: 8,
        merchantId: 1,
        discount: 0,
        erase: this.getErase(),
        memberId: this.member !== undefined ? this.member.id : -1,
        orderSource: 3,
        totalAmount: this.getProductPrice(),
        totalNum: this.getProductNumber(),
        transAmount: this.getProductTransPrice(),
      },
      productInfoList: productList.map((item) => {
        /**
         * @todo [默认会员价，有就用会员价，没有就用普通价格]
         */
        const itemPrice: number = item.memberPrice || item.price;
        return {
          productId: item.id,
          productName: item.name,
          remark: "",
          sellNum: item.sellNum,
          totalAmount: itemPrice * item.sellNum,
          transAmount: itemPrice * item.sellNum,
          unitPrice: itemPrice
        } as ProductCartInterface.ProductInfoPayload;
      }),
    };
    return payload;
  }

  public requestPayment = async (orderNo: string) => {
    const payload = { orderNo };
    const result = await requestHttp.post(`/api/cashier/pay`, payload);

    if (result.code === ResponseCode.success) {
      return new Promise((resolve) => {
        const payload = JSON.parse(result.data.param);
        console.log('payload: ', payload)
        delete payload.appId;
        const paymentPayload = {
          ...payload,
          success: (result) => {
            resolve(result)
          },
          fail: (error) => {
            resolve(error)
          }
        };
        console.log('paymentPayload: ', paymentPayload)
        Taro.requestPayment(paymentPayload)
      })
    }
    return result;
  }

  public isWeighProduct (product: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo): product is ProductCartInterface.ProductCartInfo {
    return product.saleType === 1;
  }

  public isCartProduct (product: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo): product is ProductCartInterface.ProductCartInfo {
    return product !== undefined && (<ProductCartInterface.ProductCartInfo> product).sellNum !== undefined;
  }

  public isNonBarcodeProduct (product: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo): boolean {
    return String(product.id).startsWith(this.nonBarcodeKey);
  }

  public changeProduct = (
    product: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo, 
    sellNum?: number, 
    changePrice?: number,
    sort?: ProductCartInterface.PAYLOAD_ORDER | ProductCartInterface.PAYLOAD_REFUND,
  ) => {
    store.dispatch({
      type: this.reducerInterface.CHANGE_PRODUCT,
      payload: {
        product,
        sellNum,
        changePrice,
        sort,
      }
    });
  }

  /**
   * @todo 判断是否是称重商品，如果是称重商品显示称重modal
   * @todo 如果不是称重商品则+1
   *
   * @memberof ProductSDK
   */
  public add = (
    product: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo, 
    sellNum?: number, 
    suspension?: number,
    sort: ProductCartInterface.PAYLOAD_ORDER | ProductCartInterface.PAYLOAD_REFUND | ProductCartInterface.PAYLOAD_PURCHASE 
      = this.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER,
      num?: number,
  ) => {
    Taro.showToast({
      title: '加入购物车'
    });
    if (this.isWeighProduct(product)) {
      const reducer: ProductSDKReducer.ProductManageWeightCart = {
        type: this.reducerInterface.MANAGE_CART_WEIGHT_PRODUCT,
        payload: {
          type: this.productCartManageType.ADD,
          product: {
            ...product,
            sellNum: sellNum || 1
          },
          suspension,
          sort,
        }
      };
      store.dispatch(reducer);
    } else {
      const reducer: ProductSDKReducer.ProductManageCart = {
        type: this.reducerInterface.MANAGE_CART_PRODUCT,
        payload: {
          type: this.productCartManageType.ADD,
          product,
          suspension,
          sort,
          num
        }
      };
      store.dispatch(reducer);
    }
  }

  /**
   * @todo 判断是否是称重商品，如果是称重商品则直接删除这一条
   * @todo 如果不是称重商品则-1，如果=1则删掉这一条
   *
   * @memberof ProductSDK
   */
  public reduce = (
    product: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo, 
    sellNum?: number, 
    suspension?: number, 
    sort: ProductCartInterface.PAYLOAD_ORDER | ProductCartInterface.PAYLOAD_REFUND = this.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER
  ) => {
    if (this.isWeighProduct(product)) {
      const reducer: ProductSDKReducer.ProductManageWeightCart = {
        type: this.reducerInterface.MANAGE_CART_WEIGHT_PRODUCT,
        payload: {
          type: this.productCartManageType.REDUCE,
          product: {
            ...product,
            sellNum: sellNum || 1
          },
          suspension,
          sort,
        }
      };
      store.dispatch(reducer);
    } else {
      const reducer: ProductSDKReducer.ProductManageCart = {
        type: this.reducerInterface.MANAGE_CART_PRODUCT,
        payload: {
          type: this.productCartManageType.REDUCE,
          product,
          suspension,
          sort,
        }
      };
      store.dispatch(reducer);
    }
  }

  public deleteProductItem = (product: ProductCartInterface.ProductCartInfo, sort: string = this.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER) => {
    store.dispatch({
      type: this.reducerInterface.DELETE_PRODUCT_ITEM,
      payload: {
        product,
        sort,
      }
    });
  }

  public empty = (sort?: string) => {
    store.dispatch({
      type: this.reducerInterface.MANAGE_EMPTY_CART,
      payload: { sort }
    });
  }

  public manage = (params: ProductCartInterface.ProductSDKManageInterface) => {
    const { product, type, suspension, sort, num } = params;
    if (type === this.productCartManageType.EMPTY) {
      this.empty(sort);
      return;
    }
    if (this.isWeighProduct(product)) {
      // 如果是称重商品
      if (type === this.productCartManageType.ADD) {
        store.dispatch({
          type: this.reducerInterface.CHANGE_WEIGHT_PRODUCT_MODAL,
          payload: { product }
        });
      } else {
        this.reduce(product, undefined, suspension, sort);
      }
    } else if (this.isNonBarcodeProduct(product)) {
      // 如果是无码商品
      if (type === this.productCartManageType.ADD) {
        store.dispatch({
          type: this.reducerInterface.CHANGE_NON_BARCODE_PRODUCT,
          payload: { nonBarcodeProduct: product }
        });
      } else {
        this.reduce(product);
      }
    } else {
      // 如果是其他商品
      if (type === this.productCartManageType.ADD) {
        this.add(product, undefined, suspension, sort, num);
      } else {
        this.reduce(product, undefined, suspension, sort);
      }
    }
  }

  public manageCart = (productCartList: ProductCartInterface.ProductCartInfo[], sort: string = this.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER) => {
    const reducer: ProductSDKReducer.Reducers.ManageCartList = {
      type: this.reducerInterface.MANAGE_CART,
      payload: { productCartList, sort }
    };
    return store.dispatch(reducer);
  }

  public closeNonBarcodeModal = () => {
    store.dispatch({
      type: this.reducerInterface.CHANGE_NON_BARCODE_PRODUCT,
      payload: {nonBarcodeProduct: {}}
    });
  }

  public closeWeightModal = () => {
    store.dispatch({
      type: this.reducerInterface.CHANGE_WEIGHT_PRODUCT_MODAL,
      payload: {product: {}}
    });
  }

  public changeProductVisible = (
    visible: boolean, 
    product?: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo, 
    sort: string = this.reducerInterface.PAYLOAD_SORT.PAYLOAD_ORDER,
  ) => {
    const reducer: ProductSDKReducer.Reducers.ChangeProductVisible = {
      type: this.reducerInterface.CHANGE_PRODUCT_VISIBLE,
      payload: { 
        visible,
        product,
        sort,
      }
    };
    store.dispatch(reducer);
  }
  
  public cashierOrder = async (params: ProductCartInterface.ProductPayPayload) => {
    const result = await ProductService.cashierOrder(params);
    return result;
  }

  public cashierPay = async (params: ProductCartInterface.ProductPayPayload) => {
    const result = await ProductService.cashierPay(params);
    return result;
  }

  /**
   * @todo [清空购物车]
   * @todo [清空下单信息]
   */
  public cashierOrderCallback = (result: OrderInterface.OrderDetail) => {

    this.empty();
    this.preparePayOrder([])
    this.preparePayOrderAddress({} as any)

    const { order } = result;
    Taro.navigateTo({
      url: `/pages/order/order.detail?id=${order.orderNo}`
    })
  }

  public scanProduct = async (): Promise<HTTPInterface.ResponseResultBase<any>> => {
    return new Promise((resolve) => {
      Taro
      .scanCode()
      .then(async (barcode) => {
        Taro.showLoading();
        const payload: ProductInterface.ProductInfoScanGetFetchFidle = {
          barcode: barcode.result
        };
        const result = await productService.productInfoScan(payload);
        Taro.hideLoading();
        resolve({
          ...result,
          data: {
            ...result.data || {},
            barcode: barcode.result
          }
        });
      })
      .catch(error => resolve(error));
    });
  }
}

export default new ProductSDK();