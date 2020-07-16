import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { useStore } from "./costom-hooks/use-data-init";
import { connect } from "@tarojs/redux";
import { MerchantInterface } from "src/constants";
import { AppReducer } from "src/reducers";

type Props = {
  currentMerchantDetail: MerchantInterface.AlianceMerchant;
};

function UserCoupon(props: Props) {
  const { currentMerchantDetail } = props;
  const result = useStore(currentMerchantDetail);
  console.log("result", result);
  return <View>asd</View>;
}

const mapState = (state: AppReducer.AppState) => {
  return {
    currentMerchantDetail: state.merchant.currentMerchantDetail
  };
};

export default connect(mapState)(UserCoupon);
