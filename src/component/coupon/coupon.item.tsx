import Taro from '@tarojs/taro';
import { View, Image, ScrollView, Text, Button } from '@tarojs/components';
import './index.less';
import classnames from 'classnames';
import { UserInterface } from '../../constants';
import dayJs from 'dayjs';

interface Props {
  data: UserInterface.CouponsItem;
  isGet?: boolean;
  isOpen: boolean;
  onChangeCouponOpen?: (data: UserInterface.CouponsItem, e: any) => any;
  gotoUse?: () => void;
  onGet?: (list: any) => void;
  unableToUse: boolean;
  selected?: boolean;
  onSelected?: (data: UserInterface.CouponsItem) => void;
  type?: number; // 0-未使用 1-已使用 2-已过期
}
interface State {

}

const cssPrefix = 'coupon';

class CouponItem extends Taro.Component<Props, State> {
  state = {
    ableObtainNum: 0,
  }
  render() {
    const {data, isOpen, onChangeCouponOpen, gotoUse,onGet, unableToUse, selected, onSelected, type, isGet } = this.props;
    const couponVO: any = data && data.couponVO ? data.couponVO : {};
    return (
      <View className={`${cssPrefix}-item`} onClick={() => { onSelected ? onSelected(data) : () => { } }}>
        <View
          className={classnames(`${cssPrefix}-item-top`, {
            [`${cssPrefix}-item-top-grey`]: unableToUse
          })}>
          <View className={`${cssPrefix}-item-top-left`}>
            <Text className={couponVO.discount > 999 ? `${cssPrefix}-item-top-left-priceAuto` : `${cssPrefix}-item-top-left-price`}>
              {couponVO.discount || 0}
              <Text className={`${cssPrefix}-item-top-left-sign`}>¥</Text>
            </Text>
            <Text className={`${cssPrefix}-item-top-left-info`}>满{couponVO.threshold || 0}可用</Text>
          </View>
          <View className={`${cssPrefix}-item-top-right`}>
            <Text className={classnames(`${cssPrefix}-item-top-right-info`, {
              [`${cssPrefix}-item-text-grey`]: unableToUse,
            })}>全品类可用</Text>
            <View className={`${cssPrefix}-item-top-right-row`}>
              <Text className={classnames(`${cssPrefix}-item-top-right-time`, {
                [`${cssPrefix}-item-text-grey`]: unableToUse,
              })}>
                {isGet ? `领取后${couponVO.expireTime}天失效`: data && data.effectiveTime ? dayJs(data.effectiveTime).format('MM/DD') : '无限期'}
                {isGet ? '' : '~'}
                {isGet ? '' : data && data.invalidTime ? dayJs(data.invalidTime).format('MM/DD') : '无限期'}
              </Text>
              <View
                className={`${cssPrefix}-item-top-right-pop`}
                onClick={(e) => {
                  onChangeCouponOpen ?
                    onChangeCouponOpen(data, e) :
                    () => {
                      if (e.stopPropagation) {
                        e.stopPropagation();
                      }
                    }
                }}
              >
                <Image
                  className={classnames(`${cssPrefix}-item-top-right-pop-img`, {
                    [`${cssPrefix}-item-top-right-pop-img-down`]: isOpen
                  })}
                  src={!unableToUse ? '//net.huanmusic.com/weapp/icon_packup_gray.png' : '//net.huanmusic.com/weapp/icon_expand_light.png'}
                />
              </View>
            </View>
          </View>
          {
            selected === true
              ? (
                <Image
                  className={`${cssPrefix}-item-top-radio`}
                  src='//net.huanmusic.com/scanbar-c/v2/bt_coupon_selected.png'
                />
              )
              : selected === false
                ? (
                  <Image
                    className={`${cssPrefix}-item-top-radio`}
                    src='//net.huanmusic.com/scanbar-c/v2/bt_coupon_normal.png'
                  />
                )
                :
                type === 1
                  ? (
                    <View
                      className={classnames(`${cssPrefix}-item-top-button`, {
                        [`${cssPrefix}-item-top-button-grey`]: unableToUse,
                      })}
                    >
                      已使用
                    </View>
                  )
                  : type === 2
                    ? (
                      <View
                        className={classnames(`${cssPrefix}-item-top-button`, {
                          [`${cssPrefix}-item-top-button-grey`]: unableToUse,
                        })}
                      >
                        已过期
                      </View>
                    )
                    : (
                      <View
                        className={classnames(`${cssPrefix}-item-top-button`, {
                          [`${cssPrefix}-item-text-grey`]: unableToUse,
                          [`${cssPrefix}-item-border-grey`]: unableToUse,
                          [`${cssPrefix}-item-top-button-isGet`]: isGet && this.state.ableObtainNum < couponVO.ableObtainNum,
                        })}
                        onClick={() => {  
                            if(isGet && onGet ) {
                              if(this.state.ableObtainNum < couponVO.ableObtainNum) {
                                this.setState({
                                  ableObtainNum: this.state.ableObtainNum + 1
                                });
                                onGet([{couponId: data.id}]);
                              } else {
                                if (!unableToUse && gotoUse) {
                                  gotoUse();
                                }
                              }
                              
                            } else {
                              if (!unableToUse && gotoUse) {
                                gotoUse();
                              }
                            }
                           
                         }}
                      >
                        {isGet && this.state.ableObtainNum < couponVO.ableObtainNum ? '领取' : '去使用'}
                      </View>
                    )
          }
        </View>
        {
          (isOpen || (data.ableToUse === false && data.disableReason)) && (
            <View className={`${cssPrefix}-item-bottom`}>
              {
                data.ableToUse === false && data.disableReason && (
                  <View className={`${cssPrefix}-item-bottom-prompt`}>
                    <Image
                      src='//net.huanmusic.com/scanbar-c/v2/icon_prompt.png'
                      className={`${cssPrefix}-item-bottom-prompt-icon`}
                    />
                    <Text className={`${cssPrefix}-item-bottom-info`}>
                      {data.disableReason}
                    </Text>
                  </View>
                )
              }
              {
                isOpen && (
                  <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text className={`${cssPrefix}-item-bottom-info`}>
                      1.优惠券满{couponVO.threshold || 0}元减{couponVO.discount || 0}元，全品类可用（优惠商品除外）；
                    </Text>
                    <Text className={`${cssPrefix}-item-bottom-info`}>
                      2.一个订单只能使用一张优惠券；
                    </Text>
                    <Text className={`${cssPrefix}-item-bottom-info`}>
                      3.优惠券只能抵扣商品费用，不抵扣配
                    </Text>
                  </View>
                )
              }

            </View>
          )
        }
      </View>
    )

  }
}

export default CouponItem;