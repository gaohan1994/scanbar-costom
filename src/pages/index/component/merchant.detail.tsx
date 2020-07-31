/*
 * @Author: Ghan
 * @Date: 2020-06-02 10:42:16
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-07-30 17:05:21
 */
import Taro from "@tarojs/taro";
import { View, ScrollView, Image } from '@tarojs/components';
import "./index.less";
import '../../../component/coupon/index.less';
import { MerchantInterface } from "../../../constants";
import merchantAction from "../../../actions/merchant.action";
import invariant from "invariant";
import { ResponseCode } from "../../../constants/index";
import { connect } from "@tarojs/redux";
import CouponItem from "./coupon.item";
import classNames from "classnames";

const prefix = "index-component-card";

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
        await this.props.setCurrentMerchantDetail(merchant);
        Taro.showToast({
          title: "取消收藏",
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
      await this.props.setCurrentMerchantDetail(merchant);
      Taro.showToast({
        title: "已收藏",
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
    let activityInfo: any[] = [];
    const activityInfoVOS = origionData;
    for (let i = 0; i < activityInfoVOS.length; i++) {
      let item = activityInfoVOS[i];
      let rule = item.rule
      if (typeof item.rule === 'string') {
        rule = JSON.parse(item.rule);
      }
      item.rule = rule;
      // if (typeof activityInfo[item.type] !== 'undefined') {
      //   let array = activityInfo[item.type];
      //   for (let j = 0; j < item.rule.length; j++) {
      //     let itemSplice = { ...item, rule: item.rule[j] };
      //     array.push(itemSplice);
      //   }
      //   activityInfo[item.type] = array;
      // } else {
      //   let array: any[] = [];
      //   for (let j = 0; j < item.rule.length; j++) {
      //     let itemSplice = { ...item, rule: item.rule[j] };
      //     array.push(itemSplice);
      //   }
      //   activityInfo[item.type] = array;
      // }
      activityInfo.push(item);
    }
    return activityInfo;
  }

  render() {
    const { merchant } = this.props;
    const { showCouponMore, showMerchantMore } = this.state;
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
                  <View className={`${prefix}-detail-cover`}>
                    {!!merchant.isNew && (
                      <View className={`${prefix}-detail-cover-new`} />
                    )}
                    {merchant.status === false && (
                      <View className={`${prefix}-detail-cover-close`} />
                    )}

                    {merchant.logo && merchant.logo !== "" ? (
                      <View
                        className={`${prefix}-detail-cover-image`}
                        style={`background-image: url(${merchant.logo})`}
                      />
                    ) : (
                        <Image
                          src="//net.huanmusic.com/scanbar-c/icon_shop_default.png"
                          className={`${prefix}-detail-cover-image`}
                        />
                      )}
                  </View>

                  <View className={`${prefix}-detail-right`}>
                    <View className={`${prefix}-detail-title`} onClick={() => this.showMerchant()}>
                      <View className={`${prefix}-detail-title-text`}>
                        {merchant.name}
                      </View>
                      <View className={`${prefix}-detail-expand`} />
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
                        <View className={`${prefix}-detail-activitys`} onClick={() => this.showCoupon()}>
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
                                <View
                                  // className={`${prefix}-detail-coupon-item ${prefix}-detail-coupon-obtained`}
                                  className={classNames(`${prefix}-detail-coupon-item`, {
                                    [`${prefix}-detail-coupon-obtained`]: item.isObtained
                                  })}
                                  onClick={() => this.showCoupon()}
                                >
                                  {item.isObtained ? '已领' : '领取'}
                                </View>
                              </View>
                            );
                          })}
                          <View className={`${prefix}-detail-expand`} />
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
    const { merchant, setCurrentMerchantDetail } = this.props;
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
              <View className={`${prefix}-detail-cover`}>
                {!!merchant.isNew && (
                  <View className={`${prefix}-detail-cover-new`} />
                )}
                {!merchant.status && (
                  <View className={`${prefix}-detail-cover-close`} />
                )}

                {merchant.logo && merchant.logo !== "" ? (
                  <View
                    className={`${prefix}-detail-cover-image`}
                    style={`background-image: url(${merchant.logo})`}
                  />
                ) : (
                    <Image
                      src="//net.huanmusic.com/scanbar-c/icon_shop_default.png"
                      className={`${prefix}-detail-cover-image`}
                    />
                  )}
              </View>

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
                              <CouponItem
                                data={item}
                                setCurrentMerchantDetail={setCurrentMerchantDetail}
                                merchant={merchant}
                                hideCoupon={this.hideCoupon}
                              />
                            </View>
                          )
                        })
                      )
                    }
                    {merchant && Array.isArray(merchant.activityInfoVOS) && merchant.activityInfoVOS.length > 0 && (
                      <View>
                        <View className={`${prefix}-tip`}>优惠</View>
                        <View >
                          {
                            activityInfo.map((item: any) => {
                              return (
                                <View className={`${prefix}-detail-discount`} key={item.name}>
                                  <View className={`${prefix}-detail-discount-symbol`}>
                                    {item.name}
                                  </View>
                                  <View className={`${prefix}-detail-discount-row`}>
                                    {
                                      item.rule.map((ele: any, index: number) => {
                                        return (
                                          <View className={`${prefix}-detail-discount-content`}>
                                            {`满${ele.threshold}减${ele.discount}${(index !== item.rule.length - 1) ? '，' : ''}`}
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
}

const mapDispatch = dispatch => {
  return {
    setCurrentMerchantDetail: merchantAction.setCurrentMerchantDetail(dispatch)
  };
};

export default connect(() => ({}), mapDispatch)(MerchantDetailCard as any);