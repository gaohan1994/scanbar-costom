// @ts-ignore
const getBaseUrl = (url: string) => {
  let BASE_URL = '';
  if (process.env.NODE_ENV === 'development') {
    // 开发环境 - 根据请求不同返回不同的BASE_URL
    BASE_URL = 'https://inventory.51cpay.com/inventory-customer';
  } else {
    // 生产环境
    BASE_URL = 'https://inventory.51cpay.com/inventory-customer';
  }
  return BASE_URL;
};

export default getBaseUrl;