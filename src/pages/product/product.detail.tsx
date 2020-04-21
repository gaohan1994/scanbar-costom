import Taro, { Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.less";
import "../style/product.less";

import invariant from "invariant";
import { ProductAction } from "../../actions";

import ProductSwiper from "./component/swiper";
import ProductDetail from "./component/detail";
import ProductCart from "./component/cart";
import { AppReducer } from "../../reducers";
import { jsonToQueryString } from "../../constants";

class Page extends Taro.Component<any> {
  config: Config = {
    navigationBarTitleText: "商品详情"
  };

  defaultProps = {
    productDetail: {}
  };

  onShareAppMessage = () => {
    const { productDetail } = this.props;

    return {
      title: productDetail.name,
      path: `/pages/product/product.detail?id=${productDetail.id}`,
      imageUrl: productDetail.shareImagePath
    };
  };

  onLoad(option) {
    console.log(option.query);
    if (option.query) {
      Taro.showToast({
        title: `${jsonToQueryString(option.query)}`
      });
      this.init(option.query.id);
    }
  }

  componentWillMount() {
    try {
      const { id } = this.$router.params;
      invariant(!!id, "请传入商品id");

      this.init(id);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  }

  public init = async id => {
    ProductAction.productInfoDetail({ id });
  };

  render() {
    const { productDetail } = this.props;
    const { id } = this.$router.params;
    return (
      <View className="container">
        <ProductSwiper
          images={
            productDetail.pictures || [
              "//net.huanmusic.com/scanbar-c/v1/pic_default.png"
            ]
          }
        />
        <ProductDetail product={productDetail} />
        {productDetail && productDetail.id && `${productDetail.id}` === id && (
          <ProductCart product={productDetail} />
        )}
      </View>
    );
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    productDetail: state.product.productDetail,
    productList: state.productSDK.productCartList
  };
};

export default connect(select)(Page);
