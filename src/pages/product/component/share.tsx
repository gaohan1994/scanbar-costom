import Taro from "@tarojs/taro";
import { View, Button } from "@tarojs/components";

function ProductShare() {
  return (
    <View>
      <Button openType="share" style="background: #fff">
        微信好友
      </Button>
    </View>
  );
}

export default ProductShare;
