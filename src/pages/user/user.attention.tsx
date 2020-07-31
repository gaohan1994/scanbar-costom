import Taro, { useState, useDidShow } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import userAction from "../../actions/user.action";
import { ResponseCode } from "../../constants/index";
import "./index.less";
import "../style/product.less";
import { connect } from "@tarojs/redux";
import merchantAction from "../../actions/merchant.action";
import Empty from "../../component/empty";
import MerchantComponent from "../../component/product/merchant";
import classnames from "classnames";

const cssPrefix = "product";

let page: number = 1;

function UserCard(props: any) {
  const [merchants, setMerchants] = useState([] as any[]);
  const [merchantTotal, setMerchantTotal] = useState(-1);
  useDidShow(() => {
    page = 1;
    fetchData();
  });

  const fetchData = async () => {
    Taro.showLoading();
    const result = await userAction.getMerchantAttention({
      pageNum: page,
      pageSize: 10
    });
    Taro.hideLoading();
    if (result.code === ResponseCode.success) {
      if (page === 1) {
        setMerchants(result.data.rows);
      } else {
        const data = result.data.rows;
        const nweList = merchants.concat(data);
        setMerchants(nweList);
      }
      setMerchantTotal(result.data.total);
      page++;
    } else {
      Taro.showToast({
        title: result.msg || '获取收藏店铺失败',
        icon: 'none'
      });
    }
  };


  async function onScrollToLower() {
    const hasMore = merchants.length < merchantTotal;
    if (hasMore) {
      Taro.showLoading();
      await fetchData();
      Taro.hideLoading();
    }
  }

  return (
    <View className="container user">
      {
        Array.isArray(merchants) && merchants.length > 0 ? (
          <ScrollView
            scrollY={true}
            className={classnames(
              `${cssPrefix}-list-right ${
              process.env.TARO_ENV === "h5" ? `${cssPrefix}&-h5-height` : ""
              }`,
              `product-list-attention`
            )}
            onScrollToLower={onScrollToLower}
          >
            <View className={`product-list-attention-margin`}/>
            {
              (merchants || []).map((merchant, index) => {
                return (
                  <View id={`data${merchant.id}`} key={merchant.id}>
                    <MerchantComponent merchant={merchant} border={merchants.length - 1 !== index} />
                  </View>
                );
              })
            }
            <View className={`product-list-attention-margin`}/>
            {merchants.length < merchantTotal !== true && merchants && merchants.length > 0 && (
              <View className={`${cssPrefix}-list-bottom`}>已经到底啦</View>
            )}
            <View style="height: 100rpx" />
          </ScrollView>
        )
          : (
            <View className='user-empty'>
              <Empty
                img="//net.huanmusic.com/scanbar-c/img_collection.png"
                css={"ued"}
                text={"还没有收藏的店铺"}
              />
            </View>
          )
      }
    </View>
  );
}

UserCard.config = {
  navigationBarTitleText: "我的收藏"
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
