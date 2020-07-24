import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import dayJs from 'dayjs';
import './index.less';

interface Props {
  item: any;
  isOpen: boolean;
  onChangeCouponOpen: (data: any, e: any) => any;
  goToUse?: (item: any) => void;
}

const cssPrefix = 'user-coupon';

class UserCouponItem extends Taro.Component<Props, any> {
  render() {
    const { item, isOpen, onChangeCouponOpen, goToUse } = this.props;
    return (
      <View className={`${cssPrefix}-scrollview-item-container`}>
        <View className={`${cssPrefix}-scrollview-item-container-img`}>
          <View className={`${cssPrefix}-scrollview-item-top`}>
            <View className={`${cssPrefix}-scrollview-item-top-left`}>
              {
                item.logo && item.logo.length > 0 ? (
                  <View className={`${cssPrefix}-scrollview-item-avatar`} style={`background-image: url(${item.logo})`} />
                )
                  : (
                    <View className={`${cssPrefix}-scrollview-item-avatar`} />
                  )
              }
              <View className={`${cssPrefix}-scrollview-item-top-info`}>
                <View className={`${cssPrefix}-scrollview-item-top-info-name`}>
                  {item.name}
                </View>
                <View className={`${cssPrefix}-scrollview-item-grey`}>
                  {`${item && item.effectiveTime ? dayJs(item.effectiveTime).format('MM/DD') : '无限期'}～
                  ${item && item.invalidTime ? dayJs(item.invalidTime).format('MM/DD') : '无限期'}`}
                </View>
              </View>
            </View>
            <View className={`${cssPrefix}-scrollview-item-top-discount`}>
              <View className={`${cssPrefix}-scrollview-item-top-discount-price`}>
                {item.discount}
                <View className={`${cssPrefix}-scrollview-item-top-discount-symbol`}>¥</View>
              </View>
              <View className={`${cssPrefix}-scrollview-item-grey`}>
                {`满${item.threshold}可用`}
              </View>
            </View>
          </View>
          <View className={`${cssPrefix}-scrollview-item-bottom`}>
            <View className={`${cssPrefix}-scrollview-item-grey`}>
              {item.superposition ? '1.可叠加使用' : '1.每单仅限使用1张优惠券'}
            </View>
            {
              isOpen
                ? (
                  <Image
                    className={`${cssPrefix}-scrollview-item-expand`}
                    src="//net.huanmusic.com/scanbar-c/icon_shouqi.png"
                    onClick={(e) => onChangeCouponOpen(item, e)}
                  />
                )
                : (
                  <Image
                    className={`${cssPrefix}-scrollview-item-expand`}
                    src="//net.huanmusic.com/scanbar-c/icon_expand.png"
                    onClick={(e) => onChangeCouponOpen(item, e)}
                  />
                )
            }
            <View className={`${cssPrefix}-scrollview-item-button`} onClick={() => goToUse ? goToUse(item) : () => { }}>去使用</View>
          </View>
        </View>
        {
          isOpen && (
            <View className={`${cssPrefix}-scrollview-item-more`}>
              <View className={`${cssPrefix}-scrollview-item-grey`}>
                {item.filterType === 2 ? '2.指定商品可用' : item.filterType == 1 ? '2.指定品类可用' : '2.全品类可用'}
              </View>
              <View className={`${cssPrefix}-scrollview-item-grey ${cssPrefix}-scrollview-item-more-margin`}>3.不抵扣配送费</View>
            </View>
          )
        }
      </View>
    )
  }
}

export default UserCouponItem;