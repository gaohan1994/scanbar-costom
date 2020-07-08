
const merchant = localStorage && localStorage.getItem('merchantId') && localStorage.getItem('merchantId') !== 'undefined' ? localStorage.getItem('merchantId') : '28';
const MCHIDFist = localStorage && localStorage.getItem('MCHIDFist') && localStorage.getItem('MCHIDFist') !== 'undefined' ? localStorage.getItem('MCHIDFist') : '28';
export const BASE_PARAM = {
    MCHID: merchant && process.env.TARO_ENV === 'h5' ? parseInt(merchant) : 28,
    MCHIDFist: MCHIDFist && process.env.TARO_ENV === 'h5' ? parseInt(MCHIDFist) : 28,
};