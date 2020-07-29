
const merchant = localStorage && localStorage.getItem('merchantId') && localStorage.getItem('merchantId') !== 'undefined' ? localStorage.getItem('merchantId') : '1';
const MCHIDFist = localStorage && localStorage.getItem('MCHIDFist') && localStorage.getItem('MCHIDFist') !== 'undefined' ? localStorage.getItem('MCHIDFist') : '1';
export const BASE_PARAM = {
    MCHID: merchant && process.env.TARO_ENV === 'h5' ? parseInt(merchant) : 1,
    MCHIDFist: MCHIDFist && process.env.TARO_ENV === 'h5' ? parseInt(MCHIDFist) : 1,
};