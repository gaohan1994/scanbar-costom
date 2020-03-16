import Taro, { Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.less';
import "../../component/card/form.card.less";
import TabsSwitch from '../../component/tabs/tabs.switch';
import classnames from 'classnames';

interface Props {

}
interface State {
  currentType: number;
}

const cssPrefix = 'user-coupon';
class Page extends Taro.Component<Props, State> {

  config: Config = {
    navigationBarTitleText: '优惠券'
  }

  state = {
    currentType: 0,
  };

  public onChangeTab = (tabNum: number) => {
    this.setState({
      currentType: tabNum
    }, () => {
      // this.fetchOrder(1);
    });
  }


  render() {
    // const { userinfo } = this.props;
    return (
      <View className={`container user`} >
        <View className={`${cssPrefix}-tabs`}>
          {this.renderTabs()}
        </View>
        <Image
          className={`${cssPrefix}-banner`}
          src='//net.huanmusic.com/scanbar-c/v2/img_coupon_banner.png'
        />
        {this.renderItem()}
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

  private renderItem = () => {
    return (
      <View className={`${cssPrefix}-item`}>
        <View 
          className={classnames(`${cssPrefix}-item-top`, {
            [`${cssPrefix}-item-top-grey`]: false
          })}>
          <View className={`${cssPrefix}-item-top-left`}>
            <Text className={`${cssPrefix}-item-top-left-price`}>
              9
              <Text className={`${cssPrefix}-item-top-left-sign`}>¥</Text>
            </Text>
            <Text className={`${cssPrefix}-item-top-left-info`}>满50可用</Text>
          </View>
          <View className={`${cssPrefix}-item-top-right`}>
            <Text className={classnames(`${cssPrefix}-item-top-right-info`, {
              [`${cssPrefix}-item-text-grey`]: false,
            })}>全品类可用</Text>
            <View className={`${cssPrefix}-item-top-right-row`}>
              <Text className={classnames(`${cssPrefix}-item-top-right-time`, {
                [`${cssPrefix}-item-text-grey`]: false,
              })}>
                01/01~03/31
              </Text>
              <Image
                className={classnames(`${cssPrefix}-item-top-right-pop`, {
                  [`${cssPrefix}-item-top-right-pop-down`]: false
                })}
                src='//net.huanmusic.com/weapp/icon_packup_gray.png'
              />
            </View>
          </View>
          <View className={classnames(`${cssPrefix}-item-top-button`, {
            [`${cssPrefix}-item-text-grey`]: false,
            [`${cssPrefix}-item-border-grey`]: false,
          })}>
            去使用
          </View>
        </View>
        <View className={`${cssPrefix}-item-bottom`}>
          <Text className={`${cssPrefix}-item-bottom-info`}>
            1.优惠券满50元减9元，全品类可用（优惠商品除外）；
          </Text>
          <Text className={`${cssPrefix}-item-bottom-info`}>
            2.一个订单只能使用一张优惠券；
          </Text>
          <Text className={`${cssPrefix}-item-bottom-info`}>
            3.优惠券只能抵扣商品费用，不抵扣配
          </Text>
        </View>
      </View>
    )
  }
}


export default Page;