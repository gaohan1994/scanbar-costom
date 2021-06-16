
const merchant = localStorage && localStorage.getItem('merchantId') && localStorage.getItem('merchantId') !== 'undefined' ? localStorage.getItem('merchantId') : '28';
const MCHIDFist = localStorage && localStorage.getItem('MCHIDFist') && localStorage.getItem('MCHIDFist') !== 'undefined' ? localStorage.getItem('MCHIDFist') : '28';
export const BASE_PARAM = {
    MCHID: merchant && process.env.TARO_ENV === 'h5' ? parseInt(merchant) : 28,
    MCHIDFist: MCHIDFist && process.env.TARO_ENV === 'h5' ? parseInt(MCHIDFist) : 28,
    ishomeView: false,        // 是否展示首页个人信息
    ishomePW: false,        // 是否展示首页广告
    ishomeAdress: false,        // 是否展示定位
    ishavePay: false,        // 是否有支付
    ishaveStorePhone: false,        // 是否可以联系商家
    isPayAdressTime: false,        // 是否支付有地址和时间
    isuserCenter: false,      // 是否展示个人中心会员信息
    isSelfmention: true,      // 是否展示到店自提 店内用餐
    iscoupon:false,           // 是否展示优惠券
    isPointsdeduction: false, // 是否展示积分
    iscancelorder: false,     // 是否展示取消订单
    isrefundorder: false,     // 是否展示退货
    isyuE: false,             // 是否有余额支付
    cartLimitNum:50,          // 购物车商品种数
}; 
