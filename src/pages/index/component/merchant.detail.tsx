/*
 * @Author: Ghan
 * @Date: 2020-06-02 10:42:16
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-07-16 17:38:32
 */
import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.less";
import { MerchantInterface } from "src/constants";
import merchantAction from "../../../actions/merchant.action";
import invariant from "invariant";
import { ResponseCode } from "../../../constants/index";

const prefix = "index-component-card";

type Props = {
  merchant: MerchantInterface.AlianceMerchant;
};

function MerchantDetailCard(props: Props) {
  const { merchant } = props;
  const [showMore, setShowMore] = useState(false);

  /**
   * 给商家打电话
   */
  const onPhone = () => {
    if (!!merchant.servicePhone) {
      Taro.makePhoneCall({
        phoneNumber: merchant.servicePhone
      });
      return;
    }
    Taro.showToast({
      title: "商家暂未提供电话",
      icon: "none"
    });
  };

  const merchantLike = async e => {
    try {
      e.stopPropagation();
      const { isAttentioned } = merchant;
      if (!!isAttentioned) {
        /**
         * 已关注
         */
        const result = await merchantAction.cancelMerchantAttention(merchant);
        invariant(result.code === ResponseCode.success, result.msg || " ");

        /**
         * 收藏完之后更新
         */
        merchantAction.getMerchantDetail(merchant);
        Taro.showToast({
          title: "取消收藏"
        });
        return;
      }
      /**
       * 未关注
       */
      const result = await merchantAction.addMerchantAttention(merchant);
      invariant(result.code === ResponseCode.success, result.msg || " ");
      /**
       * 收藏完之后更新
       */
      merchantAction.getMerchantDetail(merchant);
      Taro.showToast({
        title: "已收藏"
      });
      return;
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  };

  const toogle = () => {
    setShowMore(!showMore);
  };

  return (
    <View>
      {showMore ? (
        <View className={`${prefix}-wrap`}>
          <View className={`${prefix}`}>
            <View className={`${prefix}-detail ${prefix}-detail-pos`}>
              <View onClick={toogle} className={`${prefix}-close`} />
              <View
                className={`${prefix}-detail-like ${
                  !!merchant.isAttentioned ? `${prefix}-detail-like-active` : ""
                }`}
                onClick={merchantLike}
              />
              <View className={`${prefix}-detail-top`}>
                <View className={`${prefix}-detail-avatar`} />

                <View className={`${prefix}-detail-right`}>
                  <View className={`${prefix}-detail-title`}>
                    {merchant.name}
                  </View>

                  {merchant.activityInfo && (
                    <View className={`${prefix}-detail-activitys`}>
                      {merchant.activityInfo.map(item => {
                        return (
                          <View className={`${prefix}-detail-activity`}>
                            {item}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </View>

              <View style="width: 100%; position: relative">
                <View className={`${prefix}-tip`}>商家地址</View>
                <View className={`${prefix}-detail-stant`}>
                  {`${merchant.address}`}
                </View>

                <View
                  className={`${prefix}-detail-phone`}
                  onClick={() => onPhone()}
                >
                  <View className={`${prefix}-detail-phone-icon`} />
                </View>
              </View>

              {merchant.businessStartTime && (
                <View>
                  <View className={`${prefix}-tip`}>配送时间</View>
                  <View className={`${prefix}-detail-stant`}>
                    {`${merchant.businessStartTime}~${merchant.businessEndTime}`}
                  </View>
                </View>
              )}

              {merchant.deliveryThreshold && (
                <View>
                  <View className={`${prefix}-tip`}>公告</View>
                  <View className={`${prefix}-detail-stant`}>
                    {`公告：超出${merchant.deliveryThreshold}公里不配送`}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View className={`${prefix}`}>
          <View className={`${prefix}-detail`} onClick={() => toogle()}>
            <View
              className={`${prefix}-detail-like ${
                !!merchant.isAttentioned ? `${prefix}-detail-like-active` : ""
              }`}
              onClick={merchantLike}
            />
            <View className={`${prefix}-detail-top`}>
              <View className={`${prefix}-detail-avatar`} />

              <View className={`${prefix}-detail-right`}>
                <View className={`${prefix}-detail-title`}>
                  {merchant.name}
                </View>

                {merchant.activityInfo && (
                  <View className={`${prefix}-detail-activitys`}>
                    {merchant.activityInfo.map(item => {
                      return (
                        <View className={`${prefix}-detail-activity`}>
                          {item}
                        </View>
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
      )}
    </View>
  );
}

export default MerchantDetailCard;
