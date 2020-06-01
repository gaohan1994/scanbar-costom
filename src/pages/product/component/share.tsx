<<<<<<< HEAD
import Taro from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import './index.less'
const prefix = 'product-detail-component'
function ProductShare() {
  if(process.env.TARO_ENV === 'h5'){
    return null;
  }
  return (
    <View style={{float: 'right'}}>
      <Button className={`${prefix}-share`} openType="share" />
    </View>
  );
=======
import Taro from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import './index.less'
const prefix = 'product-detail-component'
function ProductShare() {
  if(process.env.TARO_ENV === 'h5'){
    return null;
  }
  return (
    <View style={{float: 'right'}}>
      <Button className={`${prefix}-share`} openType="share" />
    </View>
  );
>>>>>>> 313a424d31b91d4bc3183aeb8f33a096edb50c99
}

export default ProductShare;
