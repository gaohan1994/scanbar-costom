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

  return (
    <View className="container">
      <MerchantListView data={merchants} />
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
