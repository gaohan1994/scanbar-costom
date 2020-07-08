import Taro, { useState, useDidShow } from "@tarojs/taro";
import { View } from "@tarojs/components";
import userAction from "../../actions/user.action";
import { ResponseCode } from "../../constants/index";
import "./index.less";
import { connect } from "@tarojs/redux";
import merchantAction from "../../actions/merchant.action";
import MerchantListView from "../../component/product/merchant.listview";

const cssprefix = "user";

let page: number = 1;

function UserCard(props) {
  const [merchants, setMerchants] = useState([]);
  useDidShow(() => {
    page = 1;
    const fetchData = async () => {
      const result = await userAction.getMerchantAttention({
        pageNum: page,
        pageSize: 20
      });
      if (result.code === ResponseCode.success) {
        setMerchants(result.data.rows);
      }
    };

    fetchData();
  });

  const onItemClick = merchant => {
    const { setCurrentMerchantDetail } = props;
    setCurrentMerchantDetail(merchant);
    Taro.navigateTo({
      url: `/pages/index/home`
    });
  };

  return (
    <View className="container">
      <MerchantListView data={merchants} />
      {/* {merchants &&
        merchants.length > 0 &&
        merchants.map((item: any) => {
          return (
            <View
              className={`${cssprefix}-card-item`}
              onClick={() => onItemClick(item)}
            >
              <View className={`${cssprefix}-card-item-avatar`} />
              <View className={`${cssprefix}-card-item-detail`}>
                <View className={`${cssprefix}-card-item-title`}>
                  {item.name}
                </View>
                <View className={`${cssprefix}-card-item-number`}>
                  {item.cardNo}
                </View>
              </View>
              <View className={`${cssprefix}-card-item-vip`}>
                {item.levelName}
              </View>
              <View className={`${cssprefix}-card-item-icon`}>去购物</View>
            </View>
          );
        })} */}
    </View>
  );
}

const mapState = () => {
  return {};
};

const mapDispatch = dispatch => {
  return {
    setCurrentMerchantDetail: merchantAction.setCurrentMerchantDetail(dispatch)
  };
};

export default connect(mapState, mapDispatch)(UserCard as any);
