import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text, Button} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import { AtFloatLayout, AtModal, AtModalHeader, AtModalContent, AtModalAction} from "taro-ui"
import './index.less'
import '../style/product.less'
import ProductListView from '../../component/product/product.listview'
import ProductMenu from '../../component/product/product.menu'
import IndexAddress from './component/address'
import DiscountInfo from './component/discountInfo'
import Banner from './component/banner'
import invariant from 'invariant'
import {ProductAction, MerchantAction, UserAction} from '../../actions'
import {ResponseCode, ProductInterface, MerchantInterfaceMap} from '../../constants'
import WeixinSdk from '../../common/sdk/weixin/weixin'
import orderAction from '../../actions/order.action'
import TabsChoose from '../../component/tabs/tabs.choose'
import { getMerchantAdvertisement, getCurrentMerchantDetail, getMerchantList } from '../../reducers/app.merchant';
import {LoginManager} from '../../common/sdk'
import CouponModal from '../../component/coupon/coupon.modal'
import { getUserinfo, getMemberInfo, getIndexAddress } from '../../reducers/app.user';
import {BASE_PARAM} from '../../common/util/config'
import { getProductCartList } from '../../common/sdk/product/product.sdk.reducer';
import ProductSDK from '../../common/sdk/product/product.sdk';

const cssPrefix = 'product';

class Index extends Component<any> {

    readonly state = {
        currentType: {
            name: '',
            id: 0,
            createTime: '',
            subCategory: [],
        },
        loading: false,
        isOpen: false,
        showActivity: true,
        couponModalShow: false,
        obtainCouponList: [],
        showStore: false,
        chooseAddressModal: false
    };

    common = {
        refreshFlag: false,
        timeoutFlag: false,
        changeTypeFlag: false,
    }

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '首页'
    }
    onShareAppMessage = () => {
        return {
            title: '21号生活馆',
            path: `/pages/index/index`,
        };
    };
    async componentDidMount() {
        this.initDit();
    }
    initDit = () => {
        if(process.env.TARO_ENV === 'h5'){
            const hash = window.location.hash.split('?')
            const keywords = hash[1] ? hash[1] : '';
            const result = keywords.replace(/&/g, '","').replace(/=/g, '":"');
            if(result){
              const reqDataString = '{"' + result + '"}';
              const key = JSON.parse(reqDataString); 
              const merchantId = localStorage.getItem('merchantId');
              if(merchantId && parseInt(merchantId) !== parseInt(key.merchantId)){
                LoginManager.logout(this.props.dispatch);
              }
              if(key.merchantId){
                localStorage.setItem('merchantId', `${key.merchantId}`);
                localStorage.setItem('MCHIDFist', `${key.merchantId}`);
              }
              
              localStorage.setItem('search', `?keywords`);
            }
        }
        try {
            
            this.init(true);
            // orderAction.orderAllStatus(this.props.dispatch);
        } catch (error) {
            Taro.showToast({
                title: error.message,
                icon: 'none'
            })
        }
        // const { userinfo, dispatch } = this.props;
        // if (userinfo.phone && userinfo.phone.length > 0) {
        //     UserAction.getMemberInfo(dispatch);
        //     const res = await UserAction.obtainCoupon();
        //     if (res.code == ResponseCode.success) {
        //         this.setState({ obtainCouponList: res.data.rows })
        //     }
        // }
        
        this.setState({couponModalShow: true})
    }
    async componentDidShow() {
        this.init(true);
        this.changeRefrash();
    }
    async getNewData (self) {
        const {dispatch, address} = self.props;
        const total = self.getCartTotal() ;
        if (total !== 0) {
            Taro.setTabBarBadge({
                index: 2,
                text: `${total}`
            });
        } else {
            Taro.removeTabBarBadge({index: 2});
        }
        try {

            await LoginManager.getUserInfo(dispatch);

            const {userinfo, currentMerchantDetail} = self.props;
            UserAction.getMemberInfo(dispatch);
            const res = await UserAction.obtainCoupon();
            if (res.code == ResponseCode.success) {

                self.setState({obtainCouponList: res.data.rows})
            }
            const productTypeResult = await ProductAction.productInfoType(dispatch, {
                merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : BASE_PARAM.MCHID
            });
            invariant(productTypeResult.code === ResponseCode.success, productTypeResult.msg || ' ');
            const {data} = productTypeResult;
            const firstType = data[0] || {};
            self.changeCurrentType(firstType);
            await WeixinSdk.initAddress(dispatch, address);
            const param = {
                merchantId: BASE_PARAM.MCHIDFist,
                latitude: self.props.address.latitude,
                longitude: self.props.address.longitude
            }
            const resMear = await MerchantAction.merchantList(dispatch, param, currentMerchantDetail);
            if(resMear.data.total === 0){
                Taro.showModal({
                    title: '',
                    content: '该地址无法配送，请选择其他收货地址',
                    showCancel: false,
                    confirmText: '去选择',
                    confirmColor: '#2a86fc',
                    success: function(res) {
                        if (res.confirm) {
                            Taro.navigateTo({
                                url: `/pages/address/address.change.index`
                            });
                        } 
                    }
                })
                // self.setState({
                //     chooseAddressModal: true,
                // })
            } else {
                // self.setState({
                //     chooseAddressModal: false,
                // })
            }
        } catch (error) {
            Taro.showToast({
                title: error.message,
                icon: 'none'
            });
        }
    }
    changeRefrash () {
        UserAction.getMemberInfo(this.props.dispatch);
        const total = this.getCartTotal() ;
        if (total !== 0) {
            Taro.setTabBarBadge({
                index: 2,
                text: `${total}`
            });
        } else {
            Taro.removeTabBarBadge({index: 2});
        }
        
        Taro.getStorage({key: 'CentermOAuthTokenCostom'})
            .then(data => {
              if (data.data === '') {
                const {dispatch} = this.props;
                LoginManager.logout(dispatch);
              }
            })
    }
    getCartTotal () {
        const {productCartList} = this.props;
        let total = 0;
        productCartList.forEach(element => {
            total += element.sellNum;
        });
        return total;
    }
    onPullDownRefresh () {
        this.initDit();
        setTimeout(() => Taro.stopPullDownRefresh(),100)

    }
    componentWillUnmount () {
        this.setState({
            obtainCouponList: [],
            chooseAddressModal: false,
        })
        
    }
    handleClose () {
        this.setState({
            showStore: false
        })
    }
    public changeCurrentType = (typeInfo: any, fetchProduct: boolean = true) => {
        this.setState({currentType: typeInfo}, async () => {
            if (fetchProduct) {
                this.fetchData(typeInfo);
            }
        });
    }

    public initAddress = async () => {
        /**
         * @todo 判断当前
         */
    }
    changeModalStroe = (type) => {
        this.setState({
            showStore: type
        })
    }
    public init = async (firstTime?: boolean): Promise<void> => {
        const {dispatch, address} = this.props;
        try {

            await LoginManager.getUserInfo(dispatch);

            const {userinfo, currentMerchantDetail} = this.props;
            if (firstTime && userinfo.phone && userinfo.phone.length > 0) {
                UserAction.getMemberInfo(dispatch);
                const res = await UserAction.obtainCoupon();
                if (res.code == ResponseCode.success) {

                    this.setState({obtainCouponList: res.data.rows})
                }
            }
            const productTypeResult = await ProductAction.productInfoType(dispatch, {
                merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : BASE_PARAM.MCHID
            });
            invariant(productTypeResult.code === ResponseCode.success, productTypeResult.msg || ' ');
            const {data} = productTypeResult;
            const firstType = data[0] || {};
            if (firstTime) {
                this.changeCurrentType(firstType);
            }
            await WeixinSdk.initAddress(dispatch, address);
            const param = {
                merchantId: BASE_PARAM.MCHIDFist,
                latitude: this.props.address.latitude,
                longitude: this.props.address.longitude
            }
            const resMear = await MerchantAction.merchantList(dispatch, param, currentMerchantDetail);
            if(resMear && resMear.data && resMear.data.total === 0){
                // this.setState({
                //     chooseAddressModal: true,
                // })
                Taro.showModal({
                    title: '',
                    content: '该地址无法配送，请选择其他收货地址',
                    // showCancel: false,
                    confirmText: '去选择',
                    confirmColor: '#2a86fc',
                    success: function(res) {
                        if (res.confirm) {
                            Taro.navigateTo({
                                url: `/pages/address/address.change.index`
                            });
                        } 
                    }
                })
            } else {
                console.log(resMear,'resMear');
                
                // this.setState({
                //     chooseAddressModal: false,
                // })
            }
        } catch (error) {
            Taro.showToast({
                title: error.message,
                icon: 'none'
            });
        }
    }

    /**
     * @todo [点击菜单的时候修改当前菜单并跳转至对应商品]
     *
     * @memberof ProductOrder
     */
    public onTypeClick = (params: ProductInterface.ProductTypeInfo) => {
        this.common.changeTypeFlag = true;
        this.changeCurrentType(params);
    }

    public fetchData = async (type: any) => {
        const {currentMerchantDetail, dispatch} = this.props;
        this.setState({loading: true});
        const result = await ProductAction.productInfoList(dispatch, {
            type: `${type.id}`,
            status: 0,
            saleType: 0,
            merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : BASE_PARAM.MCHID
        } as any);
        if (this.common.changeTypeFlag) {
            this.common.changeTypeFlag = false;
            this.common.refreshFlag = true;
            if (!result || !result.data || !Array.isArray(result.data.rows)) {
                this.common.refreshFlag = false;
            }
        }
        this.setState({loading: false});
        return result;
    }

    public onScrollToLower = async () => {
        const {currentType} = this.state;
        const {productType} = this.props;
        for (let i = 0; i < productType.length; i++) {
            if (currentType.id === productType[i].id && (i !== productType.length - 1)) {
                this.onTypeClick(productType[i + 1]);
                break;
            }
        }
    }

    public getTabs = (tabs: any[]) => {
        const {currentType} = this.state;
        let newTabs = [...tabs];
        newTabs.unshift({id: currentType.id, name: '全部'});
        return newTabs;
    }

    public onScroll = (event: any) => {
        const {detail} = event;
        const {scrollTop} = detail;
        const { refreshFlag } = this.common;
        if (refreshFlag) {
            if (!this.common.timeoutFlag) {
                this.common.timeoutFlag = true;
                setTimeout(() => {
                    this.common.timeoutFlag = false;
                    this.common.refreshFlag = false;
                }, 200);
            }
            return;
        }
        if (Number(scrollTop) >= 50) {
            if (this.state.showActivity === true) {
                this.setState({showActivity: false});
            }
        } else {
            if (Number(scrollTop) <= 10) {
                this.setState({showActivity: true});
            }
        }
    }
    public CouponisNew = (list: any) => {
        let isNew = false;
        let hasGet = false;
        list.forEach(element => {
            if(`${element.couponVO.obtainWay}` === '1'){
                isNew = true;   
            }
            if(`${element.couponVO.obtainWay}` === '0'){
                hasGet = true;   
            }
        });
        return {isNew, hasGet };
    }
    public GetobtainCoupons = async (list: any) => {
        const {dispatch} = this.props;
        const couponIdList = list.map(val => val.couponId);
        try {
            const param = {
                couponIdList: couponIdList
            }
            const res = await UserAction.GetobtainCoupons(param);
            if (res.code == ResponseCode.success) {
                UserAction.getMemberInfo(dispatch);
                Taro.showToast({
                    title: '领取成功',
                    icon: 'success'
                });
                return true;
            }
            return false;
        } catch (error) {
            Taro.showToast({
                title: error.message,
                icon: 'none'
            });
            return false;
        }
    }
    
    render() {
        const {currentType, loading, showActivity, obtainCouponList, showStore, chooseAddressModal} = this.state;
        const {productList, productType, advertisement, userinfo, merchantList, currentMerchantDetail, dispatch} = this.props;
        const isNew = this.CouponisNew(obtainCouponList);
        const {changeRefrash, getNewData} = this;
        return (
            <View className={`container ${cssPrefix}`}>
                <IndexAddress initDit={this.initDit} changeModalStroe={process.env.TARO_ENV === 'weapp' ? this.changeModalStroe : () => {}}/>
                {/* <ScrollView scrollY={true}> */}
                {
                    showActivity && (
                        <View className={`${cssPrefix}-activity`}>
                            {userinfo && userinfo.phone && userinfo.phone.length > 0 &&
                            <DiscountInfo/>
                            }
                            {
                                advertisement && advertisement.length > 0 && (
                                    <Banner advertisement={advertisement}/>
                                )
                            }
                        </View>
                    )
                }
                <View className={`${cssPrefix}-list-container-costom`}>
                    <ProductMenu
                        menu={productType}
                        currentMenu={currentType}
                        onClick={(type) => this.onTypeClick(type)}
                    />
                    <View className={`${cssPrefix}-list-right`}>
                        <View className={`${cssPrefix}-list-right-types`}>
                            {
                                currentType && currentType.subCategory && currentType.subCategory.length > 0 ? (
                                    <View className={`${cssPrefix}-list-right-types-secondary`}>
                                        <TabsChoose
                                            tabs={this.getTabs(currentType.subCategory)}
                                            onChange={(type) => {
                                                this.fetchData(type)
                                            }}
                                            currentType={currentType}
                                        />
                                    </View>
                                ) : (
                                    <View
                                        className={`${cssPrefix}-list-right-header product-component-section-header-height`}>
                                        <View className={`${cssPrefix}-list-right-header-bge`}/>
                                        <Text
                                            className={`${cssPrefix}-list-right-header-text`}>{currentType.name}</Text>
                                    </View>
                                )
                            }
                        </View>
                        <ProductListView
                            loading={loading}
                            productList={productList}
                            className={ `${cssPrefix}-list-right-container`}
                            onScroll={this.onScroll}
                            ismenu={true}
                        // onScrollToLower={this.onScrollToLower}
                    />
                </View>
            </View>
    {/* </ScrollView> */}
        {
            process.env.TARO_ENV === 'weapp' ? (
                <AtFloatLayout className={`switchStore`} isOpened={showStore} title="这是个标题" onClose={this.handleClose.bind(this)}>
                    <View className={`switchStore-b`}>
                    {
                        merchantList.map((merch, indexM) => {
                            return (
                                <View 
                                    className={`switchStore-wrap ${indexM === 0 ? 'switchStore-wrap-top' : ''}  `}
                                    onClick={() => {
                                        dispatch({
                                            type: MerchantInterfaceMap.reducerInterface.RECEIVE_CURRENT_MERCHANT_DETAIL,
                                            payload: merch
                                        });
                                        ProductSDK.changeStoreCart(merch.id, dispatch);
                                        getNewData(this);
                                
                                        this.setState({
                                            showStore: false
                                        })
                                    }}
                                >
                                    <View className={`switchStore-card ${currentMerchantDetail.id === merch.id ? 'switchStore-card-active' : ''}`}>
                                        <View className={`switchStore-card-name ${ currentMerchantDetail.id === merch.id ? 'switchStore-card-txt-active' : ''}`}>
                                            {merch.name} 
                                            <View className={`switchStore-card-distanceStr ${ currentMerchantDetail.id === merch.id ? 'switchStore-card-txt-active' : ''}`}>{merch.distanceStr}</View></View>
                                    </View>
                                </View>
                            );
                        })
                    }
                    </View>
                </AtFloatLayout>
            ) : null
        }
        {
            <AtModal closeOnClickOverlay={false} isOpened={chooseAddressModal}>
                <AtModalContent>
                <View  className={'chooseAddressModal'}>该地址无法配送，请选择其他收货地址</View>
                </AtModalContent>
                <AtModalAction><Button onClick={() => { Taro.navigateTo({
                    url: `/pages/address/address.change.index`
                    });}}>去选择地址</Button> </AtModalAction>
            </AtModal>
        }
        <CouponModal
            isOpen={obtainCouponList.length > 0}
            onClose={() => {
                this.setState({obtainCouponList: []});
            }}
            onItemClick={(list: any)=>{
                if(isNew){
                    const res = this.GetobtainCoupons(list)
                    return res;
                }
                return false;
            }}
            couponList={obtainCouponList || []}
            isNew={isNew.isNew}
            hasGet={isNew.hasGet}
        />
    </View>
    )
    }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

const select = (state) => {
    return {
        productType: state.product.productType,
        merchantList: getMerchantList(state),
        productList: state.product.productList,
        productCartList: getProductCartList(state),
        advertisement: getMerchantAdvertisement(state),
        currentMerchantDetail: getCurrentMerchantDetail(state),
        userinfo: getUserinfo(state),
        memberInfo: getMemberInfo(state),
        address: getIndexAddress(state)
    }
}

export default connect(select)(Index);
