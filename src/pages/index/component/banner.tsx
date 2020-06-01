import Taro from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";

const prefix = "index-component";

type Props = {
  advertisement: any[];
};
type State = {};

class Banner extends Taro.Component<Props, State> {
  render() {
    const { advertisement } = this.props;
    const images = [
      "//net.huanmusic.com/scanbar-c/v2/banner_example.png",
      "//net.huanmusic.com/scanbar-c/v2/banner_example.png",
      "//net.huanmusic.com/scanbar-c/v2/banner_example.png",
      "//net.huanmusic.com/scanbar-c/v2/banner_example.png",
      "//net.huanmusic.com/scanbar-c/v2/banner_example.png"
    ].map(item => {
      return {
        pic: item
      };
    });
    return (
      <View className={`${prefix}-banner`}>
        <View className={`${prefix}-banner-bg`} />
        <Swiper
          className={`${prefix}-banner-swiper`}
          indicatorColor="#E3E3E3"
          indicatorActiveColor="#2C86FE"
          circular
          indicatorDots
          autoplay
        >
          {images &&
            images.map((item, index) => {
              return (
                <SwiperItem key={`image${index}`}>
                  <View
                    className={`${prefix}-banner-swiper-item`}
                    style={`background-image: url(${item.pic})`}
                  />
                </SwiperItem>
              );
            })}
        </Swiper>
      </View>
    );
  }
}

export default Banner;
