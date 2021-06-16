// @ts-ignore
const getBaseUrl = (url: string) => {
  let BASE_URL = '';
  if (process.env.NODE_ENV === 'development') {
    // 开发环境 - 根据请求不同返回不同的BASE_URL
    // http://xyt.51cpay.com:8891
    // BASE_URL = 'https://xyt.51cpay.com/inventory-customer';
    // BASE_URL = 'https://inventory.51cpay.com/inventory-customer';
    // BASE_URL = 'https://inventory.51cpay.com:8890/inventory-customer';
    // BASE_URL = 'http://172.30.202.145:8087/inventory-customer/api';
    // BASE_URL = 'http://121.36.193.17:8089/yd/st/qorder/inventory-customer/api';
    BASE_URL = 'http://103.126.126.119:8038/yd/st/qorder/inventory-customer/api';
  } else {
    // 生产环境
    BASE_URL = 'http://103.126.126.119:8038/yd/st/qorder/inventory-customer/api';
    // BASE_URL = 'https://xyt.51cpay.com/inventory-customer';
    // BASE_URL = 'https://inventory.51cpay.com/inventory-customer';
    // BASE_URL = 'https://inventory.51cpay.com:8890/inventory-customer';
    // BASE_URL = 'http://172.30.12.228/inventory-customer';
  }
  return BASE_URL;
};

export default getBaseUrl;