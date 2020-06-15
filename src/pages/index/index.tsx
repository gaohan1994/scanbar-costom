import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtActivityIndicator } from "taro-ui";
import "./index.less";
import "../style/product.less";
import MerchantListView from "../../component/product/merchant.listview";
import IndexAddress from "./component/address";
import Banner from "./component/banner";
import { ProductAction, MerchantAction, UserAction } from "../../actions";
import {
  ResponseCode,
  ProductInterface,
  MerchantInterface
} from "../../constants";
import WeixinSdk from "../../common/sdk/weixin/weixin";
import {
  getMerchantAdvertisement,
  getCurrentMerchantDetail
} from "../../reducers/app.merchant";
import { LoginManager } from "../../common/sdk";
import { getUserinfo, getMemberInfo } from "../../reducers/app.user";
import Tabs from "./component/tab";
import { AppReducer } from "src/reducers";
import { BASE_PARAM } from "../../common/util/config";

const cssPrefix = "product";

let page: number = 1;

type Props = {
  advertisement: any;
  currentMerchantDetail: any;
  userinfo: any;
  dispatch: any;
  memberInfo: any;
  merchantList: MerchantInterface.AlianceMerchant[];
  merchantTotal: any;
  getNearbyMerchant: (params: any) => void;
  getOrderedMerchant: (params: any) => void;
};
class Index extends Component<Props, any> {
  readonly state = {
    currentType: {
      name: "",
      id: 0,
      createTime: "",
      subCategory: []
    },
    loading: false,
    isOpen: false,
    showActivity: true,
    couponModalShow: false,
    obtainCouponList: []
  };

  common = {
    refreshFlag: false,
    timeoutFlag: false,
    changeTypeFlag: false
  };

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "首页"
  };

  async componentDidMount() {
    try {
      this.init(true);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
    this.setState({ couponModalShow: true });
  }

  async componentDidShow() {
    // const { userinfo } = this.props;
    // if (userinfo.phone && userinfo.phone.length > 0) {
    //   UserAction.getMemberInfo();
    //   const res = await UserAction.obtainCoupon();
    //   if (res.code == ResponseCode.success) {
    //     this.setState({ obtainCouponList: res.data.rows })
    //   }
    // }
    this.init();
  }

  public changeCurrentType = (typeInfo: any, fetchProduct: boolean = true) => {
    this.setState({ currentType: typeInfo }, async () => {
      if (fetchProduct) {
        this.fetchData(typeInfo);
      }
    });
  };

  public initAddress = async () => {
    /**
     * @todo 判断当前
     */
  };

  public init = async (type = "recommand"): Promise<void> => {
    try {
      this.setState({ loading: true });
      await LoginManager.getUserInfo(this.props.dispatch);
      const address: any = await WeixinSdk.initAddress(this.props.dispatch);
      page = 1;
      // invariant(!!address.longitude, "请先定位");
      const fetchFunction =
        type === "recommand"
          ? this.props.getNearbyMerchant
          : this.props.getOrderedMerchant;
      fetchFunction({
        pageNum: page,
        pageSize: 20,
        longitude: address.longitude || 119,
        latitude: address.latitude || 26,
        institutionCode: BASE_PARAM.institutionCode
      });

      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  };

  /**
   * @todo 切换附近推荐/常去的店
   *
   * @memberof Index
   */
  public onTabChange = tab => {
    this.init(tab.id === 0 ? "recommand" : "nearby");
  };

  /**
   * @todo [点击菜单的时候修改当前菜单并跳转至对应商品]
   *
   * @memberof ProductOrder
   */
  public onTypeClick = (params: ProductInterface.ProductTypeInfo) => {
    this.common.changeTypeFlag = true;
    this.changeCurrentType(params);
  };

  public onScrollToLower = async () => {
    const { currentType } = this.state;
    const { productType } = this.props;
    for (let i = 0; i < productType.length; i++) {
      if (
        currentType.id === productType[i].id &&
        i !== productType.length - 1
      ) {
        this.onTypeClick(productType[i + 1]);
        break;
      }
    }
  };

  public onScroll = (event: any) => {
    const { detail } = event;
    const { scrollTop } = detail;
    const { refreshFlag } = this.common;
    if (refreshFlag) {
      if (!this.common.timeoutFlag) {
        this.common.timeoutFlag = true;
        setTimeout(() => {
          this.common.timeoutFlag = false;
          this.common.refreshFlag = false;
        }, 200);
      }
      return;
    }
    if (Number(scrollTop) >= 50) {
      if (this.state.showActivity === true) {
        this.setState({ showActivity: false });
      }
    } else {
      if (Number(scrollTop) <= 10) {
        this.setState({ showActivity: true });
      }
    }
  };

  render() {
    const { currentType, loading, showActivity, obtainCouponList } = this.state;
    const { advertisement, merchantList } = this.props;

    return (
      <View className={`container ${cssPrefix}`}>
        <IndexAddress />
        {showActivity && (
          <View className={`${cssPrefix}-activity`}>
            <Banner advertisement={advertisement} />
          </View>
        )}
        <Tabs onChange={tab => this.onTabChange(tab)}>
          {!!loading ? (
            <View className="container">
              <AtActivityIndicator mode="center" />
            </View>
          ) : (
            <View className={`${cssPrefix}-list-container-costom`}>
              <View className={`${cssPrefix}-list-right`}>
                <MerchantListView data={merchantList} />
              </View>
            </View>
          )}
        </Tabs>
      </View>
    );
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

const select = (state: AppReducer.AppState) => {
  return {
    advertisement: getMerchantAdvertisement(state),
    currentMerchantDetail: getCurrentMerchantDetail(state),
    userinfo: getUserinfo(state),
    memberInfo: getMemberInfo(state),
    merchantList: state.merchant.alianceList,
    merchantTotal: state.merchant.alianceTotal
  };
};

const mapDispatch = dispatch => {
  return {
    getNearbyMerchant: MerchantAction.getNearbyMerchant(dispatch),
    getOrderedMerchant: MerchantAction.getOrderedMerchant(dispatch)
  };
};

export default connect(select, mapDispatch)(Index as any);
