import Taro, { useState, useDidShow, useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import userAction from "../../actions/user.action";
import { ResponseCode } from "../../constants/index";
import "./index.less";
import { connect } from "@tarojs/redux";
import { getMemberInfo } from "./constant/api";
import { MerchantInterface } from "src/constants";
import merchantAction from "../../actions/merchant.action";
import { IUserStore } from "./types";
import ButtonFooter from "../../component/button/button.footer";

const cssprefix = "user";

type Props = {
  setCurrentMerchantDetail: (params: MerchantInterface.AlianceMerchant) => void;
};

function UserCard(props: Props) {
  const [cardDetail, setCardDetail] = useState({} as IUserStore.CardDetail);
  const router = useRouter();
  let entry = null;
  if (router.preload && router.preload.entry) {
    entry = router.preload as any;
  }

  useDidShow(() => {
    if (!router.preload) {
      Taro.showToast({
        title: "请传入正确的参数",
        icon: "none"
      });
      Taro.navigateBack();
      return;
    }
    const { merchant } = router.preload as any;
    const fetchData = async () => {
      const result = await getMemberInfo(`${merchant.id}`);
      if (result.code === ResponseCode.success) {
        setCardDetail(result.data);
      }
    };

    fetchData();
  });

  const onCardClick = () => {
    const { setCurrentMerchantDetail } = props;
    if (!!entry && entry === "home") {
      Taro.navigateBack();
      return;
    }
    setCurrentMerchantDetail((router.preload as any).merchant);
    Taro.navigateTo({
      url: `/pages/index/home`
    });
  };

  return (
    <View className="container" style="background: #ffffff">
      <View className={`${cssprefix}-card-bg`} >
        <View
          className={`${cssprefix}-card-item`}
          style="margin-top:0px;padding-top:0px;background-image:url(//net.huanmusic.com/scanbar-c/bg_vipcard.png);flex-direction:column"
        // onClick={() => onCardClick()}
        >

          <View className={`${cssprefix}-card-item-level`}>{cardDetail.levelName}</View>
          <View className={`${cssprefix}-card-item-top`}>
            <View className={`${cssprefix}-card-item-avatar`} />
            <View className={`${cssprefix}-card-item-detail`}>
              <View className={`${cssprefix}-card-item-title`}>
                {cardDetail.merchantName}
              </View>
              <View className={`${cssprefix}-card-item-number`}>
                {cardDetail.cardNo}
              </View>
            </View>
          </View>

          <View className={`${cssprefix}-card-item-bottom`}>
            <View className={`${cssprefix}-card-item-bottom-item`}>
              <View className={`${cssprefix}-card-item-bottom-number`}>{`¥ ${cardDetail.overage || 0}`}</View>
              <View>储值余额</View>
            </View>
            <View className={`${cssprefix}-card-item-bottom-item`}>
              <View className={`${cssprefix}-card-item-bottom-number`}>{cardDetail.points || 0}</View>
              <View>积分</View>
            </View>
            <View className={`${cssprefix}-card-item-bottom-item`}>
              <View className={`${cssprefix}-card-item-bottom-number`}>{cardDetail.couponNum || 0}</View>
              <View>优惠券</View>
            </View>
          </View>
        </View>

        <View className={`${cssprefix}-card-item-interest`}>
          <View className={`${cssprefix}-card-item-interest-header`}>
            <View className={`${cssprefix}-card-item-interest-symbol`} />
            <View className={`${cssprefix}-card-item-interest-title`}>会员权益</View>
          </View>

          <View className={`${cssprefix}-card-item-interest-content`}>1.每消费{cardDetail.obtainMoney}元，积攒{cardDetail.obtainPoints}积分 </View>
        </View>

        {
          !!entry && entry === "home"
            ? <View />
            : (
              <ButtonFooter
                border={false}
                buttons={[
                  {
                    title: "去购物",
                    onPress: () => onCardClick()
                  }
                ]}
              />
            )
        }
      </View>
    </View>
  );
}

UserCard.config = {
  navigationBarTitleText: "会员"
};

const mapState = () => {
  return {};
};

const mapDispatch = dispatch => {
  return {
    setCurrentMerchantDetail: merchantAction.setCurrentMerchantDetail(dispatch)
  };
};

export default connect(mapState, mapDispatch)(UserCard as any);
