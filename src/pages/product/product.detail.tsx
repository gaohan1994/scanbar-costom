import Taro, { Config } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
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
import { getMemberInfo } from '../../reducers/app.user';
import { getMerchantActivityList } from "../../reducers/app.merchant";

class Page extends Taro.Component<any> {
  config: Config = {
    navigationBarTitleText: "商品详情"
  };

  defaultProps = {
    productDetail: {}
  };
  state = {
    loading: true
  }

  onShareAppMessage = () => {
    const { productDetail } = this.props;

    return {
      title: productDetail.name,
      path: `/pages/product/product.detail?id=${productDetail.id}`,
      imageUrl: productDetail.shareImagePath
    };
  };

  onLoad(option) {

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
      this.setState({
        loading: false,
      })
    }
    
  }

  public init = async id => {
    await ProductAction.productInfoDetail(this.props.dispatch, { id });
    this.setState({
      loading: false,
    })
  };

  render() {
    const { productDetail, memberInfo, activityList } = this.props;
    const { id } = this.$router.params;
    const {loading} = this.state;
    if(!loading){
      return (
        <View className="container">
          <ProductSwiper
            images={
              productDetail.pictures && productDetail.pictures.length > 0 ? productDetail.pictures : productDetail.pic && [productDetail.pic]|| [
                "//net.huanmusic.com/scanbar-c/v1/pic_default.png"
              ]
            }
          />
          <ProductDetail memberInfo={memberInfo} activityList={activityList} product={productDetail} />
          {productDetail && productDetail.id && `${productDetail.id}` === id && (
            <ProductCart product={productDetail} />
          )}
        </View>
      );
    } 
    return (
      <View className="container">
        <Image style={{top: '40%', left: '38%'}}className='container-Loading' src={'//net.huanmusic.com/weapp/loading.gif'}/>
      </View>
    );
  }
}

const select = (state: AppReducer.AppState) => {
  return {
    productDetail: state.product.productDetail,
    memberInfo: getMemberInfo(state),
    activityList: state.merchant.activityList,
    productList: state.productSDK.productCartList
  };
};

export default connect(select)(Page);
