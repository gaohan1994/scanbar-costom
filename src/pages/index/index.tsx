import Taro, { Component, Config } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtActivityIndicator } from "taro-ui";
import "./index.less";
import "../style/product.less";
import IndexAddress from "./component/address";
import Banner from "./component/banner";
import { MerchantAction } from "../../actions";
import {
  MerchantInterface, UserInterface, ResponseCode
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
import classnames from "classnames";
import Empty from "../../component/empty";
import MerchantComponent from "../../component/product/merchant";

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
  getNearbyMerchant: (params: any) => any;
  getOrderedMerchant: (params: any) => any;
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
    obtainCouponList: [],
    type: 'nearby'
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
      await this.initAddress();
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
    this.init(this.state.type, false);
  }

  public initAddress = async () => {
    /**
     * @todo 判断当前
     */
    await LoginManager.getUserInfo(this.props.dispatch);
    await WeixinSdk.initAddress(this.props.dispatch);
  };

  public init = async (type?: string, showLoading?: boolean): Promise<void> => {
    const { address } = this.props;
    try {
      if (showLoading !== false) {
        this.setState({ loading: true });
      }
      MerchantAction.advertisement(this.props.dispatch);
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
    if (page !== 1) {
      Taro.showLoading();
    }
    const res = await fetchFunction({
      pageNum: page,
      pageSize: 10,
      longitude: address.longitude || 119,
      latitude: address.latitude || 26,
      institutionCode: BASE_PARAM.institutionCode
    });
    Taro.hideLoading();
    if (res.code === ResponseCode.success) {
      page++;
    }
  }

  /**
   * @todo 切换附近推荐/常去的店
   *
   * @memberof Index
   */
  public onTabChange = tab => {
    page = 1;
    if (tab.id === 0) {
      this.setState({ type: 'nearby' });
    } else {
      this.setState({ type: 'recommand' });
    }
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
    const { advertisement } = this.props;
    return (
      <View className={`container ${cssPrefix}`}>
        <IndexAddress initDit={this.initAddress}/>
        {showActivity && advertisement.length > 0 && (
          <View className={`${cssPrefix}-activity`}>
            <Banner advertisement={advertisement} />
          </View>
        )}
        <Tabs onChange={tab => this.onTabChange(tab)}>
        </Tabs>
        {!!loading ? (
          <View className="loading">
            <AtActivityIndicator mode="center" />
          </View>
        ) : (
            <View className={`${cssPrefix}-list-container-costom`}>
              <View className={`${cssPrefix}-list-right`}>
                {
                  this.renderMerchantList()
                }
              </View>
            </View>
          )}
      </View>
    );
  }

  renderMerchantList() {
    const { merchantList, merchantTotal } = this.props;
    const hasMore = merchantList.length < merchantTotal;
    return (
      <ScrollView
        scrollY={true}
        className={classnames(
          `${cssPrefix}-list-right ${cssPrefix}-list-margin ${
          process.env.TARO_ENV === "h5" ? `${cssPrefix}&-h5-height` : ""
          }`,
        )}
        onScrollToLower={this.onScrollToLower}
      >
        {
          Array.isArray(merchantList) === true && merchantList.length > 0 ? (
            (merchantList || []).map((merchant) => {
              return (
                <View id={`data${merchant.id}`} key={merchant.id}>
                  <MerchantComponent merchant={merchant} border={true} />
                </View>
              );
            })
          ) : (
              <Empty
                img="//net.huanmusic.com/scanbar-c/v1/img_commodity.png"
                css={"index"}
                text={"没有相关门店"}
              />
            )
        }
        {hasMore !== true && merchantList && merchantList.length > 0 && (
          <View className={`${cssPrefix}-list-bottom`}>已经到底啦</View>
        )}
        <View style="height: 100rpx" />
      </ScrollView>
    )
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
