/**
 * @Author: Ghan
 * @Date: 2019-11-22 11:12:09
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-04-14 15:58:29
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
import {ProductInterface, ProductService, OrderInterface, ResponseCode, UserInterface, MerchantInterface} from '../../../constants';
// import {store} from '../../../app';
import {ProductSDKReducer, getProductCartList} from './product.sdk.reducer';
import requestHttp from '../../../common/request/request.http';
import merge from 'lodash.merge';
import numeral from 'numeral';

export const NonActivityName = 'NonActivityName';

interface FilterProductList {
    activity?: MerchantInterface.Activity;
    productList: ProductCartInterface.ProductCartInfo[]; 
}

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
        couponList: UserInterface.CouponsItem[];
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
    type MANAGE_CART_PRODUCT_REMOVE = string;


    type ReducerInterface = {
        SELECT_INDEX: string;
        MANAGE_CART: MANAGE_CART;
        MANAGE_EMPTY_CART: MANAGE_EMPTY_CART;
        MANAGE_CART_PRODUCT: MANAGE_CART_PRODUCT;
        MANAGE_CART_PRODUCT_REMOVE: MANAGE_CART_PRODUCT_REMOVE;
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
        SELECT_INDEX: 'SELECT_INDEX',
        MANAGE_CART: 'MANAGE_CART',
        MANAGE_EMPTY_CART: 'MANAGE_EMPTY_CART',
        MANAGE_CART_PRODUCT: 'MANAGE_CART_PRODUCT',
        MANAGE_CART_PRODUCT_REMOVE: 'MANAGE_CART_PRODUCT_REMOVE',
        RECEIVE_ORDER_PAY: 'RECEIVE_ORDER_PAY',
        RECEIVE_ORDER_PAY_ADDRESS: 'RECEIVE_ORDER_PAY_ADDRESS',
        RECEIVE_ORDER_PAY_DETAIL: 'RECEIVE_ORDER_PAY_DETAIL',
    };


    constructor() {

    }

    public refreshCartNumber = (productCartList) => {
        // const state = store.getState()
        // const productCartList = getProductCartList(state)
        const total = this.getProductNumber(productCartList);
        if (total !== 0) {
            Taro.setTabBarBadge({
                index: 2,
                text: `${total}`
            });
        } else {
            Taro.removeTabBarBadge({index: 2});
        }
    }

    /**
     * @todo 获取商品的数量
     *
     * @memberof ProductSDK
     */
    public getProductNumber = (productCartList: any, products?: ProductCartInterface.ProductCartInfo[]) => {
        // const productList = products !== undefined
        //     ? products
        //     : store.getState().productSDK.productCartList;
        const productList = products !== undefined
            ? products
            : productCartList;
        const reduceCallback = (prevTotal: number, item: ProductCartInterface.ProductCartInfo) => prevTotal + item.sellNum
        const total = productList.reduce(reduceCallback, 0);
        return total;
    }

    /**
     * @todo [拿到单个商品的价格，有优惠价返回优惠价，有会员价返回会员价，没有就原价]
     */
    public getProductItemPrice = (product: ProductCartInterface.ProductCartInfo | ProductInterface.ProductInfo, memberInfo) => {
        let discountPrice = product.price;
        // const state = store.getState();
        // const memberInfo = getMemberInfo(state);
        if (product.activityInfos && product.activityInfos.length > 0) {
            for (let i = 0; i < product.activityInfos.length; i++) {
                if (product.activityInfos[i].discountPrice < discountPrice) {
                    discountPrice = product.activityInfos[i].discountPrice;
                }
            }
        }
        if (memberInfo.enableMemberPrice && product.memberPrice !== undefined && product.memberPrice < discountPrice) {
            return product.memberPrice
        }
        return discountPrice;
    }

    /**
     * @todo [拿到单个商品的价格，有优惠价返回优惠价]
     */
    public getProductItemDiscountPrice = (product: ProductCartInterface.ProductCartInfo | ProductInterface.ProductInfo, memberInfo) => {
        // const memberInfo = store.getState().user.memberInfo;
        const enableMemberPrice = memberInfo ?　memberInfo.enableMemberPrice　: '';
        const priceNumber = product && product.price ? product.price : 0;
        const memberPriceNumber = product && product.memberPrice ? product.memberPrice : 0;
        let discountPrice = priceNumber;
        if (product && product.activityInfos && product.activityInfos.length > 0) {
            for (let i = 0; i < product.activityInfos.length; i++) {
                if (product.activityInfos[i].type === 1 || product.activityInfos[i].type === 2 ||
                    product.activityInfos[i].discountPrice < discountPrice) {
                    discountPrice = product.activityInfos[i].discountPrice;
                }
            }
        }
        if (enableMemberPrice && discountPrice > memberPriceNumber) {
            discountPrice = memberPriceNumber;
        }
        return discountPrice;
    }

    /**
     * @todo 获取商品原价
     *
     * @memberof ProductSDK
     */
    public getProductsOriginPrice = (productCartList, products?: ProductCartInterface.ProductCartInfo[]) => {
        // const productList = products !== undefined ? products : store.getState().productSDK.productCartList;
        const productList = products !== undefined ? products : productCartList;
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
    public getProductMemberPrice = (memberInfo, productCartList, products?: ProductCartInterface.ProductCartInfo[]): number => {
        const productList = products !== undefined ? products : productCartList;
        const reduceCallback = (prevTotal: number, item: ProductCartInterface.ProductCartInfo) => {
          const itemPrice = this.getProductItemPrice(item, memberInfo);
    
          return prevTotal + (itemPrice * item.sellNum);
        };
        const total = productList.reduce(reduceCallback, 0);
        return total;
    }

    public setMaxActivityRule = (price: number, activity: MerchantInterface.Activity) => {
        const rule: {discount: number; threshold: number}[] = merge([], activity.rule);
        
        if (!!rule && rule.length > 0) {
            const discountArray = rule.map((item) => item.discount);

            const maxDiscount = Math.max(...discountArray);
            const maxDiscountIndex = rule.findIndex((r) => r.discount === maxDiscount);
            const maxDiscountItem = rule.find((r) => r.discount === maxDiscount);

            while (discountArray.length > 0) {
                if (maxDiscountItem && price <= maxDiscountItem.threshold) {
                    return maxDiscountItem;
                } else {
                    discountArray.splice(maxDiscountIndex, 1);
                }
            }
            return {};
        }
        return {};
    }

    public getProductActivityPrice = (price: number, activity?: MerchantInterface.Activity) => {

        /**
         * @todo 如果有满减活动则计算满减活动
         * @todo 如果有满减金额
         */
        if (!!activity && activity.id && activity.rule && activity.rule.length > 0) {
            /**
             * @todo 如果只有一个规则且阈值小于价格则使用满减
             */
            if (activity.rule.length === 1) {
                return activity.rule[0].threshold <= price ? numeral(price - activity.rule[0].discount).value() : price;
            }
            /**
             * @todo 如果有多个规则找出最优惠规则并使用该规则
             */
            const rule: any = this.setMaxActivityRule(price, activity);
            // console.log('rule: ', rule);
            return !!rule ? numeral(price - rule.discount).value() : price;
        }
        return price;
    }

    /**
     * @todo 商家满减活动
     */
    public getProductTotalActivityPrice = (activityList, memberInfo,productCartList, productList?: ProductCartInterface.ProductCartInfo[]): number => {
        const products = productList !== undefined ? productList : productCartList;
                // const products = productList !== undefined ? productList : store.getState().productSDK.productCartList;  
        // const activityList = store.getState().merchant.activityList; 
        const filterProductList = this.filterByActivity(products, activityList);
        let activityMoney: number = 0;
        
        filterProductList.forEach((activityItem) => {
            const { activity, productList } = activityItem;
            let subTotal: number = 0;
            productList.forEach((product) => {
                subTotal += this.getProductItemPrice(product, memberInfo) * product.sellNum;
            })
            const subActivityMoney = this.getProductActivityPrice(subTotal, activity);
            if (subTotal !== subActivityMoney) {
                activityMoney = subTotal - subActivityMoney;
            }
        })
        return activityMoney;
    }

    /**
     * @todo 获取商品交易价格
     *
     * @memberof ProductSDK
     */
    public getProductTransPrice = (activityList, memberInfo, productCartList, products?: ProductCartInterface.ProductCartInfo[]): number => {
        const productList = products !== undefined ? products : productCartList;
        // const productList = products !== undefined ? products : store.getState().productSDK.productCartList;
        let total = 0;
        for (let i = 0; i < productList.length; i++) {
            total += this.getProductItemPrice(productList[i], memberInfo) * productList[i].sellNum;
        }
        total -= this.getProductTotalActivityPrice(activityList, memberInfo,productCartList, productList);
        // total = this.getProductActivityPrice(total, this.checkActivity(total));
        return total;
    }

    /**
     * @todo 获取优惠信息
     *
     * @memberof ProductSDK
     */
    public getDiscountString = (memberInfo, activityList: any, product: ProductCartInterface.ProductCartInfo | ProductInterface.ProductInfo) => {
        // const memberInfo = store.getState().user.memberInfo;
        const { enableMemberPrice } = memberInfo;
        if (!Array.isArray(activityList) || !activityList.length) {
            if (!enableMemberPrice || product.memberPrice === product.price) return '';
            return '会员专享';
        }
        const activity = activityList[0];
        const memberFlag = !!enableMemberPrice && activity.discountPrice > product.memberPrice;
        switch (activity.type) {
            case 1:
                return memberFlag 
                    ? '会员专享' 
                    : `${activity.discountAmount}折${activity.limitNum && activity.limitNum > 0 ? ` 限${activity.limitNum}件` : ``}`;
            case 2:
                return memberFlag ? '会员专享' : `优惠${activity.discountAmount}元${activity.limitNum && activity.limitNum > 0 ? ` 限${activity.limitNum}件` : ``}`;
            case 3:
                if (!activity.rule) return '';
                const rules = JSON.parse(activity.rule);
                if (!Array.isArray(rules) || !rules.length || !rules[0].threshold || !rules[0].threshold) {
                    return '';
                }
                return `满${rules[0].threshold}元减${rules[0].discount}元`;
            case 4:
                if (!activity.rule) return '';
                const ruleList = JSON.parse(activity.rule);
                if (!Array.isArray(ruleList) || !ruleList.length || !ruleList[0].threshold || !ruleList[0].threshold) {
                    return '';
                }
                return `满${ruleList[0].threshold}件打${ruleList[0].discount}折`;
            default:
                return ``;
        }
    }

    /**
     * @todo 把下单地址存到order.pay redux中
     *
     * @memberof ProductSDK
     */
    public preparePayOrderAddress = async (address: UserInterface.Address, dispatch) => {
        dispatch({
            type: this.reducerInterface.RECEIVE_ORDER_PAY_ADDRESS,
            payload: address
        })
    }

    /**
     * @todo 把订单详情存到order.pay redux中
     *
     * @memberof ProductSDK
     */
    public preparePayOrderDetail = async (params, dispatch) => {
        dispatch({
            type: this.reducerInterface.RECEIVE_ORDER_PAY_DETAIL,
            payload: params
        })
    }

    /**
     * @todo 把要下单的数据传到order.pay redux中
     */
    public preparePayOrder = async (dispatch, productCartList, products?: ProductCartInterface.ProductCartInfo[]) => {
        // const productList = products !== undefined ? products : store.getState().productSDK.productCartList;
        const productList = products !== undefined ? products : productCartList;
        dispatch({
            type: this.reducerInterface.RECEIVE_ORDER_PAY,
            payload: {productList}
        });
    }

    public prepareEmptyPayOrder = async (dispatch) => {
        this.preparePayOrder(dispatch, [], []);
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
    public getProductInterfacePayload = (currentMerchantDetail,activityList, memberInfo, productCartList, products?: ProductCartInterface.ProductCartInfo[], address?: UserInterface.Address, payOrderDetail?: any): ProductCartInterface.ProductPayPayload => {
        // const productList = products !== undefined ? products : store.getState().productSDK.productCartList;
        const productList = products !== undefined ? products : productCartList;
        // const currentMerchantDetail = store.getState().merchant.currentMerchantDetail;

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
            totalAmount: this.getProductsOriginPrice(productList) + (payOrderDetail.deliveryType === 1 ? 3.5 : 0),
            totalNum: this.getProductNumber(productList),
            transAmount: this.getProductTransPrice(activityList, memberInfo, productCartList, productList) + (payOrderDetail.deliveryType === 1 ? 3.5 : 0)
        }

        if (payOrderDetail.deliveryType === 1) {
            order = {
                ...order,
                receiver: address && address.contact || "",
                receiverPhone: address && address.phone || '',
            }
        }

        if (payOrderDetail.selectedCoupon && payOrderDetail.selectedCoupon.id) {
            const transAmount = this.getProductTransPrice(activityList, memberInfo, productCartList) +
                (payOrderDetail.deliveryType === 1 ? 3.5 : 0) -
                (payOrderDetail.selectedCoupon.couponVO.discount || 0);
            order = {
                ...order,
                transAmount: transAmount,
                couponList: [payOrderDetail.selectedCoupon.couponCode]
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

    public requestPayment = async (orderNo: string, fail?: (res: any) => void) => {
        const payload = {orderNo};
        const result = await requestHttp.post(`/api/cashier/pay`, payload);

        if (result.code === ResponseCode.success) {
            return new Promise((resolve) => {
                const payload = JSON.parse(result.data.param);
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
                Taro.requestPayment(paymentPayload);
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
    public add = (dispatch, productSDK, product: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo,
                  num?: number,) => {

        Taro.showToast({
            title: '加入购物车'
        });

        // const state = store.getState();
        // const productCartList = state.productSDK.productCartList;
        const productCartList = productSDK.productCartList;
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

        const reducer: ProductSDKReducer.ProductManageCart = {
            type: this.reducerInterface.MANAGE_CART_PRODUCT,
            payload: {
                type: this.productCartManageType.ADD,
                product,
                num
            }
        };
        dispatch(reducer);
        /**
         * @todo [新增的商品则默认选中状态]
         */
        const { productCartSelectedIndex } = productSDK;
        const token = index !== -1 
            ? productCartSelectedIndex.some((i) => i === product.id) 
            : false;
        if (!token) {
            dispatch({
                type: this.reducerInterface.SELECT_INDEX,
                payload: {
                    product,
                }
            })
        }
    }

    /**
     * @todo 减少购物车商品
     *
     * @memberof ProductSDK
     */
    public reduce = (dispatch, productSDK, product: ProductInterface.ProductInfo | ProductCartInterface.ProductCartInfo, num?: number) => {
        const reducer: ProductSDKReducer.ProductManageCart = {
            type: this.reducerInterface.MANAGE_CART_PRODUCT,
            payload: {
                type: this.productCartManageType.REDUCE,
                product,
                num: num || 1,
            }
        };
        dispatch(reducer);

        /**
         * @todo [减少商品时，如果商品存在购物车且是选中状态，那么从购物车中删除时要删掉这个商品]
         */
        const reduceNumber = num || 1;
        // const { productCartSelectedIndex } = store.getState().productSDK;
        const { productCartSelectedIndex } = productSDK;
        const token = productCartSelectedIndex.some((i) => i === product.id);
        if (!!token && reduceNumber >= (product as any).sellNum) {
            dispatch({
                type: this.reducerInterface.SELECT_INDEX,
                payload: {
                    type: 'normal',
                    product,
                }
            })
        }
    }


    /**
     * @todo 清空购物车
     *
     * @memberof ProductSDK
     */
    public empty = (dispatch, sort?: string, products?: ProductInterface.ProductInfo[]) => {
        dispatch({
            type: this.reducerInterface.MANAGE_EMPTY_CART,
            payload: {sort}
        });

        dispatch({
            type: this.reducerInterface.SELECT_INDEX,
            payload: {
                type: 'empty',
                products,
            }
        })
    }

    /**
     * @todo 购物车管理，判断操作类型是增加、删除或者清空，执行相应操作
     *
     * @memberof ProductSDK
     */
    public manage = (dispatch, productSDK, params: ProductCartInterface.ProductSDKManageInterface) => {
        const {product, type, num} = params;
        if (type === this.productCartManageType.EMPTY) {
            this.empty(dispatch);
        } else if (type === this.productCartManageType.ADD) {
            this.add(dispatch,productSDK, product, num);
        } else {
            this.reduce(dispatch,productSDK, product, num);
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
    public cashierOrderCallback = async (dispatch, result: OrderInterface.OrderDetail) => {
        this.empty(undefined, result.orderDetailList as any);
        this.preparePayOrder(dispatch, [], [])
        this.preparePayOrderAddress({} as any, dispatch)
        this.preparePayOrderDetail({} as any, dispatch)
        const {order} = result;
        Taro.showLoading();
        await ProductService.cashierQueryStatus({orderNo: order.orderNo});
        Taro.hideLoading();
        Taro.redirectTo({
            url: `/pages/order/order.detail?id=${order.orderNo}`
        });
    }

    public storageProductCartList = () => {
        // const productCartList = store.getState().productSDK.productCartList;
    }



    /**
     * @time 0410
     * @todo [根据店家的活动把商品进行分类显示]
     */
    public filterByActivity = (
        productList: ProductCartInterface.ProductCartInfo[], 
        activityList?: MerchantInterface.Activity[]
    ): Array<FilterProductList> => {
        if (!!activityList && activityList.length > 0) {
            let nextProductList: FilterProductList[] = [];

            if (activityList.length === 1 && !activityList[0].activityDetailVOList) {
            /**
             * @todo [说明是全部满减]
             */
                return [{productList, activity: {name: NonActivityName} as any}];
            }

            /**
             * @todo [先把活动和非活动预设好]
             * @todo [全部满减和非满减只能存在一个]
             */
            activityList.forEach((activity) => {
                if (!!activity.activityDetailVOList) {
                    nextProductList.push({
                        activity,
                        productList: [],
                    });
                }
            });

            nextProductList.push({
                activity: activityList.find((a) => !a.activityDetailVOList) || {name: NonActivityName} as any,
                productList: [],
            });

            for (let i = 0; i < productList.length; i++) {
                let execd = false;
                const currentProduct = productList[i];

                nextProductList.forEach((nextProductListItem, nextProductListItemIndex) => {
                    /**
                     * @todo [如果该分类是部分满减分类]
                     */
                    if (!execd && !!nextProductListItem.activity && !!nextProductListItem.activity.activityDetailVOList) {
                        const token = nextProductListItem.activity.activityDetailVOList.some((activityItem) => activityItem.identity === currentProduct.barcode);
                        if (!!token) {
                            execd = true;
                            nextProductList[nextProductListItemIndex].productList.push(currentProduct);
                        } else {
                            /**
                             * @todo [如果没有满足条件的满减分类则插入到全部满减/非满减中]
                             */
                            if (!nextProductList[nextProductList.length - 1].productList.some((p) => p.barcode === currentProduct.barcode)) {
                                execd = true;
                                nextProductList[nextProductList.length - 1].productList.push(currentProduct);
                            }
                        }
                    }
                })
            }
            return nextProductList;
        }
        return [{productList, activity: {name: NonActivityName} as any}];
    }

    public selectProduct = (dispatch, type: string = 'normal', product?: ProductCartInterface.ProductCartInfo) => {
        dispatch({
            type: this.reducerInterface.SELECT_INDEX,
            payload: { type, product }
        });
    }
}

export default new ProductSDK();