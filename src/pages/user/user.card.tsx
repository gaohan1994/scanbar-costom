import Taro, { useState, useDidShow } from "@tarojs/taro";
import { View } from "@tarojs/components";
import userAction from "../../actions/user.action";
import { ResponseCode } from "../../constants/index";
import "./index.less";
import { connect } from "@tarojs/redux";
import merchantAction from "../../actions/merchant.action";

const cssprefix = "user";



function UserCard(props) {

  const [cards, setCards] = useState([]);
  useDidShow(() => {
    const fetchData = async () => {
      const result = await userAction.getMyMemberCard();
      if (result.code === ResponseCode.success) {
        setCards(result.data.rows);
      }
    };

    fetchData();
  });

  const onCardClick = card => {
    // const { setCurrentMerchantDetail } = props;
    // setCurrentMerchantDetail(card);
    this.$preload({ merchant: card, entry: "card" });
    Taro.navigateTo({
      url: `/pages/user/user.card.detail`
    });
  };

  return (
    <View className="container">
      {cards &&
        cards.length > 0 &&
        cards.map((card: any) => {
          return (
            <View
              className={`${cssprefix}-card-item`}
              onClick={() => onCardClick(card)}
            >
              {
                card.logo && card.logo.length > 0
                  ? (
                    <View className={`${cssprefix}-card-item-avatar`} style={`background-image:url(${card.logo})`} />
                  )
                  : (
                    <View className={`${cssprefix}-card-item-avatar`} />
                  )
              }

              <View className={`${cssprefix}-card-item-detail`}>
                <View className={`${cssprefix}-card-item-title`}>
                  {card.name}
                </View>
                <View className={`${cssprefix}-card-item-number`}>
                  {card.cardNo}
                </View>
              </View>
              <View className={`${cssprefix}-card-item-vip`}>
                {card.levelName}
              </View>
              <View className={`${cssprefix}-card-item-icon`}>去购物</View>
            </View>
          );
        })}
    </View>
  );
}

UserCard.config = {
  navigationBarTitleText: "会员卡"
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
