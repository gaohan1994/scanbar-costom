
const merchant = localStorage ? localStorage.getItem('merchantId') : '1';
export const BASE_PARAM = {
    MCHID: merchant && process.env.TARO_ENV === 'h5' ? parseInt(merchant) : 1,
};