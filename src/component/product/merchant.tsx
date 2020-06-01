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
        className={classnames(`${cssPrefix}-border`)}
        onClick={() => this.onMerchantClick()}
      >
        <View
          className={`${cssPrefix}-content`}
          // onClick={this.onContentClick.bind(this)}
        >
          <View className={`${cssPrefix}-content-cover`}>
            {merchant.pictures && merchant.pictures !== "" ? (
              <View
                className={`${cssPrefix}-content-cover-image`}
                style={`background-image: url(${merchant.pictures[0]})`}
              />
            ) : (
              <Image
                src="//net.huanmusic.com/scanbar-c/v1/pic_nopicture.png"
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
      <View className={classnames(`${cssPrefix}-content-detail`)}>
        <View>
          <View className={`${cssPrefix}-title`}>{merchant.name || " "}</View>
          <View className={`${cssPrefix}-tips`}>
            {`起送￥${numeral(merchant.deliveryThreshold).format("0.00")}`}
            <View className={`${cssPrefix}-tips-discount`}>
              {merchant.distanceShow}
            </View>
          </View>
        </View>
        {merchant.activityInfo && (
          <View className={`${cssPrefix}-activity`}>
            {merchant.activityInfo.map(item => {
              const isDiscount = true;
              return (
                <View
                  className={classnames({
                    [`${cssPrefix}-discount`]: isDiscount,
                    [`${cssPrefix}-batchDiscount`]: !isDiscount
                  })}
                >
                  <Text
                    className={classnames({
                      [`${cssPrefix}-discount-text`]: isDiscount,
                      [`${cssPrefix}-batchDiscount-text`]: !isDiscount
                    })}
                  >
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        {merchant.coupons && (
          <View className={`${cssPrefix}-activity`}>
            {merchant.coupons.map(item => {
              const isDiscount = false;
              return (
                <View
                  className={classnames({
                    [`${cssPrefix}-discount`]: isDiscount,
                    [`${cssPrefix}-batchDiscount`]: !isDiscount
                  })}
                >
                  <Text
                    className={classnames({
                      [`${cssPrefix}-discount-text`]: isDiscount,
                      [`${cssPrefix}-batchDiscount-text`]: !isDiscount
                    })}
                  >
                    {item}
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
