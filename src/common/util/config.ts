
const merchant = localStorage && localStorage.getItem('merchantId') && localStorage.getItem('merchantId') !== 'undefined' ? localStorage.getItem('merchantId') : '28';
console.log('merchant-config', merchant);
export const BASE_PARAM = {
    MCHID: merchant && process.env.TARO_ENV === 'h5' ? parseInt(merchant) : 28,
};