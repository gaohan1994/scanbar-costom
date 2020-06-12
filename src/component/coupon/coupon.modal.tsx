import Taro from '@tarojs/taro';
import { View, Image, ScrollView, Text, Button } from '@tarojs/components';
import './index.less';
import classnames from 'classnames';
import { UserInterface } from '../../constants';
import dayJs from 'dayjs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // couponList: UserInterface.CouponsItem[];
  couponList: any[];
  isNew?: boolean;
  hasGet?: boolean;
  onItemClick: (param: any) => any
}
interface State {

}

const cssPrefix = 'coupon-modal';

class CouponModal extends Taro.Component<Props, State> {
  state = {
    itemObj:{}
  }
  componentWillMount = () => {
    const { couponList } = this.props;
    const itemObj = {};
    couponList.forEach(element => {
      itemObj[element.couponId] = false;
    });
    this.setState({
      itemObj
    })
  }
  onClick = (e: any) => {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  }
  
  render() {
    const { isOpen, onClose, onItemClick, isNew, couponList, hasGet } = this.props;
    const {itemObj} = this.state;
    const renderItem = (item: UserInterface.CouponsItem, isNew?: any) => {
      const { couponVO } = item;
      return (
        <View className={`${cssPrefix}-item`}>
          <View
            className={classnames(`${cssPrefix}-item-top`, {
              [`${cssPrefix}-item-top-grey`]: false,
              [`${cssPrefix}-item-topNew`]: isNew
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
              [`${cssPrefix}-item-get`]: (itemObj && itemObj[item.couponId] === true)||`${couponVO.obtainWay}` === '2' || `${couponVO.obtainWay}` === '1' ? false : true,
            })}
              onClick={async () => {
                const res = await onItemClick([{couponId: item.couponId}]);
                if (res) {
                  const itemObjNew = itemObj;
                  itemObjNew[item.couponId] = true;
                  this.setState({
                    itemObj: itemObjNew
                  })
                } else {
                  onClose();
                }
              }}
            >
              {(itemObj && itemObj[item.couponId] === true)|| `${couponVO.obtainWay}` === '2' || `${couponVO.obtainWay}` === '1' ? '去使用' : '领取' }
            </View>
          </View>
        </View>
      )
    }
    const newList = couponList && couponList.filter(val => `${val.couponVO.obtainWay}` === '1') || [];
    const noList = couponList && couponList.filter(val => `${val.couponVO.obtainWay}` === '0') || [];
    const okList = couponList && couponList.filter(val => `${val.couponVO.obtainWay}` === '2') || [];
    if (isOpen === true) {
      return (
        <View className={`${cssPrefix}`}>
          <View
            className={`${cssPrefix}-container`}
            style={{ 
              backgroundImage: isNew ? 
                'url(//net.huanmusic.com/scanbar-c/v2/popup_coupon_newcomer.png)' 
                : 'url(//net.huanmusic.com/scanbar-c/v2/popup_coupon_n.png)'
            }}
          >
            <ScrollView className={isNew ? `${cssPrefix}-container-listNew` : `${cssPrefix}-container-list`} scrollY={true}>
              {
                newList && newList.length > 0 && newList.map((item) => {
                  return renderItem(item, isNew);
                })
              }
              {
                noList && noList.length > 0 && noList.map((item) => {
                  return renderItem(item, isNew);
                })
              }
              {
                okList && okList.length > 0 && okList.map((item) => {
                  return renderItem(item, isNew);
                })
              }
            </ScrollView>
            <View className={`${cssPrefix}-footer`}>
              <Button
                className={`${cssPrefix}-button`}
                onClick={() => {
                  onItemClick(couponList);
                  onClose();
                }}
              >
                {hasGet ? '一键领取' : '去购物'}
              </Button>
            </View>

          </View>
          <View className={`${cssPrefix}-close`} onClick={() => {onClose();}}>
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

}

export default CouponModal;