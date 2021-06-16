import Taro from '@tarojs/taro'
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import { AppReducer } from '../../../reducers';
import './index.less';

const prefix = 'index-component'

type Props = {
  advertisement: any[]
}
type State = {

}

class Banner extends Taro.Component<Props, State> {

  render() {
    const { advertisement } = this.props;
    const images = [
      '//net.huanmusic.com/scanbar-c/v2/banner_example.png',
      '//net.huanmusic.com/scanbar-c/v2/banner_example.png',
      '//net.huanmusic.com/scanbar-c/v2/banner_example.png',
      '//net.huanmusic.com/scanbar-c/v2/banner_example.png',
      '//net.huanmusic.com/scanbar-c/v2/banner_example.png',
    ]
    return (
      <View className={`${prefix}-banner`}>
        <View className={`${prefix}-banner-bg`} />
        <Swiper
          className={`${prefix}-banner-swiper`}
          indicatorColor='#E3E3E3'
          indicatorActiveColor='#2C86FE'
          circular
          indicatorDots
          autoplay
        >
          {
            advertisement && advertisement.map((item, index) => {
              return (
                <SwiperItem key={`image${index}`}>
                  <View
                    className={`${prefix}-banner-swiper-item`}
                    style={`background-image: url(${item.pic})`}
                    // onClick={() => {
                    //   if(item.adType === 0 ){
                    //     Taro.navigateTo({url: '/pages/product/product.detail?id=' + item.param})
                    //   }
                    // }}
                  />
                </SwiperItem>
              )
            })
          }
        </Swiper>
      </View>
    )
  }
}

// const select = (state: AppReducer.AppState) => {
//   return {

//   }
// }

// export default connect(select)(DiscountInfo as any);

export default Banner;