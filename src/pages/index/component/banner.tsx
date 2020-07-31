import Taro from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { MerchantInterface } from "../../../constants";
import { connect } from "@tarojs/redux";
import merchantAction from "../../../actions/merchant.action";

const prefix = "index-component";

type Props = {
  advertisement: any[];
  setCurrentMerchantDetail: (
    merchant: MerchantInterface.AlianceMerchant
  ) => void;
};
type State = {};

class Banner extends Taro.Component<Props, State> {

  public onClick = (item: any) => {
    console.log('test rrr', item);
    this.props.setCurrentMerchantDetail({ id: item.merchantId } as any);
    Taro.navigateTo({
      url: `/pages/index/home`
    });
  }

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
          {advertisement && advertisement.map((item, index) => {
            return (
              <SwiperItem key={`image${index}`} onClick={() => this.onClick(item)}>
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

const mapDispatch = dispatch => {
  return {
    setCurrentMerchantDetail: merchantAction.setCurrentMerchantDetail(dispatch)
  };
};

export default connect(() => ({}), mapDispatch)(Banner as any);
