import Taro, { Config } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import './index.less';
import "../../component/card/form.card.less";
import { connect } from '@tarojs/redux';
import { getUserinfo, getcouponListCenter } from '../../reducers/app.user';
import { UserAction } from '../../actions';
import { UserInterface, MerchantInterface } from '../../constants';
import Empty from '../../component/empty';
import CouponItem from '../../component/coupon/coupon.item';
import { getCurrentMerchantDetail } from '../../reducers/app.merchant';
import { Dispatch } from 'redux';
import { ResponseCode } from '../../constants/index';

interface Props {
  dispatch: Dispatch;
  couponListCenter: UserInterface.CouponsItemCenter[];
  userinfo: UserInterface.UserInfo;
  currentMerchantDetail: MerchantInterface.MerchantDetail;
}
interface State {
  currentType: number;
  openList: any[];
}

const cssPrefix = 'user-coupon';
class Page extends Taro.Component<Props, State> {

  config: Config = {
    navigationBarTitleText: '领卷中心'
  }

  state = {
    currentType: 0,
    openList: [] as any
  };

  async componentDidMount() {
    const {dispatch} = this.props;
    Taro.showLoading();
    await UserAction.getWaitForObtainCoupons(dispatch);
    Taro.hideLoading();
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
  public GetobtainCoupons = async (list: any) => {
    const couponIdList = list.map(val => val.couponId);
    try {
        const param = {
            couponIdList: couponIdList
        }
        const res = await UserAction.GetobtainCoupons(param);
        if (res.code == ResponseCode.success) {
            Taro.showToast({
                title: '领取成功',
                icon: 'success'
            });
            return true;
        }
        return false;
    } catch (error) {
        Taro.showToast({
            title: error.message,
            icon: 'none'
        });
        return false;
    }
  }
  render() {
    const { couponListCenter } = this.props;
    const { currentType } = this.state;
    const list: any = [];
    couponListCenter.forEach((val) => {
      for (let index = 0; index < val.ableObtainNum; index++) {
        list.push(val)
      }
    })
    return (
      <View className={`container user`} >
        {
          list && list.length > 0
            ? (
              <ScrollView
                scrollY={true}
                className={`${cssPrefix}-scrollview`}
                style={{height: '100%'}}
              >
                {
                  list.map((item: any) => {
                    return (
                      <View className={`${cssPrefix}-scrollview-item`} key={item.id}>
                        <CouponItem
                          data={{...item, couponVO: item }}
                          isOpen={this.isOpen(item)}
                          onChangeCouponOpen={this.onChangeCouponOpen}
                          gotoUse={this.navTo}
                          unableToUse={false}
                          type={currentType}
                          isGet={true}
                          onGet={this.GetobtainCoupons}
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
                text='暂时没有可领优惠券'
              />
            )}

      </View>
    );
  }
}


const select = (state: any) => ({
  couponListCenter: getcouponListCenter(state),
  userinfo: getUserinfo(state),
  currentMerchantDetail: getCurrentMerchantDetail(state),
});

export default connect(select)(Page);