import Taro from '@tarojs/taro'
import { View, Image, Text  } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import { AppReducer } from '../../../reducers';
import './index.less';

const prefix = 'index-component'

type Props = {

}
type State = {

}

class DiscountInfo extends Taro.Component<Props, State> {

  render() {
    return (
      <View className={`${prefix}-discount`}>
        <View className={`${prefix}-discount-item`}>
          {/* <Image 
            className={`${prefix}-discount-item-integral`}
            src="//net.huanmusic.com/scanbar-c/v2/icon_home_integral.png"
          /> */}
          <Text className={`${prefix}-discount-item-data`}>3000</Text>
          <Text>积分</Text>
        </View>

        <View className={`${prefix}-discount-item`} onClick={() => { Taro.navigateTo({url: '/pages/user/user.coupon'}) }}>
          {/* <Image 
            className={`${prefix}-discount-item-integral`}
            src="//net.huanmusic.com/scanbar-c/v2/icon_home_coupon.png"
          /> */}
          <Text className={`${prefix}-discount-item-data`}>5</Text>
          <Text>优惠券</Text>
          <View className={`${prefix}-discount-pop`}>4张可领</View>
        </View>
      </View>
    )
  }
}

// const select = (state: AppReducer.AppState) => {
//   return {
    
//   }
// }

// export default connect(select)(DiscountInfo as any);

export default DiscountInfo;