
const merchant = localStorage && localStorage.getItem('merchantId') ? localStorage.getItem('merchantId') : '1';
console.log('merchant' ,merchant);
export const BASE_PARAM = {
    MCHID: merchant && process.env.TARO_ENV === 'h5' ? parseInt(merchant) : 1,
};
// 1  wxba027d099f6ec41b
// 28  wxeb047bda65bc4487