/*
 * @Author: Ghan
 * @Date: 2020-06-02 10:42:16
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-07-16 15:24:31
 */
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.less";
import { MerchantInterface } from "src/constants";

const prefix = "index-component-search";

type Props = {
  merchant: MerchantInterface.AlianceMerchant;
};

function Search(props: Props) {
  const { merchant } = props;
  const onNavtoSearch = () => {
    Taro.navigateTo({
      url: `/pages/product/product.search`
    });
  };

  const onMemberClick = () => {
    this.$preload({ merchant, entry: "home" });
    Taro.navigateTo({ url: `/pages/user/user.card.detail` });
  };

  return (
    <View className={`${prefix}`} onClick={() => onNavtoSearch()}>
      <View className={`${prefix}-input`}>
        <View className={`${prefix}-input-icon`} />
        <View style="color:rgba(204,204,204,1);">搜索店内商品</View>
      </View>
      <View className={`${prefix}-member`} onClick={() => onMemberClick()}>
        <View className={`${prefix}-member-icon`} />
        <View className={`${prefix}-member-title`}>会员</View>
        <View className={`${prefix}-member-more`} />
      </View>
    </View>
  );
}

export default Search;
