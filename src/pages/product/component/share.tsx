import Taro from "@tarojs/taro";
import { Button } from "@tarojs/components";
import './index.less';

const cssPrefix = "product-detail-component";

function ProductShare() {
  
  return (
    <Button openType="share" className={`${cssPrefix}-share`}>

    </Button >
  );
}

export default ProductShare;
