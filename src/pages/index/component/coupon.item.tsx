import Taro from "@tarojs/taro";
import { View, Text } from '@tarojs/components';
import "./index.less";
import '../../../component/coupon/index.less';
import classnames from 'classnames';
import dayJs from 'dayjs';
import { UserAction } from "../../../actions";

const cssPrefix = 'coupon';

export default class CouponItem extends Taro.Component<any, any> {
  
  obtainCoupon = async (item: any) => {
    const { setCurrentMerchantDetail, merchant, hideCoupon } = this.props;
    if (item.isObtained) {
      hideCoupon();
    } else {
      const params = {
        couponIdList: [item.id],
        merchantId: merchant.id
      }
      const res = await UserAction.obtainMerchantCoupons(params);
      if (res.success) {
        await setCurrentMerchantDetail(merchant);
        Taro.showToast({
          title: "领取优惠券成功",
          duration: 3000,
        })
      } else {
        Taro.showToast({
          title: res.result || "领取优惠券失败",
          icon: 'none'
        })
      }
    }
  }

  render() {
    const { data } = this.props;
    if (!data) {
      return <View />
    }
    return (
      <View className={`${cssPrefix}-item`} style="width: 641rpx;">
        <View className={classnames(`${cssPrefix}-item-top`)} style="margin-bottom: -5rpx;">
          <View className={`${cssPrefix}-item-top-left`}>
            <Text className={`${cssPrefix}-item-top-left-price`}>
              {data.discount || 0}
              <Text className={`${cssPrefix}-item-top-left-sign`}>¥</Text>
            </Text>
            <Text className={`${cssPrefix}-item-top-left-info`}>满{data.threshold || 0}可用</Text>
          </View>
          <View className={`${cssPrefix}-item-top-right`}>
            <Text className={classnames(`${cssPrefix}-item-top-right-info`)}>全品类可用</Text>
            <View className={`${cssPrefix}-item-top-right-row`}>
              <Text className={classnames(`${cssPrefix}-item-top-right-time`)}>
                {data.obtainEndTime ? `截止至${dayJs(data.obtainEndTime).format('MM/DD')}` : '无限期'}
              </Text>
            </View>
          </View>

          <View className={classnames(`${cssPrefix}-item-top-button`, {
            [`${cssPrefix}-item-text-grey`]: false,
            [`${cssPrefix}-item-border-grey`]: false,
            [`${cssPrefix}-item-top-button-isGet`]: !data.isObtained,
          })}
            onClick={() => this.obtainCoupon(data)}
          >
            {data.isObtained ? '已领取' : '领取'}
          </View>

        </View>
      </View>
    )
  }
}