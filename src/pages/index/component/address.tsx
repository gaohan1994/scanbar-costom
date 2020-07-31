import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.less";
import "../../../component/product/product.less";
import { UserInterface } from "../../../constants";
import { connect } from "@tarojs/redux";
import { AppReducer } from "../../../reducers";
import { getIndexAddress } from "../../../reducers/app.user";

const prefix = "index-component-address";

type Props = {
  indexAddress: UserInterface.Address;
  initDit: () => void;
};

type State = {};

class Comp extends Taro.Component<Props, State> {
  public onNavAddress = () => {
    Taro.navigateTo({
      url: `/pages/address/address.change.index`
    });
  };

  render() {
    const { indexAddress, initDit } = this.props;

    const address =
      indexAddress && indexAddress.address
        ? indexAddress.address.indexOf("市") !== -1
          ? indexAddress.address.split("市")[1]
          : indexAddress.address
        : "";

    return (
      <View className={`${prefix}`}>
        <View 
          className={`${prefix}-title  ${process.env.TARO_ENV === 'h5' ? `${prefix}-title-h5` : ''}`}
          onClick={address ? () => this.onNavAddress() : () => {initDit();}}
        >
          <Image className={`${prefix}-title-icon`} src='//net.huanmusic.com/scanbar-c/icon_location.png' />
          <View className={`${prefix}-title-text${process.env.TARO_ENV === 'h5' ? '-h5' : ''}`}>
            {address ? address : '点击重新获取定位'}
          </View>
          <View className={`${prefix}-icon`} />
        </View>
        <View
          className={`${prefix}-search`}
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/product/merchant.search`
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
  };
};

export default connect(select)(Comp as any);
