import Taro, { Config } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import './index.less';
import "../../component/card/form.card.less";
import TabsSwitch from '../../component/tabs/tabs.switch';
import { connect } from '@tarojs/redux';
import { getCouponList, getUserinfo } from '../../reducers/app.user';
import { UserAction } from '../../actions';
import { UserInterface, MerchantInterface, UserInterfaceMap } from '../../constants';
import Empty from '../../component/empty';
import CouponItem from '../../component/coupon/coupon.item';
import { getCurrentMerchantDetail } from '../../reducers/app.merchant';
import numeral from 'numeral';
import { Dispatch } from 'redux';
import classNames from 'classnames';

interface Props {
  dispatch: Dispatch;
  couponList: UserInterface.CouponsItem[];
  userinfo: UserInterface.UserInfo;
  currentMerchantDetail: MerchantInterface.MerchantDetail;
}
interface State {
  currentType: number;
  openList: any[];
  pageSize: number;
  pageNum: number;
  total: number;
}

const cssPrefix = 'user-coupon';
class Page extends Taro.Component<Props, State> {

  config: Config = {
    navigationBarTitleText: '优惠券'
  }

  state = {
    currentType: 0,
    openList: [] as any,
    pageSize: 10,
    pageNum: 1,
    total: 0,
  };

  async componentDidMount() {
    const params = {
      status: 0,
      pageSize: 10,
      pageNum: 1,
    }
    Taro.showLoading();
    const result = await UserAction.getMemberCoupons(this.props.dispatch, params);
    this.setState({
      total: result.data.total
    });
    Taro.hideLoading();
  }

  public onChangeTab = async (tabNum: number) => {
    const {dispatch} = this.props;
    await dispatch({
      type: UserInterfaceMap.reducerInterface.RECEIVE_COUPONS,
      payload: {
        couponList: []
      }
    });
    this.setState({
      currentType: tabNum,
      pageSize: 10,
      pageNum: 1,
    }, async () => {
      this.setState({ openList: [] })
      if (tabNum === 1) {
        // 已使用
        const params = {
          status: 1,
          pageSize: 10,
          pageNum: 1,
        }
        Taro.showLoading();
        const result =await UserAction.getMemberCoupons(this.props.dispatch,params);
        this.setState({
          total: result.data.total
        });
        Taro.hideLoading();
      } else if (tabNum === 0) {
        // 未使用
        const params = {
          status: 0,
          pageSize: 10,
          pageNum: 1,
        }
        Taro.showLoading();
        
        const result = await UserAction.getMemberCoupons(this.props.dispatch,params);
        this.setState({
          total: result.data.total
        });
        Taro.hideLoading();
      } else {
        // 已过期
        const params = {
          status: 0,
          pageSize: 10,
          pageNum: 1,
        }
        Taro.showLoading();
        
        const result = await UserAction.getMemberExpiredCoupons(this.props.dispatch,params);
        this.setState({
          total: result.data.total
        });
        Taro.hideLoading();
      }
    });
  }

  public onChangeCouponOpen = (item: UserInterface.CouponsItem, e: any) => {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    const openList = this.state.openList;
    for (let i = 0; i < openList.length; i++) {
      if (openList[i] === item.id) {
        let newOpenList = openList.slice(0, i).concat(openList.slice(i + 1, 0));
        this.setState({ openList: newOpenList });
        return;
      }
    }
    const newOpenList = [...openList];
    newOpenList.push(item.id);
    this.setState({ openList: newOpenList });
  }

  public isOpen = (item: UserInterface.CouponsItem) => {
    const { openList } = this.state;
    for (let i = 0; i < openList.length; i++) {
      if (openList[i] === item.id) {
        return true;
      }
    }
    return false;
  }

  public navTo = () => {
    Taro.navigateBack({ delta: 10 });
    Taro.switchTab({
      url: `/pages/index/index`
    });
  }


  public navToCenter = () => {
    Taro.navigateTo({url: '/pages/user/user.couponCenter'});
  }
  /**
   * @todo 未使用的优惠券要筛选分出本门店可用以及本门店不可用的两个列表
   *
   * @memberof Page
   */
  public getFilterCouponList = () => {
    const { couponList, currentMerchantDetail } = this.props;
    let ableToUseCouponList: any[] = [];
    let unableToUseCouponList: any[] = [];
    for (let i = 0; i < couponList.length; i++) {
      const { merchantIds } = couponList[i];
      const merchantIdsArr = merchantIds.split(',');
      let container = false;
      for (let j = 0; j < merchantIdsArr.length; j ++) {
        if (currentMerchantDetail.id === numeral(merchantIdsArr[j]).value()) {
          container = true;
          break;
        }
      }
      if (container) {
        ableToUseCouponList.push(couponList[i]);
      } else {
        unableToUseCouponList.push({...couponList[i], ableToUse: false, disableReason: '当前门店不可用'});
      }
    }
    return (
      { ableToUseCouponList, unableToUseCouponList }
    );
  }
  loadData = async () => {

    if (this.state.currentType === 1) {
      // 已使用
      const params = {
        status: 1,
        pageSize: 10,
        pageNum: this.state.pageNum + 1,
      }
      Taro.showLoading();
      const result = await UserAction.getMemberCouponsMore(this.props.dispatch,params);
      this.setState({
        total: result.data.total,
        pageNum: this.state.pageNum + 1,
      });
      Taro.hideLoading();
    } else if (this.state.currentType === 0) {
      // 未使用
      const params = {
        status: 0,
        pageSize: 10,
        pageNum: this.state.pageNum + 1,
      }
      Taro.showLoading();
      const result =  await UserAction.getMemberCouponsMore(this.props.dispatch,params);
      this.setState({
        total: result.data.total,
        pageNum: this.state.pageNum + 1,
      });
      Taro.hideLoading();
    } else {
      // 已过期
      const params = {
        status: 0,
        pageSize: 10,
        pageNum: this.state.pageNum + 1,
      }
      Taro.showLoading();
      const result = await UserAction.getMemberExpiredCouponsMore(this.props.dispatch,params);
      this.setState({
        total: result.data.total,
        pageNum: this.state.pageNum + 1,
      });
      Taro.hideLoading();
    }
  }
  render() {
    const { couponList } = this.props;
    const { currentType, total } = this.state;
    const {navToCenter} = this;
    let filterCouponList: any = { ableToUseCouponList: [], unableToUseCouponList: [] };
    if (currentType === 0) {
      filterCouponList = this.getFilterCouponList();
    }

    return (
      <View className={`container user`} >
        <View className={`${cssPrefix}-tabs`}>
          {this.renderTabs()}
        </View>
        <Image
          onClick={() => {navToCenter(); }}
          className={
            classNames({
              [`${cssPrefix}-bannerEmpty`]: process.env.TARO_ENV === 'weapp' && couponList && couponList.length === 0,
              [`${cssPrefix}-banner`]: process.env.TARO_ENV === 'weapp' && couponList && couponList.length > 0,
              [`${cssPrefix}-bannerH5`]: process.env.TARO_ENV === 'h5' && couponList && couponList.length > 0,
              [`${cssPrefix}-bannerEmptyH5`]: process.env.TARO_ENV === 'h5' && couponList && couponList.length === 0,
            })}
          src='//net.huanmusic.com/scanbar-c/v2/img_coupon_banner.png'
        />
        {
          couponList && couponList.length > 0
            ? (
              <ScrollView
                scrollY={true}
                className={`${cssPrefix}-scrollview`}
                style={process.env.TARO_ENV === 'weapp' ? {display:'flex'} : {}}
                onScrollToLower={couponList.length < total ? this.loadData: () => {/** */}}
              >
                {
                  currentType !== 0 && couponList.map((item: any) => {
                    return (
                      <View className={`${cssPrefix}-scrollview-item`} key={item.id}>
                        <CouponItem
                          data={item}
                          isOpen={this.isOpen(item)}
                          onChangeCouponOpen={this.onChangeCouponOpen}
                          gotoUse={this.navTo}
                          unableToUse={true}
                          type={currentType}
                        />
                      </View>
                    )
                  })
                }
                {
                  currentType === 0 && filterCouponList.ableToUseCouponList.length > 0 && filterCouponList.ableToUseCouponList.map((item: any) => {
                    return (
                      <View className={`${cssPrefix}-scrollview-item`} key={item.id}>
                        <CouponItem
                          data={item}
                          isOpen={this.isOpen(item)}
                          onChangeCouponOpen={this.onChangeCouponOpen}
                          gotoUse={this.navTo}
                          unableToUse={false}
                        />
                      </View>
                    )
                  })
                }
                {
                  currentType === 0 && filterCouponList.unableToUseCouponList.length > 0 && filterCouponList.unableToUseCouponList.map((item: any) => {
                    return (
                      <View className={`${cssPrefix}-scrollview-item`} key={item.id}>
                        <CouponItem
                          data={item}
                          isOpen={this.isOpen(item)}
                          onChangeCouponOpen={this.onChangeCouponOpen}
                          gotoUse={this.navTo}
                          unableToUse={true}
                        />
                      </View>
                    )
                  })
                }
                <View className={`${cssPrefix}-scrollview-bottom`}>已经到底了</View>
              </ScrollView>
            )
            : (
              <Empty
                img='//net.huanmusic.com/scanbar-c/v2/img_coupon.png'
                text='还没有优惠券'
              />
            )}

      </View>
    );
  }

  private renderTabs = () => {
    const { currentType } = this.state;
    const discountTypes = [
      {
        id: 0,
        title: '未使用'
      },
      {
        id: 1,
        title: '已使用',
      },
      {
        id: 2,
        title: '已过期',
      },
    ];
    return (
      <TabsSwitch
        current={currentType}
        tabs={discountTypes}
        onChangeTab={this.onChangeTab}
      />
    )
  }
}


const select = (state: any) => ({
  couponList: getCouponList(state),
  userinfo: getUserinfo(state),
  currentMerchantDetail: getCurrentMerchantDetail(state),
});

export default connect(select)(Page);