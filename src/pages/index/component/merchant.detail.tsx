/*
 * @Author: Ghan
 * @Date: 2020-06-02 10:42:16
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-07-24 09:41:01
 */
import Taro from "@tarojs/taro";
import { View, ScrollView, Text } from '@tarojs/components';
import "./index.less";
import '../../../component/coupon/index.less';
import { MerchantInterface } from "../../../constants";
import merchantAction from "../../../actions/merchant.action";
import invariant from "invariant";
import { ResponseCode } from "../../../constants/index";
import classnames from 'classnames';
import dayJs from 'dayjs';
import { connect } from "@tarojs/redux";
import { UserAction } from "../../../actions";

const prefix = "index-component-card";
const cssPrefix = 'coupon';


type Props = {
  merchant: MerchantInterface.AlianceMerchant;
  setCurrentMerchantDetail: (
    merchant: MerchantInterface.AlianceMerchant
  ) => void;
};

type State = {
  showMerchantMore: boolean;
  showCouponMore: boolean;
  activityInfo: any;
}

class MerchantDetailCard extends Taro.Component<Props, State> {

  state = {
    showMerchantMore: false,
    showCouponMore: false,
    activityInfo: {} as any
  }
  /**
 * 给商家打电话
 */
  onPhone = () => {
    const { merchant } = this.props;
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

  merchantLike = async e => {
    const { merchant } = this.props;
    try {
      e.stopPropagation();
      const { isAttention } = merchant;
      if (!!isAttention) {
        /**
         * 已关注
         */
        const result = await merchantAction.cancelMerchantAttention(merchant);
        invariant(result.code === ResponseCode.success, result.msg || " ");

        /**
         * 收藏完之后更新
         */
        this.props.setCurrentMerchantDetail(merchant);
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
      this.props.setCurrentMerchantDetail(merchant);
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

  showMerchant = () => {
    this.setState({ showMerchantMore: true });
  };

  hideMerchant = () => {
    this.setState({ showMerchantMore: false });
  }

  showCoupon = async () => {
    const { merchant } = this.props;
    const activityInfo = this.getActivityInfo(merchant.activityInfoVOS);
    this.setState({ activityInfo: activityInfo, showCouponMore: true });
  }

  hideCoupon = () => {
    this.setState({ showCouponMore: false });
  }

  getActivityInfo = (origionData: any) => {
    let activityInfo = {};
    const activityInfoVOS = origionData;
    for (let i = 0; i < activityInfoVOS.length; i++) {
      let item = activityInfoVOS[i];
      let rule = JSON.parse(item.rule);
      item.rule = rule;
      if (typeof activityInfo[item.type] !== 'undefined') {
        let array = activityInfo[item.type];
        for (let j = 0; j < item.rule.length; j++) {
          let itemSplice = { ...item, rule: item.rule[j] };
          array.push(itemSplice);
        }
        activityInfo[item.type] = array;
      } else {
        let array: any[] = [];
        for (let j = 0; j < item.rule.length; j++) {
          let itemSplice = { ...item, rule: item.rule[j] };
          array.push(itemSplice);
        }
        activityInfo[item.type] = array;
      }
    }
    return activityInfo;
  }

  obtainCoupon = async (item: any) => {
    const { setCurrentMerchantDetail, merchant } = this.props;
    if (item.isObtain) {
      this.hideCoupon();
    } else {
      const params = {
        couponIdList: [item.id]
      }
      const res = await UserAction.countMyMemberCardAndCoupon(params);
      if (res.result) {
        setCurrentMerchantDetail(merchant);
        Taro.showToast({
          title: "领取优惠券成功",
          icon: 'none'
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
    const { merchant } = this.props;
    const { showCouponMore, showMerchantMore, activityInfo } = this.state;
    return (
      <View>
        {showMerchantMore || showCouponMore ? (
          this.renderMoreInfo()
        ) : (
            <View className={`${prefix}`}>
              <View className={`${prefix}-detail`}>
                <View
                  className={`${prefix}-detail-like ${
                    !!merchant.isAttention ? `${prefix}-detail-like-active` : ""
                    }`}
                  onClick={this.merchantLike}
                />
                <View className={`${prefix}-detail-top`}>
                  <View className={`${prefix}-detail-avatar`} />

                  <View className={`${prefix}-detail-right`}>
                    <View className={`${prefix}-detail-title`}>
                      <View className={`${prefix}-detail-title-text`}>
                        {merchant.name}
                      </View>
                      <View className={`${prefix}-detail-expand`} onClick={() => this.showMerchant()} />
                    </View>

                    {merchant && Array.isArray(merchant.topActivityInfos) && merchant.topActivityInfos.length > 0 && (
                      <View className={`${prefix}-detail-activitys`}>
                        {merchant.topActivityInfos.map((item, index) => {
                          if (index > 3) {
                            return <View />
                          }
                          return (
                            <View className={`${prefix}-detail-activity`}>
                              {item}
                            </View>
                          );
                        })}
                      </View>
                    )}
                    {
                      merchant && Array.isArray(merchant.couponVOS) && merchant.couponVOS.length > 0 && (
                        <View className={`${prefix}-detail-activitys`}>
                          {merchant.couponVOS.map((item, index) => {
                            if (index > 2) {
                              return <View />
                            }
                            return (
                              <View className={`${prefix}-detail-coupon`}>
                                <View className={`${prefix}-detail-coupon-item ${prefix}-detail-coupon-item-left`}>
                                  <View className={`${prefix}-detail-coupon-border`}>
                                    <View className={`${prefix}-detail-coupon-item-symbol`}>¥</View>
                                    <View className={`${prefix}-detail-coupon-item-price`}>{item.discount}</View>
                                  </View>
                                </View>
                                <View className={`${prefix}-detail-coupon-item`} onClick={() => this.showCoupon()}>
                                  {item.isObtained ? '已领' : '领取'}
                                </View>
                              </View>
                            );
                          })}
                          <View className={`${prefix}-detail-expand`} onClick={() => this.showCoupon()} />
                        </View>
                      )
                    }
                  </View>
                </View>
                <View className={`${prefix}-detail-stant`}>
                  {`公告：${!!merchant.announcement && merchant.announcement ? merchant.announcement : '无'}`}
                </View>
              </View>
            </View>
          )
        }
      </View>
    )
  }

  renderMoreInfo() {
    const { merchant } = this.props;
    const { showCouponMore, showMerchantMore, activityInfo } = this.state;
    return (
      <View className={`${prefix}-wrap`}>
        <View className={`${prefix}`}>
          <View className={`${prefix}-detail ${prefix}-detail-pos`}>
            <View className={`${prefix}-close`} onClick={() => { this.hideCoupon(); this.hideMerchant() }} />
            <View
              className={`${prefix}-detail-like ${
                !!merchant.isAttention ? `${prefix}-detail-like-active` : ""
                }`}
              onClick={this.merchantLike}
            />
            <View className={`${prefix}-detail-top`}>
              <View className={`${prefix}-detail-avatar`} />

              <View className={`${prefix}-detail-right`}>
                <View className={`${prefix}-detail-title ${prefix}-detail-title-more`}>
                  <View className={`${prefix}-detail-title-text ${prefix}-detail-title-text-more`}>
                    {merchant.name}
                  </View>
                </View>
              </View>
            </View>

            <ScrollView scrollY={true} className={`${prefix}-detail-scrollview`}>
              {
                showMerchantMore && (
                  <View>
                    <View style="width: 100%; position: relative">
                      <View className={`${prefix}-tip`} style="margin-top: 20rpx">商家地址</View>
                      <View className={`${prefix}-detail-stant`}>
                        {`${merchant.address}`}
                      </View>

                      <View
                        className={`${prefix}-detail-phone`}
                        onClick={() => this.onPhone()}
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
                  </View>
                )
              }
              {
                showCouponMore && (
                  <View>
                    {
                      merchant.couponVOS.length > 0 && (
                        merchant.couponVOS.map(item => {
                          return (
                            <View className={`${prefix}-detail-discount-item`}>
                              {this.renderCouponItem(item)}
                            </View>
                          )
                        })
                      )
                    }
                    {merchant && Array.isArray(merchant.activityInfoVOS) && merchant.activityInfoVOS.length > 0 && (
                      <View>
                        <View className={`${prefix}-tip`}>优惠</View>
                        <View>
                          {
                            activityInfo && Object.keys(activityInfo).sort().map(function (key: any) {
                              return (
                                <View className={`${prefix}-detail-discount`} key={key}>
                                  <View className={`${prefix}-detail-discount-symbol`}>
                                    {key === '3' ? `满减` : ``}
                                  </View>
                                  <View className={`${prefix}-detail-discount-row`}>
                                    {
                                      activityInfo[key].map((item: any, index: number) => {
                                        return (
                                          <View className={`${prefix}-detail-discount-content`}>
                                            {`满${item.rule.threshold}减${item.rule.discount}${(index !== activityInfo[key].length - 1) ? '，' : ''}`}
                                          </View>
                                        )
                                      })
                                    }
                                  </View>

                                </View>
                              )
                            })
                          }
                        </View>
                      </View>
                    )}
                  </View>
                )
              }
              <View>
                <View className={`${prefix}-tip`}>公告</View>
                <View className={`${prefix}-detail-stant`}>
                  {`${merchant.announcement && merchant.announcement ? merchant.announcement : '无'}`}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  renderCouponItem(data: any) {
    return (
      <View className={`${cssPrefix}-item`} style="margin-top: 0px;">
        <View className={classnames(`${cssPrefix}-item-top`)} style="margin-bottom: -10rpx;">
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
            [`${cssPrefix}-item-top-button-isGet`]: !data.isObtain,
          })}
            onClick={() => this.obtainCoupon(data)}
          >
            {data.isObtain ? '去使用' : '领取'}
          </View>

        </View>
      </View>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    setCurrentMerchantDetail: merchantAction.setCurrentMerchantDetail(dispatch)
  };
};

export default connect(() => ({}), mapDispatch)(MerchantDetailCard as any);