import Taro, { Config } from '@tarojs/taro'
import { View, Image, Text} from '@tarojs/components'
import './index.less';
import "../../component/card/form.card.less";
import { AtButton, AtIcon } from 'taro-ui';
import { getUserinfo, getMemberInfo } from '../../reducers/app.user';
import { connect } from '@tarojs/redux';
import { Barcode, QRCode } from 'taro-code'

const cssPrefix = 'user-code-page';
class Page extends Taro.Component {

    config: Config = {
        navigationBarTitleText: '会员码'
    }

    public logout = async () => {

    }

    render() {
        const { userinfo, memberInfo } = this.props;
        return (
            <View className={`container ${cssPrefix}`} >
                <View className={`${cssPrefix}-bg`} />
                <View className={`${cssPrefix}-container`}>
                    <View className={`${cssPrefix}-container-inner`}>
                        <View className={`${cssPrefix}-user-image-cont-outter`}>
                            <View className={`${cssPrefix}-user-image-cont`}>
                                {
                                    userinfo && userinfo.avatar && userinfo.avatar.length > 0
                                        ? (
                                            <Image
                                                src={userinfo.avatar}
                                                className={`${cssPrefix}-user-image`}
                                            />
                                        )
                                        : (
                                            <Image
                                                src="//net.huanmusic.com/weapp/icon_mine_touxiang.png"
                                                className={`${cssPrefix}-user-image`}
                                            />
                                        )
                                }
                            </View>
                        </View>
                        <View className={`${cssPrefix}-user-box`} >
                            {
                                userinfo && userinfo.nickname && userinfo.nickname.length > 0 ?
                                <View className={`${cssPrefix}-user-name-outter`}>
                                    <View className={`${cssPrefix}-user-name`}>
                                        {userinfo.nickname}
                                        {
                                            memberInfo && memberInfo.levelName && memberInfo.levelName.length > 0 && (
                                                <View className={`${cssPrefix}-user-member`}>{memberInfo.levelName}</View>
                                            )
                                        }
                                    </View>
                                </View>
                                :
                                <View
                                    className={`${cssPrefix}-user-name ${cssPrefix}-user-name-get`}
                                >您还未登录</View>
                            }
                            <View className={`${cssPrefix}-user-phone`}>{
                                userinfo && userinfo.phone &&
                                `${userinfo.phone.substr(0,3)} ${userinfo.phone.substr(3,4)} ${userinfo.phone.substr(7,4)}`
                            }</View>

                            {
                                userinfo && userinfo.phone && (
                                    <View>
                                        <View className={`${cssPrefix}-bar-code`}>
                                            <Barcode text={userinfo.phone}/>
                                        </View>
                                        <View className={`${cssPrefix}-qr-code`}>
                                            <QRCode text={userinfo.phone}/>
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                        <View className={`${cssPrefix}-set-button`}>
                            <AtButton
                                className="theme-button"
                            >
                                <View className="theme-button-text">
                                    <View className="wechat-icon"></View>
                                    微信支付
                                </View>
                            </AtButton>
                        </View>
                    </View>

                </View>
            </View>
        );
    }
}
const select = (state: any) => ({
    userinfo: getUserinfo(state),
    memberInfo: getMemberInfo(state)
});

export default connect(select)(Page);