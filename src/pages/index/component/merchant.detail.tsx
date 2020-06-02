/*
 * @Author: Ghan
 * @Date: 2020-06-02 10:42:16
 * @Last Modified by:   Ghan
 * @Last Modified time: 2020-06-02 10:42:16
 */
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.less";

const prefix = "index-component-card";

function MerchantDetailCard() {
  return (
    <View className={`${prefix}`}>
      <View className={`${prefix}-detail`}>gaohan</View>
    </View>
  );
}

export default MerchantDetailCard;
