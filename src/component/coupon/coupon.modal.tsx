import Taro from '@tarojs/taro';
import { View, Image, ScrollView, Text, Button } from '@tarojs/components';
import './index.less';
import classnames from 'classnames';
import { UserInterface } from '../../constants';
import dayJs from 'dayjs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  couponList: UserInterface.CouponsItem[];
  isNew?: boolean;
}
interface State {

}

const cssPrefix = 'coupon-modal';

class CouponModal extends Taro.Component<Props, State> {
  onClick = (e: any) => {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  }

  render() {
    const { isOpen, onClose, isNew, couponList } = this.props;
    if (isOpen === true) {
      return (
        <View className={`${cssPrefix}`} onClick={onClose}>
          <View
            className={`${cssPrefix}-container`}
            onClick={this.onClick}
            style={{ 
              backgroundImage: isNew ? 
                'url(//net.huanmusic.com/scanbar-c/v2/popup_coupon_newcomer.png)' 
                : 'url(//net.huanmusic.com/scanbar-c/v2/popup_coupon_n.png)'
            }}
          >
            <ScrollView className={`${cssPrefix}-container-list`} scrollY={true}>
              {
                couponList && couponList.length > 0 && couponList.map((item) => {
                  return this.renderItem(item);
                })
              }
            </ScrollView>
            <View className={`${cssPrefix}-footer`}>
              <Button
                className={`${cssPrefix}-button`}
                onClick={onClose}
              >
                去购物
              </Button>
            </View>

          </View>
          <View className={`${cssPrefix}-close`} onClick={onClose}>
            <Image
              className={`${cssPrefix}-close-img`}
              src='//net.huanmusic.com/scanbar-c/v2/icon_home_close.png'
            />
          </View>
        </View>
      )
    }

    return null;


  }

  private renderItem = (item: UserInterface.CouponsItem) => {
    const { onClose } = this.props;
    const { couponVO } = item;
    console.log("renderItem-coupon : ", item);
    return (
      <View className={`${cssPrefix}-item`}>
        <View
          className={classnames(`${cssPrefix}-item-top`, {
            [`${cssPrefix}-item-top-grey`]: false
          })}>
          <View className={`${cssPrefix}-item-top-left`}>
            <Text className={`${cssPrefix}-item-top-left-price`}>
              {couponVO.discount}
              <Text className={`${cssPrefix}-item-top-left-sign`}>¥</Text>
            </Text>
            <Text className={`${cssPrefix}-item-top-left-info`}>满{couponVO.threshold}可用</Text>
          </View>
          <View className={`${cssPrefix}-item-top-right`}>
            <Text className={classnames(`${cssPrefix}-item-top-right-info`, {
              [`${cssPrefix}-item-text-grey`]: false,
            })}>全品类可用</Text>
            <View className={`${cssPrefix}-item-top-right-row`}>
              <Text className={classnames(`${cssPrefix}-item-top-right-time`, {
                [`${cssPrefix}-item-text-grey`]: false,
              })}>
                {dayJs(item.effectiveTime).format('MM/DD')}~{dayJs(item.invalidTime).format('MM/DD')}
              </Text>
            </View>
          </View>
          <View className={classnames(`${cssPrefix}-item-top-button`, {
            [`${cssPrefix}-item-text-grey`]: false,
            [`${cssPrefix}-item-border-grey`]: false,
          })}
            onClick={onClose}
          >
            去使用
          </View>
        </View>
      </View>
    )
  }
}

export default CouponModal;