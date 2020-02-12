import Taro from '@tarojs/taro'
import { View, Swiper, SwiperItem  } from '@tarojs/components'
import './index.less'

const prefix = 'product-detail-component'
type Props = {
  images: string[];
}

class Page extends Taro.Component<Props> {

  defaultProps = {
    images: []
  }

  render () {
    const { images } = this.props;
    return (
      <Swiper
        className={`${prefix}-swiper`}
        indicatorColor='#E3E3E3'
        indicatorActiveColor='#2C86FE'
        circular
        indicatorDots
        autoplay
      >
        {
          images && images.map((item, index) => {
            return (
              <SwiperItem key={`image${index}`}>
                <View 
                  className={`${prefix}-swiper-item`}
                  style={`background-image: url(${item})`}
                />
              </SwiperItem>
            )
          })
        }
      </Swiper>
    )
  }
}

export default Page;