import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.less";
import "../../../component/product/product.less";
import { MerchantInterface, UserInterface } from "../../../constants";
import { connect } from "@tarojs/redux";
import { AppReducer } from "../../../reducers";
import { getCurrentMerchantDetail } from "../../../reducers/app.merchant";
import { getIndexAddress } from "../../../reducers/app.user";

const prefix = "index-component-address";

type Props = {
  indexAddress: UserInterface.Address;
  currentMerchantDetail: MerchantInterface.MerchantDetail;
};

type State = {};

class Comp extends Taro.Component<Props, State> {
  public onNavAddress = () => {
    Taro.navigateTo({
      url: `/pages/address/address.change.index`
    });
  };

  render() {
    const { indexAddress, currentMerchantDetail } = this.props;

    const address =
      indexAddress && indexAddress.address
        ? indexAddress.address.indexOf("市") !== -1
          ? indexAddress.address.split("市")[1]
          : indexAddress.address
        : "";

    return (
      <View className={`${prefix}`}>
        <View className={`${prefix}-title`} onClick={() => this.onNavAddress()}>
          <Image
            className={`${prefix}-title-icon`}
            src="//net.huanmusic.com/scanbar-c/icon_location.png"
          />
          <View className={`${prefix}-title-text`}>
            {address || "晋安区金鸡山小区"}
          </View>
          <View className={`${prefix}-icon`} />
        </View>
        <View
          className={`${prefix}-search`}
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/product/product.search`
            });
          }}
        >
          <Image
            className={`${prefix}-search-icon`}
            src="//net.huanmusic.com/scanbar-c/icon_search.png"
          />
          <View className={`${prefix}-search-text`}>请输入店铺名称</View>
        </View>
      </View>
    );
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    indexAddress: getIndexAddress(state),
    currentMerchantDetail: getCurrentMerchantDetail(state)
  };
};

export default connect(select)(Comp as any);
