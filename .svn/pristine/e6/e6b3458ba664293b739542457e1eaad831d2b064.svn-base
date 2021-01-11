declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.sass";
declare module "*.styl";

// @ts-ignore
declare const process: {
  env: {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq';
    [key: string]: any;
  }
}
type Weixin = {
  config(conf: {
		debug?: boolean; // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: string; // 必填，公众号的唯一标识
		timestamp: number; // 必填，生成签名的时间戳
		nonceStr: string; // 必填，生成签名的随机串
		signature: string; // 必填，签名，见附录1
		jsApiList: string[]; // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	}): void;
}

declare global {
  interface Window {
    wx: Weixin,
    AMap: any
  }

}
