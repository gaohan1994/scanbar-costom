import Taro, { Component, Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtActivityIndicator } from "taro-ui";
import "./index.less";
import "../style/product.less";
import MerchantListView from "../../component/product/merchant.listview";
import IndexAddress from "./component/address";
import Banner from "./component/banner";
import { MerchantAction } from "../../actions";
import {
  MerchantInterface, UserInterface
} from "../../constants";
import WeixinSdk from "../../common/sdk/weixin/weixin";
import {
  getMerchantAdvertisement,
  getCurrentMerchantDetail
} from "../../reducers/app.merchant";
import { LoginManager } from "../../common/sdk";
import { getUserinfo, getMemberInfo, getIndexAddress } from "../../reducers/app.user";
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
  address: UserInterface.Address;
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
      this.init();
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

  public initAddress = async () => {
    /**
     * @todo 判断当前
     */
  };

  public init = async (type?: string): Promise<void> => {
    try {
      this.setState({ loading: true });
      await LoginManager.getUserInfo(this.props.dispatch);
      const address: any = await WeixinSdk.initAddress(this.props.dispatch);
      page = 1;
      // invariant(!!address.longitude, "请先定位");
      await this.fetchData(type || 'nearby', address);
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  };

  public fetchData = async (type: string, address: any): Promise<void> => {
    const fetchFunction =
      type === "recommand"
        ? this.props.getOrderedMerchant
        : this.props.getNearbyMerchant;
    await fetchFunction({
      pageNum: page,
      pageSize: 20,
      longitude: address.longitude || 119,
      latitude: address.latitude || 26,
      institutionCode: BASE_PARAM.institutionCode
    });
  }

  /**
   * @todo 切换附近推荐/常去的店
   *
   * @memberof Index
   */
  public onTabChange = tab => {
    this.init(tab.id === 0 ? "nearby" : "recommand");
  };

  onScrollToLower = () => {
    const { merchantList, merchantTotal, address } = this.props;
    const hasMore = merchantList.length < merchantTotal;
    if (hasMore) {
      this.fetchData("nearby", address);
    }
  }

  render() {
    const { loading, showActivity } = this.state;
    const { advertisement, merchantList, merchantTotal } = this.props;
    const hasMore = merchantList.length < merchantTotal;
    return (
      <View className={`container ${cssPrefix}`}>
        <IndexAddress />
        {showActivity && (
          <View className={`${cssPrefix}-activity`}>
            <Banner advertisement={advertisement} />
          </View>
        )}
        <Tabs onChange={tab => this.onTabChange(tab)}>
          {/* {!!loading ? (
            <View className="loading">
              <AtActivityIndicator mode="center" />
            </View>
          ) : (
              <View className={`${cssPrefix}-list-container-costom`}>
                <View className={`${cssPrefix}-list-right`}>
                  <MerchantListView
                    loading={loading}
                    data={merchantList}
                    // className={`${cssPrefix}-list-right-container`}
                  />
                </View>
              </View>
            )} */}
        </Tabs>
        {!!loading ? (
          <View className="loading">
            <AtActivityIndicator mode="center" />
          </View>
        ) : (
            <View className={`${cssPrefix}-list-container-costom`}>
              <View className={`${cssPrefix}-list-right`}>
                <MerchantListView data={merchantList} onScrollToLower={this.onScrollToLower} hasMore={hasMore}/>
              </View>
            </View>
          )}
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
    merchantTotal: state.merchant.alianceTotal,
    address: getIndexAddress(state)
  };
};

const mapDispatch = dispatch => {
  return {
    getNearbyMerchant: MerchantAction.getNearbyMerchant(dispatch),
    getOrderedMerchant: MerchantAction.getOrderedMerchant(dispatch),
  };
};

export default connect(select, mapDispatch)(Index as any);
