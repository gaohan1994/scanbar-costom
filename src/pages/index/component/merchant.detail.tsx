/*
 * @Author: Ghan
 * @Date: 2020-06-02 10:42:16
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-06-08 14:25:27
 */
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.less";
import { MerchantInterface } from "src/constants";

const prefix = "index-component-card";

type Props = {
  merchant: MerchantInterface.AlianceMerchant;
};

function MerchantDetailCard(props: Props) {
  const { merchant } = props;
  console.log("merchant", merchant);
  return (
    <View className={`${prefix}`}>
      <View className={`${prefix}-detail`}>
        <View className={`${prefix}-detail-like`} />
        <View className={`${prefix}-detail-top`}>
          <View className={`${prefix}-detail-avatar`} />

          <View className={`${prefix}-detail-right`}>
            <View className={`${prefix}-detail-title`}>{merchant.name}</View>

            {merchant.activityInfo && (
              <View className={`${prefix}-detail-activitys`}>
                {merchant.activityInfo.map(item => {
                  return (
                    <View className={`${prefix}-detail-activity`}>{item}</View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {merchant.deliveryThreshold && (
          <View className={`${prefix}-detail-stant`}>
            {`公告：超出${merchant.deliveryThreshold}公里不配送`}
          </View>
        )}
      </View>
    </View>
  );
}

export default MerchantDetailCard;
