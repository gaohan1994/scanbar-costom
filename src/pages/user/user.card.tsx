import Taro, { useState, useDidShow } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import userAction from "../../actions/user.action";
import { ResponseCode } from "../../constants/index";
import "./index.less";
import '../style/product.less';
import { connect } from "@tarojs/redux";
import merchantAction from "../../actions/merchant.action";
import Empty from "../../component/empty";

const cssprefix = "user";

const pageSize = 5;

function UserCard(props) {

  const [cards, setCards] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useDidShow(() => {
    setPage(1);
    fetchData();
  });

  const fetchData = async () => {
    Taro.showLoading();
    const param = {
      pageNum: page,
      pageSize: pageSize
    }
    const result = await userAction.getMyMemberCard(param);
    Taro.hideLoading();
    if (result.code === ResponseCode.success) {
      if (page === 1) {
        setCards(result.data.rows);
      } else {
        const list = cards.concat(result.data.rows);
        setCards(list);
      }
      setTotal(result.data.total);
      setPage(page + 1);
    } else {
      Taro.showToast({
        title: result.msg || '获取会员卡信息失败',
        icon: 'none'
      })
    }
  };

  const onCardClick = card => {
    this.$preload({ merchant: card, entry: "card" });
    Taro.navigateTo({
      url: `/pages/user/user.card.detail`
    });
  };

  return (
    <View className="container user" style="background-color: white">
      {
        Array.isArray(cards) && cards.length > 0
          ? (
            <ScrollView
              scrollY={true}
              className={`${cssprefix}-coupon-scrollview ${cssprefix}-coupon-scrollview-full`}
              onScrollToLower={cards.length < total ? fetchData : () => {/** */ }}
              style="background-color: white"
            >
              {
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
                })
              }
              {
                cards.length >= total && cards.length !== 0 && (
                  <View className={`product-list-bottom`}>已经到底啦</View>
                )
              }
              <View style="height: 50px" />
            </ScrollView>
          )
          : (
            <View className='user-empty'>
              <Empty
                img='//net.huanmusic.com/scanbar-c/img_card.png'
                css={"ued"}
                text={"还没有会员卡"}
              />
            </View>
          )

      }

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
