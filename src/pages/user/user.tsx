import Taro, { Config } from "@tarojs/taro";
import { View, Button, Image, Text } from "@tarojs/components";
import WeixinSDK from "../../common/sdk/weixin/weixin";
import "./index.less";
import "../../component/card/form.card.less";
import invariant from "invariant";
import { LoginManager } from "../../common/sdk";
import { ResponseCode, UserInterface } from "../../constants";
import { UserAction } from "../../actions";
import { getUserinfo, getMemberInfo } from "../../reducers/app.user";
import { connect } from "@tarojs/redux";
import { Dispatch } from "redux";
import { getCurrentMerchantDetail } from "../../reducers/app.merchant";

const Rows = [
  {
    title: "我的地址",
    url: "/pages/address/address.list",
    icon: "//net.huanmusic.com/weapp/customer/icon_mine_location.png"
  },
  {
    title: "我的收藏",
    url: "/pages/user/user.attention",
    icon: "//net.huanmusic.com/weapp/customer/icon_mine_location.png"
  },
  {
    title: "设置",
    url: "/pages/user/user.set",
    icon: "//net.huanmusic.com/weapp/customer/icon_mine_set.png"
  }
];

const cssPrefix = "user";

interface Props {
  dispatch: Dispatch;
  currentMerchantDetail: any;
  userinfo: UserInterface.UserInfo;
  memberInfo: UserInterface.MemberInfo;
}
interface State {
  getUserinfoModal: boolean;
  loginModal: boolean;
}
class User extends Taro.Component<Props, State> {
  state = {
    getUserinfoModal: false as any,
    loginModal: false as any
  };

  config: Config = {
    navigationBarTitleText: "我的"
  };
  async componentWillMount() {
    try {
      await LoginManager.getUserInfo(this.props.dispatch);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  }
  async componentDidShow() {
    const { userinfo, currentMerchantDetail } = this.props;
    if (userinfo.phone && userinfo.phone.length > 0) {
      UserAction.getMemberInfo(this.props.dispatch, currentMerchantDetail);
    }
  }

  public address = async () => {
    const result = await WeixinSDK.chooseAddress();
    console.log(result);
  };

  public onRowClick = (row: any) => {
    if (row.title === "我的地址") {
      const { userinfo } = this.props;
      if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
        Taro.navigateTo({ url: "/pages/login/login.userinfo" });
        return;
      }
      if (userinfo.phone === undefined || userinfo.phone.length === 0) {
        Taro.navigateTo({ url: "/pages/login/login" });
        return;
      }
    }
    Taro.navigateTo({
      url: `${row.url}`
    });
  };

  public getWxInfo = async (show?: boolean) => {
    try {
      const { userinfo } = this.props;
      if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
        // this.setState({ getUserinfoModal: true });
        Taro.navigateTo({ url: "/pages/login/login.userinfo" });
        return;
      }
      if (userinfo.phone === undefined || userinfo.phone.length === 0) {
        // this.setState({ loginModal: true });
        Taro.navigateTo({ url: "/pages/login/login" });
        return;
      }
      this.getWxUserInfo(show);
    } catch (error) {
      if (show != false) {
        Taro.showToast({
          title: error.message,
          icon: "none"
        });
      }
    }
  };

  public getWxUserInfo = async (show?: boolean) => {
    try {
      const { userinfo, dispatch } = this.props;
      const result: any = await WeixinSDK.getWeixinUserinfo();
      invariant(result.success, result.msg || "获取用户昵称和头像失败");
      const newUserinfo = {
        ...userinfo,
        avatar: result.result.avatarUrl,
        nickname: result.result.nickName
      };
      if (userinfo && userinfo.phone && userinfo.phone.length > 0) {
        const saveResult: any = await UserAction.userInfoSave(newUserinfo);
        invariant(
          saveResult.code === ResponseCode.success,
          saveResult.msg || "保存用户信息失败"
        );
      }

      const setResult: any = await LoginManager.setUserInfo(
        newUserinfo,
        dispatch
      );
      invariant(setResult.success, setResult.msg || "存储用户信息失败");
    } catch (error) {
      if (show != false) {
        Taro.showToast({
          title: error.message,
          icon: "none"
        });
      }
    }
  };

  public navTo = (url: string, needLogin: boolean) => {
    if (needLogin) {
      const { userinfo } = this.props;
      if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
        Taro.navigateTo({ url: "/pages/login/login.userinfo" });
        return;
      }
      if (userinfo.phone === undefined || userinfo.phone.length === 0) {
        Taro.navigateTo({ url: "/pages/login/login" });
        return;
      }
    }
    Taro.navigateTo({ url: url });
  };

  render() {
    const { userinfo, memberInfo, currentMerchantDetail } = this.props;
    return (
      <View className={`container ${cssPrefix}`}>
        <View className={`${cssPrefix}-bg`} />
        <View className={`${cssPrefix}-container`}>
          {userinfo && userinfo.phone && userinfo.phone.length > 0 ? (
            <Button
              openType="getUserInfo"
              onGetUserInfo={() => this.getWxInfo(true)}
              className={`${cssPrefix}-user`}
            >
              {userinfo && userinfo.avatar && userinfo.avatar.length > 0 ? (
                <Image
                  src={userinfo.avatar}
                  className={`${cssPrefix}-user-image`}
                />
              ) : (
                <Image
                  src="//net.huanmusic.com/weapp/icon_mine_touxiang.png"
                  className={`${cssPrefix}-user-image`}
                />
              )}
              <View className={`${cssPrefix}-user-box`}>
                {userinfo &&
                userinfo.nickname &&
                userinfo.nickname.length > 0 ? (
                  <View className={`${cssPrefix}-user-name`}>
                    {userinfo.nickname}
                    {memberInfo &&
                      memberInfo.levelName &&
                      memberInfo.levelName.length > 0 && (
                        <View className={`${cssPrefix}-user-member`}>
                          {memberInfo.levelName}
                        </View>
                      )}
                  </View>
                ) : (
                  <View
                    className={`${cssPrefix}-user-name ${cssPrefix}-user-name-get`}
                  >
                    点击获取微信头像和昵称
                  </View>
                )}
                <View className={`${cssPrefix}-user-phone`}>
                  {userinfo.phone}
                </View>
              </View>
            </Button>
          ) : (
            <View className={`${cssPrefix}-user`}>
              {userinfo && userinfo.avatar && userinfo.avatar.length > 0 ? (
                <Image
                  src={userinfo.avatar}
                  className={`${cssPrefix}-user-image`}
                />
              ) : (
                <Image
                  src="//net.huanmusic.com/weapp/icon_mine_vip.png"
                  className={`${cssPrefix}-user-image`}
                />
              )}
              <View className={`${cssPrefix}-user-box`}>
                <View
                  className={`${cssPrefix}-user-name ${cssPrefix}-user-name-get`}
                  onClick={() => {
                    userinfo &&
                    userinfo.nickname &&
                    userinfo.nickname.length > 0
                      ? Taro.navigateTo({ url: "/pages/login/login" })
                      : Taro.navigateTo({
                          url: "/pages/login/login.userinfo"
                        });
                    if (process.env.TARO_ENV === "h5") {
                      localStorage.setItem(
                        "mearchantName",
                        currentMerchantDetail.name
                      );
                    }
                  }}
                >
                  点击登录
                </View>
              </View>
            </View>
          )}
          <View className={`${cssPrefix}-member`}>
            <View
              onClick={() => {
                this.navTo("/pages/user/user.card", true);
              }}
              className={`${cssPrefix}-member-item`}
            >
              <View className={`${cssPrefix}-member-item-vip`} />
              <Text>会员卡 4</Text>
            </View>
            <View
              className={`${cssPrefix}-member-item ${cssPrefix}-member-item-discount`}
              onClick={() => {
                this.navTo("/pages/user/user.coupon", true);
              }}
            >
              <View className={`${cssPrefix}-member-item-coupon`} />
              <Text>{`优惠券 ${memberInfo.couponNum}`}</Text>
            </View>
          </View>

          <View className={`${cssPrefix}-rows`}>
            {Rows.map((item: any) => {
              return (
                <View
                  style={`${
                    item.title === "我的地址" ? "margin-bottom: 0px" : ""
                  }`}
                  className={`${cssPrefix}-rows-item`}
                  key={item.title}
                  onClick={() => this.onRowClick(item)}
                >
                  <View className={`${cssPrefix}-rows-item-left`}>
                    <Image
                      className={`${cssPrefix}-rows-item-left-icon`}
                      src={item.icon}
                    />
                    <Text className={`${cssPrefix}-rows-item-left-title`}>
                      {item.title}
                    </Text>
                  </View>
                  <Image
                    className={`${cssPrefix}-rows-item-right-icon`}
                    src="//net.huanmusic.com/weapp/icon_commodity_into.png"
                  />
                  {item.title === "我的地址" && (
                    <View className={`${cssPrefix}-rows-item-border`} />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}

const select = (state: any) => ({
  userinfo: getUserinfo(state),
  memberInfo: getMemberInfo(state),
  currentMerchantDetail: getCurrentMerchantDetail(state)
});

export default connect(select)(User);
