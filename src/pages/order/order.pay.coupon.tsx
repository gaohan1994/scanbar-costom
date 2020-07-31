import Taro, { Config } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import '../user/index.less';
import "../../component/card/form.card.less";
import { getAbleToUseCouponList } from '../../reducers/app.order';
import { UserInterface } from '../../constants';
import Empty from '../../component/empty';
import { connect } from '@tarojs/redux';
import productSdk from '../../common/sdk/product/product.sdk';
import CouponItem from '../../component/coupon/coupon.item';
import { Dispatch } from 'redux';

interface Props {
  dispatch: Dispatch;
  couponList: UserInterface.CouponsItem[];
  payOrderDetail: any;
}
interface State {
  currentType: number;
  selectedNum: number;
  ableCouponList: UserInterface.CouponsItem[];
  unableCounponList: UserInterface.CouponsItem[];
  openList: any[];
}

const cssPrefix = 'user-coupon';
class Page extends Taro.Component<Props, State> {

  config: Config = {
    navigationBarTitleText: '优惠券'
  }

  state = {
    currentType: 0,
    selectedNum: 0,
    ableCouponList: [],
    unableCounponList: [],
    openList: [] as any,
  };

  componentDidMount() {
    const { couponList } = this.props;
    let ableCouponList: any[] = [];
    let unableCounponList: any[] = [];
    for (let i = 0; i < couponList.length; i++) {
      if (couponList[i].ableToUse) {
        ableCouponList.push(couponList[i]);
      } else {
        unableCounponList.push(couponList[i]);
      }
    }
    this.setState({ ableCouponList, unableCounponList });
  }

  /**
   * @todo 改变优惠券的打开合起状态
   *
   * @memberof Page
   */
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

  /**
   * @todo 判断优惠券是否是打开状态
   *
   * @memberof Page
   */
  public isOpen = (item: UserInterface.CouponsItem) => {
    const { openList } = this.state;
    for (let i = 0; i < openList.length; i++) {
      if (openList[i] === item.id) {
        return true;
      }
    }
    return false;
  }

  /**
   * @todo 选取优惠券
   *
   * @memberof Page
   */
  public couponSelect = (item: UserInterface.CouponsItem) => {
    const { payOrderDetail, dispatch } = this.props;
    if (payOrderDetail.selectedCoupon && payOrderDetail.selectedCoupon.id && payOrderDetail.selectedCoupon.id === item.id) {
      productSdk.preparePayOrderDetail({ selectedCoupon: {} }, dispatch);
    } else {
      if (item.ableToUse) {
        productSdk.preparePayOrderDetail({ selectedCoupon: item }, dispatch);
        Taro.navigateBack();
      }
    }

  }

  render() {
    const { couponList, payOrderDetail } = this.props;
    const { ableCouponList, unableCounponList } = this.state;
    return (
      <View className={`container user`} >
        {
          couponList && couponList.length > 0
            ? (
              <ScrollView
                scrollY={true}
                className={`${cssPrefix}-scrollview ${cssPrefix}-scrollview-full`}
              >
                {
                  ableCouponList && ableCouponList.length > 0 && ableCouponList.map((item: any) => {
                    return (
                      <View className={`${cssPrefix}-scrollview-item`} key={item.id}>
                        <CouponItem
                          data={item}
                          isOpen={this.isOpen(item)}
                          onChangeCouponOpen={this.onChangeCouponOpen}
                          unableToUse={false}
                          selected={(payOrderDetail && payOrderDetail.selectedCoupon && payOrderDetail.selectedCoupon.id === item.id) ? true : false}
                          onSelected={this.couponSelect}
                        />
                      </View>
                    )
                  })
                }
                {
                  unableCounponList && unableCounponList.length > 0 && (
                    <View className={`${cssPrefix}-scrollview-unable`}>
                      <Text className={`${cssPrefix}-grey`}>以下优惠券不可用</Text>
                      {
                        unableCounponList.map((item: any) => {
                          return (
                            <View className={`${cssPrefix}-scrollview-item`} key={item.id}>
                              <CouponItem
                                data={item}
                                isOpen={this.isOpen(item)}
                                onChangeCouponOpen={this.onChangeCouponOpen}
                                unableToUse={true}
                                selected={false}
                              />
                            </View>
                          )
                        })
                      }
                    </View>
                  )
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
}

const select = (state: any) => ({
  couponList: getAbleToUseCouponList(state),
  payOrderDetail: state.productSDK.payOrderDetail,
});

export default connect(select)(Page as any);