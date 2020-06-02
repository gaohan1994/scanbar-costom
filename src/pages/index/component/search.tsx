/*
 * @Author: Ghan
 * @Date: 2020-06-02 10:42:16
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-06-02 15:31:16
 */
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.less";

const prefix = "index-component-search";

function Search() {
  const onNavtoSearch = () => {
    Taro.navigateTo({
      url: `/pages/product/product.search`
    });
  };

  return (
    <View className={`${prefix}`} onClick={() => onNavtoSearch()}>
      <View className={`${prefix}-input`}>
        <View className={`${prefix}-input-icon`} />
        <View style="color:rgba(204,204,204,1);">搜索店内商品</View>
      </View>
      <View className={`${prefix}-member`}></View>
    </View>
  );
}

export default Search;
