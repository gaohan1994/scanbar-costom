/**
 * @Author: Ghan
 * @Date: 2019-11-13 10:10:53
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-09 14:05:36
 *
 * @todo [商品相关的类型定义]
 */

import {jsonToQueryString} from "../index";
import {HTTPInterface} from '..';

export declare namespace ProductInterface {

    /**
     *
     * @param {cost} 进货价
     * @param {limitNum} 库存下限预警
     * @param {memberPrice} 会员价
     * @param {merchantId} 商户id
     * @param {number} 库存
     * @param {price} 售价
     * @param {saleType} 销售类型（0：按件卖[默认]；1称重）
     * @param {status} 状态(0：启用;1：停用)
     * @param {type} 品类id
     * @param {barcode} 条码
     * @param {brand} 品牌
     * @param {pictures} 图片
     * @param {standard} 规格
     * @param {supplier} 供应商名称
     * @param {unit} 单位
     * @author Ghan
     * @interface ProductInfo
     */
    interface ProductInfo {
        id: number;
        sellNum: number;      //
        cost: number;         // 进货价
        avgCost: number;      // 平均进货价
        limitNum: number;     // 库存下限预警
        memberPrice: number;  // 会员价
        merchantId: number;   // 商户id
        number: number;       // 库存
        price: number;        // 售价
        unitPrice?: number;   // 单价 无码商品要穿
        saleNumber: number;   // 可售商品数量（显示给用户的库存）
        saleType: number;     // 销售类型（0：按件卖[默认]；1称重）
        status: number;       // 状态(0：启用;1：停用)
        type: number;         // 品类
        typeId: number;       // 品类id
        typeName: string;     // 品类名称
        barcode: string;      // 条码
        brand: string;        // 品牌
        pictures: string;     // 图片
        standard: string;     // 规格
        supplier?: string;     // 供应商名称
        unit: string;         // 单位
        firstLetter: string;  // 首字母
        imgs: string[];       // 商品图片
        remark?: string;      // 商品备注
        name: string;
        description: string;
        updateBy: string;
        createBy: string;
        createTime: string;
        updateTime: string;
        supplierId: number;
        supplierName: string;
        activityInfos: any[];
    }

    interface ProductTypeInfo {
        name: string;
        id: number;
        createTime: string;
    }

    interface IndexProducList {
        title: string;
        key: string;
        data: ProductInterface.ProductInfo[];
    }

    interface ProductList {
        typeInfo: ProductTypeInfo;
        productList: ProductInfo[];
    }

    interface ProductInfoGetListFetchFidle {
        words: string;
    }

    interface ProductInfoListFetchFidle extends Partial<HTTPInterface.FetchField> {
        barcode?: string;        // 条码
        brand?: string;          // 品牌
        id?: number;             // 商品id
        name?: string;           // 商品名称
        orderByColumn?: string;  // 排序 amount desc
        status?: number;         // 商品状态
        supplierId?: string;     // 供应商
        type?: string;           // 品类
        words?: string;
        merchantId?: number,
    }

    interface ProductInfoTypeFetchFidle {
        merchantId: number;
    }

    interface ProductType {
        id: number;
        name: string;
        createTime: string;
    }

    interface ProductSupplier {
        id: number;
        merchantId: number;
        name: string;
        contactName: string;
        phoneNumber: string;
        address: string;
        remark: string;
        createTime: string;
        updateTime: string;
    }

    interface ProductScan {
        id: number;
        address: string;
        barcode?: string;
        brand: string;
        createTime: string;
        goodsType: string;
        img: string;
        name: string;
        price: string;
        remark: string;
        standard: string;
        supplier: string;
    }

    interface ProductInfoAdd extends Partial<ProductInterface.ProductInfo> {
        barcode: string;
        name: string;
    }

    interface ProductDetailFetchFidle {
        id: number;
    }

    interface ProductInfoScanGetFetchFidle {
        barcode: string;
    }

    interface ProductCashierQueryStatus {
        orderNo: string;
    }

    interface CashierPay {
        codeUrl: string;
        orderNo: string;
    }

    interface CashierRefundOrder {
        memberId: number;
        orderSource: number;
        payType: number;
        totalAmount: number;
        // totalNum: number;
        // transAmount: number;
        orderNo: string;
        terminalCd: string;
        terminalSn: string;
    }

    interface CashierRefundProduct {
        changeNumber: number;
        productId: number;
        unitPrice: number;
        remark: string;
        // transAmount: number;
    }

    interface CashierRefund {
        order: Partial<CashierRefundOrder>;
        productInfoList: CashierRefundProduct[];
    }

    type RECEIVE_PRODUCT_LIST = string;
    type RECEIVE_PRODUCT_SEARCH_LIST = string;
    type RECEIVE_PRODUCT_TYPE = string;
    type RECEIVE_PRODUCT_DETAIL = string;
    type RECEIVE_PAY_DETAIL = string;

    interface ReducerInterface {
        RECEIVE_PRODUCT_LIST: RECEIVE_PRODUCT_LIST;
        RECEIVE_PRODUCT_SEARCH_LIST: RECEIVE_PRODUCT_SEARCH_LIST;
        RECEIVE_PRODUCT_TYPE: RECEIVE_PRODUCT_TYPE;
        RECEIVE_PRODUCT_DETAIL: RECEIVE_PRODUCT_DETAIL;
        RECEIVE_PAY_DETAIL: RECEIVE_PAY_DETAIL;
    }
}

interface ProductInterfaceMap {
    reducerInterfaces: ProductInterface.ReducerInterface;
    productInfoType(params: ProductInterface.ProductInfoTypeFetchFidle): string;
    cashierPay: string;

    cashierQueryStatus (params: ProductInterface.ProductCashierQueryStatus): string;

    productInfoList (params?: ProductInterface.ProductInfoListFetchFidle): string;

    productInfoDetail (params: ProductInterface.ProductDetailFetchFidle): string;
}

class ProductInterfaceMap {

    public reducerInterfaces = {
        RECEIVE_PRODUCT_LIST: 'RECEIVE_PRODUCT_LIST',
        RECEIVE_PRODUCT_SEARCH_LIST: 'RECEIVE_PRODUCT_SEARCH_LIST',
        RECEIVE_PRODUCT_TYPE: 'RECEIVE_PRODUCT_TYPE',
        RECEIVE_PRODUCT_DETAIL: 'RECEIVE_PRODUCT_DETAIL',
        RECEIVE_PAY_DETAIL: 'RECEIVE_PAY_DETAIL',
    };

    public cashierPay = '/cashier/pay';
    public cashierOrder = '/api/cashier/order';

    public productInfoType = (params: ProductInterface.ProductInfoTypeFetchFidle) => {
        return `/customer/product/type/${params.merchantId}`;
    }

    public cashierQueryStatus = (params: ProductInterface.ProductCashierQueryStatus) => {
        return `/cashier/queryStatus/${params.orderNo}/60`;
    }

    public productInfoList = (params?: ProductInterface.ProductInfoListFetchFidle) => {
        return `/customer/product/list${params ? jsonToQueryString(params) : ''}`;
    }

    public productInfoDetail = (params: ProductInterface.ProductDetailFetchFidle) => {
        return `/customer/product/detail/${params.id}`;
    }
}

export default new ProductInterfaceMap();