import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import './index.less';
import { getMemberInfo } from '../../../reducers/app.user';
import { UserInterface } from '../../../constants';

const prefix = 'index-component'

type Props = {
  memberInfo: UserInterface.MemberInfo;
}
type State = {

}

class DiscountInfo extends Taro.Component<Props, State> {

  render() {
    const { memberInfo } = this.props;
    return (
      <View className={`${prefix}-discount`}>
        <View className={`${prefix}-discount-item`}>
          {/* <Image 
            className={`${prefix}-discount-item-integral`}
            src="//net.huanmusic.com/scanbar-c/v2/icon_home_integral.png"
          /> */}
          <Text className={`${prefix}-discount-item-data`}>{memberInfo.points || 0}</Text>
          <Text className={process.env.TARO_ENV === 'h5' ? `${prefix}-discount-item-h5` : ''}>积分</Text>
        </View>

        <View className={`${prefix}-discount-item`} onClick={() => { Taro.navigateTo({ url: '/pages/user/user.coupon' }) }}>
          {/* <Image 
            className={`${prefix}-discount-item-integral`}
            src="//net.huanmusic.com/scanbar-c/v2/icon_home_coupon.png"
          /> */}
          <Text className={`${prefix}-discount-item-data`}>{memberInfo.couponNum || 0}</Text>
          <Text className={process.env.TARO_ENV === 'h5' ? `${prefix}-discount-item-h5` : ''}>优惠券</Text>
          {/* <View className={`${prefix}-discount-pop`}>4张可领</View> */}
        </View>
      </View>
    )
  }
}

const select = (state) => {
  return {
    memberInfo: getMemberInfo(state)
  }
}

export default connect(select)(DiscountInfo as any);