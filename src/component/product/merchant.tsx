import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./product.less";
import { connect } from "@tarojs/redux";
import classnames from "classnames";
import numeral from "numeral";
import { MerchantInterface } from "src/constants";
import merchantAction from "../../actions/merchant.action";

const cssPrefix = "component-product";

interface Props {
  merchant: MerchantInterface.AlianceMerchant;
  onClick?: any;
  setCurrentMerchantDetail: (
    merchant: MerchantInterface.AlianceMerchant
  ) => void;
}

interface State {
  priceModal: boolean;
  changePrice: string;
  changeSellNum: string;
}

class MerchantComponent extends Taro.Component<Props, State> {
  static options = {
    addGlobalClass: true
  };

  onMerchantClick = () => {
    const { onClick, merchant } = this.props;
    if (!!onClick) {
      onClick(merchant);
      return;
    }
    this.props.setCurrentMerchantDetail(merchant);
    Taro.navigateTo({
      url: `/pages/index/home`
    });
  };

  render() {
    const { merchant } = this.props;
    return (
      <View
        className={classnames(`${cssPrefix}-padding`)}
        style="background: #fff"
        onClick={() => this.onMerchantClick()}
      >
        <View
          className={`${cssPrefix}-content`}
        // onClick={this.onContentClick.bind(this)}
        >
          <View className={`${cssPrefix}-content-cover`}>
            {!!merchant.isNew && (
              <View className={`${cssPrefix}-content-cover-new`} />
            )}
            {!merchant.status && (
              <View className={`${cssPrefix}-content-cover-close`} />
            )}

            {merchant.logo && merchant.logo !== "" ? (
              <View
                className={`${cssPrefix}-content-cover-image`}
                style={`background-image: url(${merchant.logo})`}
              />
            ) : (
                <Image
                  src="//net.huanmusic.com/scanbar-c/icon_shop_default.png"
                  className={`${cssPrefix}-content-cover-image`}
                />
              )}
          </View>
          {this.renderDetail()}
        </View>
      </View>
    );
  }

  private renderDetail = () => {
    const { merchant } = this.props;
    return (
      <View className={classnames(`${cssPrefix}-content-detail ${cssPrefix}-border`)}>
        <View>
          <View className={`${cssPrefix}-title`}>{merchant.name || " "}</View>
          <View className={`${cssPrefix}-tips`}>
            {`起送￥${numeral(merchant && merchant.deliveryThreshold ? merchant.deliveryThreshold : 0).format("0.00")}`}
            <View className={`${cssPrefix}-tips-discount`}>
              {merchant.distanceShow}
            </View>
          </View>
        </View>
        {merchant && merchant.activityInfo && (
          <View className={`${cssPrefix}-activity`}>
            {merchant.activityInfo.map(item => {
              return (
                <View className={`${cssPrefix}-merchant-activity`} >
                  <Text className={`${cssPrefix}-merchant-activity-text`} >
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        {merchant && merchant.coupons && (
          <View className={`${cssPrefix}-activity`}>
            {merchant.coupons.map(item => {
              return (
                <View className={`${cssPrefix}-merchant-coupon`} >
                  <Text className={`${cssPrefix}-merchant-coupon-text`} >
                    {`${item}元优惠券`}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };
}

const mapDispatch = dispatch => {
  return {
    setCurrentMerchantDetail: merchantAction.setCurrentMerchantDetail(dispatch)
  };
};

export default connect(() => ({}), mapDispatch)(MerchantComponent as any);
