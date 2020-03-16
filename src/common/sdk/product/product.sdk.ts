/**
 * @Author: Ghan 
 * @Date: 2019-11-22 11:12:09 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-05 10:42:41
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
import { ProductInterface, ProductService, OrderInterface, ResponseCode, UserInterface } from '../../../constants';
import { store } from '../../../app';
import { ProductSDKReducer, getProductCartList } from './product.sdk.reducer';
import requestHttp from '../../../common/request/request.http';

export declare namespace ProductCartInterface {
  interface ProductCartInfo extends ProductInterface.ProductInfo {
    sellNum: number;
    changePrice?: number; // 称重商品修改的价格
  }

  interface ProductOrderPayload {
    address: string;
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
    planDeliveryTime: string;
    deliveryFee: number;
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
  type MANAGE_EMPTY_CART = string;
  type DELETE_PRODUCT_ITEM = string;
  type RECEIVE_ORDER_PAY = string;
  type RECEIVE_ORDER_PAY_ADDRESS = string;
  type RECEIVE_ORDER_PAY_DETAIL = string;


  type ReducerInterface = {
    MANAGE_CART: MANAGE_CART;
    MANAGE_EMPTY_CART: MANAGE_EMPTY_CART;
    MANAGE_CART_PRODUCT: MANAGE_CART_PRODUCT;
    RECEIVE_ORDER_PAY: RECEIVE_ORDER_PAY;
    RECEIVE_ORDER_PAY_DETAIL: RECEIVE_ORDER_PAY_DETAIL;
    RECEIVE_ORDER_PAY_ADDRESS: RECEIVE_ORDER_PAY_ADDRESS;
  };

  type ProductCartAdd = string;
  type ProductCartReduce = string;
  type ProductCartEmpty = string;
  type ProductCartManageType = {
    ADD: ProductCartAdd;
    REDUCE: ProductCartReduce;
    EMPTY: ProductCartEmpty;
  };

  interface ProductSDKManageInterface {
    type: ProductCartAdd | ProductCartReduce | ProductCartEmpty;
    product: ProductInterface.ProductInfo | ProductCartInfo;
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
    RECEIVE_ORDER_PAY: 'RECEIVE_ORDER_PAY',
    RECEIVE_ORDER_PAY_ADDRESS: 'RECEIVE_ORDER_PAY_ADDRESS',
    RECEIVE_ORDER_PAY_DETAIL: 'RECEIVE_ORDER_PAY_DETAIL',
  };


  constructor() {

  }

  public refreshCartNumber = () => {
    const state = store.getState()
    const productCartList = getProductCartList(state)
    const total = this.getProductNumber(productCartList);
    if (total !== 0) {
      Taro.setTabBarBadge({
        index: 2,
        text: `${total}`
      });
    } else {
      Taro.removeTabBarBadge({ index: 2 });
    }
  }

  /**
   * @todo 获取商品的数量
   *
   * @memberof ProductSDK
   */
  public getProductNumber = (
    products?: ProductCartInterface.ProductCartInfo[],
  ) => {
    const productList = products !== undefined
      ? products
      : store.getState().productSDK.productCartList;
    const reduceCallback = (prevTotal: number, item: ProductCartInterface.ProductCartInfo) => prevTotal + item.sellNum
    const total = productList.reduce(reduceCallback, 0);
    return total;
  }

  /**
   * @todo [拿到单个商品的价格，有优惠价返回优惠价，有会员价返回会员价，没有就原价]
   */
  public getProductItemPrice = (product: ProductCartInterface.ProductCartInfo | ProductInterface.ProductInfo) => {
    let discountPrice = product.price;
    if (product.activityInfos && product.activityInfos.length > 0) {
      for (let i = 0; i < product.activityInfos.length; i++) {
        if (product.activityInfos[i].discountPrice < discountPrice) {
          discountPrice = product.activityInfos[i].discountPrice;
        }
      }
    }
    if (product.memberPrice !== undefined && product.memberPrice < discountPrice) {
      return product.memberPrice
    }
    return discountPrice;
  }

  /**
   * @todo [拿到单个商品的价格，有优惠价返回优惠价]
   */
  public getProductItemDiscountPrice = (product: ProductCartInterface.ProductCartInfo | ProductInterface.ProductInfo) => {
    let discountPrice = product && product.price ? product.price : 0;
    if (product && product.activityInfos && product.activityInfos.length > 0) {
      for (let i = 0; i < product.activityInfos.length; i++) {
        if (product.activityInfos[i].discountPrice < discountPrice) {
          discountPrice = product.activityInfos[i].discountPrice;
        }
      }
    }
    return discountPrice;
  }

  /**
   * @todo 获取商品原价
   *
   * @memberof ProductSDK
   */
  public getProductsOriginPrice = (products?: ProductCartInterface.ProductCartInfo[]) => {
    const productList = products !== undefined ? products : store.getState().productSDK.productCartList;
    const reduceCallback = (prevTotal: number, item: ProductCartInterface.ProductCartInfo) => {
      return prevTotal + (item.price * item.sellNum);
    };
    const total = productList.reduce(reduceCallback, 0);
    return total;
  }

  /**
   * @todo 获取商品会员价格
   *
   * @memberof ProductSDK
   */
  public getProductsMemberPrice = (products?: ProductCartInterface.ProductCartInfo[]): number => {
    const productList = products !== undefined ? products : store.getState().productSDK.productCartList;
    const reduceCallback = (prevTotal: number, item: ProductCartInterface.ProductCartInfo) => {
      return prevTotal + (item.memberPrice * item.sellNum);
    };
    const total = productList.reduce(reduceCallback, 0);
    return total;
  }

    /**
   * @todo 获取商品交易价格
   *
   * @memberof ProductSDK
   */
  public getProductTransPrice = (products?: ProductCartInterface.ProductCartInfo[]): number => {
    const productList = products !== undefined ? products : store.getState().productSDK.productCartList;
    let total = 0;
    for (let i = 0; i < productList.length; i++) {
      total += this.getProductItemPrice(productList[i]) * productList[i].sellNum;
    }
    return total;
  }

  /**
   * @todo 获取优惠信息
   *
   * @memberof ProductSDK
   */
  public getDiscountString = (activity: any) => {
    switch (activity.type) {
      case 1:
        return `${activity.discountAmount}折${activity.limitNum && activity.limitNum > 0 ? ` 限${activity.limitNum}件` : ``}`;
      case 2:
        return `优惠${activity.discountAmount}元${activity.limitNum && activity.limitNum > 0 ? ` 限${activity.limitNum}件` : ``}`;
      default:
        return ``;
    }
  }

  /**
   * @todo 把下单地址存到order.pay redux中
   *
   * @memberof ProductSDK
   */
  public preparePayOrderAddress = async (address: UserInterface.Address) => {
    store.dispatch({
      type: this.reducerInterface.RECEIVE_ORDER_PAY_ADDRESS,
      payload: address
    })
  }

  /**
   * @todo 把订单详情存到order.pay redux中
   *
   * @memberof ProductSDK
   */
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
      payload: { productList }
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
   * @memberof ProductSDK
   */

  /**
   * @todo 返回支付需要的数据格式
   * 
   *
   * @memberof ProductSDK
   */
  public getProductInterfacePayload = (products?: ProductCartInterface.ProductCartInfo[], address?: UserInterface.Address, payOrderDetail?: any): ProductCartInterface.ProductPayPayload => {
    const productList = products !== undefined ? products : store.getState().productSDK.productCartList;
    const currentMerchantDetail = store.getState().merchant.currentMerchantDetail;

    let order: Partial<ProductCartInterface.ProductOrderPayload> = {
      address: payOrderDetail.deliveryType === 1 ? address && address.address || '' : '',
      deliveryPhone: '',
      planDeliveryTime: payOrderDetail.planDeliveryTime || '',
      deliveryType: payOrderDetail.deliveryType || 0,
      deliveryFee: payOrderDetail.deliveryType === 1 ? 3.5 : 0,
      remark: payOrderDetail.remark || "",
      payType: 8,
      merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : 1,
      discount: 0,
      orderSource: 3,
      totalAmount: this.getProductsOriginPrice() + (payOrderDetail.deliveryType === 1 ? 3.5 : 0),
      totalNum: this.getProductNumber(),
      transAmount: this.getProductTransPrice() + (payOrderDetail.deliveryType === 1 ? 3.5 : 0),
    }

    if (payOrderDetail.deliveryType === 1) {
      order = {
        ...order,
        receiver: address && address.contact || "",
        receiverPhone: address && address.phone || '',
      }
    }

    const payload: ProductCartInterface.ProductPayPayload = {
      order: order as any,
      productInfoList: productList.map((item) => {
        /**
         * @todo [默认会员价，有就用会员价，没有就用普通价格]
         */
        const itemPrice: number = item.memberPrice !== undefined ? item.memberPrice : item.price;
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
          success: (res) => {
            resolve(res)
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

  public isCartProduct(product: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo): product is ProductCartInterface.ProductCartInfo {
    return product !== undefined && (<ProductCartInterface.ProductCartInfo>product).sellNum !== undefined;
  }

  /**
   * @todo 增加购物车商品
   *
   * @memberof ProductSDK
   */
  public add = (
    product: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo,
    num?: number,
  ) => {

    Taro.showToast({
      title: '加入购物车'
    });

    const state = store.getState();
    const productCartList = state.productSDK.productCartList;
    const index = productCartList.findIndex(p => p.id === product.id);
    let limitNum = -1;
    if (product.activityInfos) {
      for (let i = 0; i < product.activityInfos.length; i++) {
        if (product.activityInfos[i].limitNum) {
          if (product.activityInfos[i].limitNum < limitNum || limitNum === -1) {
            limitNum === product.activityInfos[i].limitNum;
          }
        }
      }
    }

    if (num) {
      if (index !== -1) {
        if (limitNum !== -1 && (productCartList[index].sellNum + num) > limitNum) {
          Taro.showToast({
            title: `部分商品超过限购件数`,
            icon: 'none'
          });
          num = (limitNum - productCartList[index].sellNum);
        }

        if ((productCartList[index].sellNum + num) > product.saleNumber) {
          Taro.showToast({
            title: `部分商品超过库存`,
            icon: 'none'
          });
          num = product.saleNumber - productCartList[index].sellNum;
        }
      } else {
        if (num > product.saleNumber) {
          Taro.showToast({
            title: `部分商品超过库存`,
            icon: 'none'
          });
          num = product.saleNumber;
        }
      }
    } else {
      if (index !== -1) {
        if (limitNum !== -1 && (productCartList[index].sellNum + 1) > limitNum) {
          Taro.showToast({
            title: `限购${product.limitNum}份，不可再增加`,
            icon: 'none'
          });
          return;
        }
        if ((productCartList[index].sellNum + 1) > product.saleNumber) {
          Taro.showToast({
            title: `此商品仅剩${product.saleNumber}份，不可再增加`,
            icon: 'none'
          });
          return;
        }
      } else {
        if (product.saleNumber === 0) {
          Taro.showToast({
            title: `该商品没有库存了`,
            icon: 'none'
          });
          return;
        }
      }
    }

    // if (num && num <= 0) {
    //   return;
    // }

    const reducer: ProductSDKReducer.ProductManageCart = {
      type: this.reducerInterface.MANAGE_CART_PRODUCT,
      payload: {
        type: this.productCartManageType.ADD,
        product,
        num
      }
    };
    store.dispatch(reducer);
  }

  /**
   * @todo 减少购物车商品
   *
   * @memberof ProductSDK
   */
  public reduce = (
    product: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo,
  ) => {
    const reducer: ProductSDKReducer.ProductManageCart = {
      type: this.reducerInterface.MANAGE_CART_PRODUCT,
      payload: {
        type: this.productCartManageType.REDUCE,
        product,
      }
    };
    store.dispatch(reducer);
  }


  /**
   * @todo 清空购物车
   *
   * @memberof ProductSDK
   */
  public empty = (sort?: string) => {
    store.dispatch({
      type: this.reducerInterface.MANAGE_EMPTY_CART,
      payload: { sort }
    });
  }

  /**
   * @todo 购物车管理，判断操作类型是增加、删除或者清空，执行相应操作
   *
   * @memberof ProductSDK
   */
  public manage = (params: ProductCartInterface.ProductSDKManageInterface) => {
    const { product, type, num } = params;
    if (type === this.productCartManageType.EMPTY) {
      this.empty();
    } else if (type === this.productCartManageType.ADD) {
      this.add(product, num);
    } else {
      this.reduce(product);
    }
    this.storageProductCartList();

  }

  /**
   * @todo 下单
   *
   * @memberof ProductSDK
   */
  public cashierOrder = async (params: ProductCartInterface.ProductPayPayload) => {
    const result = await ProductService.cashierOrder(params);
    return result;
  }

  /**
   * @todo 支付
   *
   * @memberof ProductSDK
   */
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
    this.preparePayOrderDetail({} as any)
    console.log('result callback', result)
    const { order } = result;
    Taro.redirectTo({
      url: `/pages/order/order.detail?id=${order.orderNo}`
    })
  }

  public storageProductCartList = () => {
    const productCartList = store.getState().productSDK.productCartList;
    console.log('test aaa', productCartList);
  }
}

export default new ProductSDK();