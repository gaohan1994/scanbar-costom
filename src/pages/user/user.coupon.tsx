import Taro, { Config } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import './index.less';
import "../../component/card/form.card.less";
import '../style/product.less';
import { connect } from '@tarojs/redux';
import { getCouponList, getUserinfo } from '../../reducers/app.user';
import { UserAction, MerchantAction } from '../../actions';
import { UserInterface, MerchantInterface } from '../../constants';
import Empty from '../../component/empty';
import { getCurrentMerchantDetail } from '../../reducers/app.merchant';
import { Dispatch } from 'redux';
import { ResponseCode } from '../../constants/index';
import UserCouponItem from './user.coupon.item';

interface Props {
  dispatch: Dispatch;
  couponList: UserInterface.CouponsItem[];
  userinfo: UserInterface.UserInfo;
  currentMerchantDetail: MerchantInterface.MerchantDetail;
  setCurrentMerchantDetail: (
    merchant: MerchantInterface.AlianceMerchant
  ) => void;
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
      pageSize: 10,
      pageNum: 1,
    }
    Taro.showLoading();
    const result = await UserAction.getMyAvailableCoupon(this.props.dispatch, params);
    if (result.code === ResponseCode.success) {
      this.setState({
        total: result.data.total
      });
    } else {
      Taro.showToast({
        title: result.msg || '获取可用优惠券失败！',
        icon: 'none'
      });
    }
    Taro.hideLoading();
  }

  public onChangeCouponOpen = (item: any, e: any) => {
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

  public navToUse = (item: any) => {
    this.props.setCurrentMerchantDetail({ id: item.merchantId } as any);
    Taro.navigateTo({
      url: `/pages/index/home`
    });
  }

  public loadData = async () => {
    const params = {
      pageSize: 10,
      pageNum: this.state.pageNum + 1,
    }
    Taro.showLoading();
    const result = await UserAction.getMyAvailableCouponMore(this.props.dispatch, params);
    this.setState({
      total: result.data.total,
      pageNum: this.state.pageNum + 1,
    });
    Taro.hideLoading();
  }


  render() {
    const { couponList } = this.props;
    const { total } = this.state;
    return (
      <View className={`container user`} >
        {
          Array.isArray(couponList) && couponList.length > 0
            ? (
              <ScrollView
                scrollY={true}
                className={`${cssPrefix}-scrollview ${cssPrefix}-scrollview-full`}
                onScrollToLower={couponList.length < total ? this.loadData : () => {/** */ }}
              >
                {
                  couponList.map((item, index) => {
                    return (
                      <View key={`coupon${index}`} className={`${cssPrefix}-scrollview-item`}>
                        <UserCouponItem
                          item={item}
                          isOpen={this.isOpen(item)}
                          onChangeCouponOpen={this.onChangeCouponOpen}
                          goToUse={this.navToUse}
                        />
                      </View>

                    )
                  })
                }
                {
                  couponList.length >= total && couponList.length !== 0 && (
                    <View className={`product-list-bottom`}>已经到底啦</View>
                  )
                }
                <View style="height: 50px" />
              </ScrollView>
            )
            : (
              <View className='user-empty'>
                <Empty
                  img='//net.huanmusic.com/scanbar-c/v2/img_coupon.png'
                  text="还没优惠券"
                />
              </View>
            )
        }
      </View>
    );
  }
}

const mapDispatch = dispatch => {
  return {
    setCurrentMerchantDetail: MerchantAction.setCurrentMerchantDetail(dispatch)
  };
};

const select = (state: any) => ({
  userinfo: getUserinfo(state),
  couponList: getCouponList(state),
  currentMerchantDetail: getCurrentMerchantDetail(state),
});

export default connect(select, mapDispatch)(Page as any);