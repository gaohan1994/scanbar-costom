import Taro, {Config} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import '../style/product.less'
import '../style/order.less'
import ProductPayListView from '../../component/product/product.pay.listview'
import {AppReducer} from '../../reducers'
import productSdk, {ProductCartInterface} from '../../common/sdk/product/product.sdk'
import CartFooter from '../../component/cart/cart.footer'
import numeral from 'numeral'
import PickAddress from './component/address'
import invariant from 'invariant'
import dayJs from 'dayjs'
import {ResponseCode, OrderInterface, UserInterface, ProductService} from '../../constants'
import FormCard from '../../component/card/form.card'
import {AtFloatLayout} from 'taro-ui'
import ProductMenu from '../../component/product/product.menu'
import classnames from 'classnames';
import orderAction from '../../actions/order.action'
import merchantAction from '../../actions/merchant.action';
import { getMemberInfo } from '../../reducers/app.user';
import { Dispatch } from 'redux';
import { getCurrentMerchantDetail, getOrderPayType } from '../../reducers/app.merchant';
import { getOrderDetail, getDeliveryFee, getOrderCompute } from '../../reducers/app.order';
import { UserAction } from '../../actions'
import { getProductCartList } from '../../common/sdk/product/product.sdk.reducer';
import {BASE_PARAM} from '../../common/util/config';
 
const cssPrefix = 'order';
const openTime = 8;
const closeTime = 24;

type Props = {
    dispatch: Dispatch;
    orderPayType: any;
    currentMerchantDetail: any;
    payOrderProductList: Array<ProductCartInterface.ProductCartInfo>;
    payOrderAddress: UserInterface.Address;
    payOrderDetail: any;
    productCartList: any;
    orderDetail: any;
    activityList: any;
    memberInfo: any;
    OrderCompute: any;
    productSDKObj: any;
    DeliveryFee: any;
}

type State = {
    showTimeSelect: boolean;
    currentDate: any;
    selectDate: any;
    isFirst: boolean;
    selectTime: string;
    timeList: string[];
    dateList: OrderInterface.DateItem;
    isOnClick: boolean;
}

class Page extends Taro.Component<Props, State> {
    onRefProductPayListViewObj;
    config: Config = {
        navigationBarTitleText: '确认订单'
    }

    state = {
        isOpen: false,
        isFirst: true,
        showTimeSelect: false,
        currentDate: {} as any,
        selectDate: {} as any,
        selectTime: '',
        timeList: [],
        dateList: [] as any,
        isOnClick: true,
    }

    componentDidMount() {
        const {dispatch, currentMerchantDetail, payOrderDetail, payOrderAddress, DeliveryFee} = this.props;
        merchantAction.activityInfoList(dispatch, currentMerchantDetail.id);
        this.getDateList();
        const {payOrderProductList, activityList, memberInfo, productSDKObj} = this.props;
        let productIds: any[] = [];

        try {
            for (let i = 0; i < payOrderProductList.length; i++) {
                productIds.push(payOrderProductList[i].id)
            }
        } catch (error) {
            // console.log(error);
        }
        const params = {
            productIds: productIds,
            merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : BASE_PARAM.MCHID,
            amount: productSdk.getProductTransPrice(activityList, memberInfo, productSDKObj.productCartList, payOrderProductList)
        };
        orderAction.getAbleToUseCoupon(dispatch, params);
        UserAction.getMemberInfo(this.props.dispatch);
        orderAction.getPointConfig(this.props.dispatch);
        this.getComputeData(this.props);
        // /api/cashier/compute
        
    }
    componentWillReceiveProps = async (nextProps) => {
        const {dispatch, payOrderAddress, currentMerchantDetail} = nextProps;        
        if(payOrderAddress.id && this.state.isFirst === true) {
            const param = {
                latitude:  payOrderAddress.latitude,
                longitude: payOrderAddress.longitude,
                merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : BASE_PARAM.MCHID,
            }
            const result = await orderAction.getDeliveryFee(dispatch, param);
            if(result.code !== ResponseCode.success){
                productSdk.preparePayOrderAddress({}, dispatch);
            }
            this.getComputeData(nextProps, result.data);
            this.setState({
                isFirst: false
            })
        }
        if (this.props.payOrderDetail.selectedCoupon !== nextProps.payOrderDetail.selectedCoupon  || this.props.payOrderDetail.deliveryType !== nextProps.payOrderDetail.deliveryType ) {
            this.getComputeData(nextProps);
        }
    }

    getComputeData = (nextProps, deli?: any) => {
        const {payOrderProductList, memberInfo, DeliveryFee} = this.props;
        let ComputeList: any = [];
        try {
            for (let i = 0; i < payOrderProductList.length; i++) {
                ComputeList.push({
                    productId: payOrderProductList[i].id,
                    productName: payOrderProductList[i].name,
                    sellNum: payOrderProductList[i].sellNum,
                    unitPrice: productSdk.getProductItemPrice(payOrderProductList[i], memberInfo),
                })
            }
        } catch (error) {
            // console.log(error);
        }
        const paramsCompute = {
            productInfoList: ComputeList,
            order: {
                couponList: nextProps.payOrderDetail.selectedCoupon && nextProps.payOrderDetail.selectedCoupon.couponCode ? [nextProps.payOrderDetail.selectedCoupon.couponCode] : [],
                memberId: memberInfo.id,
                points: 0,
                deliveryFee: nextProps.payOrderDetail.deliveryType === 1 ? deli || DeliveryFee : 0
            }
        };
        if(payOrderProductList.length > 0){
            orderAction.getComputeMoney(this.props.dispatch, paramsCompute);
        }
        
    }
    public onSubmit = async () => {
        try {
            Taro.showLoading();

            const {payOrderAddress, payOrderProductList, payOrderDetail} = this.props;
            invariant(payOrderProductList.length > 0, '请选择要下单的商品')

            if (payOrderDetail && payOrderDetail.deliveryType === 1) {
                invariant(payOrderAddress.id, '请选择地址');
            }
            this.createOrder();

        } catch (error) {
            Taro.hideLoading();
            Taro.showToast({
                title: error.message,
                icon: 'none'
            })
        }
    }

    public createOrder = async () => {
        if(this.state.isOnClick){
            this.setState({
                isOnClick: false
            })
            try {
                const {payOrderAddress, payOrderProductList, payOrderDetail, activityList, memberInfo, productSDKObj, dispatch, DeliveryFee, orderPayType, currentMerchantDetail, OrderCompute} = this.props;
                const payload = productSdk.getProductInterfacePayload(currentMerchantDetail,activityList, memberInfo, payOrderProductList, payOrderProductList, payOrderAddress, payOrderDetail, productSDKObj.pointsTotal, productSDKObj.pointsTotalSell, DeliveryFee, orderPayType, OrderCompute);
                const result = await productSdk.cashierOrder(payload)
                invariant(result.code === ResponseCode.success, result.msg || ' ');
                Taro.hideLoading();
                const payment = await productSdk.requestPayment(result.data.order.orderNo, orderPayType, (res) => {
                })
                const callB  = () => {
                    
                    setTimeout(function(){
                        productSdk.cashierOrderCallback(dispatch, result.data, orderPayType);
                    
                        if(process.env.TARO_ENV === 'h5') {
                            Taro.redirectTo({
                                url: `/pages/order/order.detail?id=${result.data.order.orderNo || result.data.orderNo}`
                            });
                        } else {
                            Taro.navigateTo({
                                url: '/pages/orderList/order'
                            }).catch((error) => {
                                /* 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 */
                                const {order} = result.data;
                                Taro.redirectTo({
                                    url: `/pages/order/order.detail?id=${order.orderNo}`
                                });
                                // Taro.switchTab({url: '/pages/orderList/order'})
                            })
                            
                            
                        }
                        
                        this.setState({
                            isOnClick: true
                        })
                    }, 1000);
                    return;
                }
                if (payment.code === ResponseCode.success || payment.errMsg === "requestPayment:ok") {
                    if(payment.data && payment.data.msg === '余额不足') {
                        Taro.showModal({
                            title: "提示",
                            content: "余额不足，是否充值？",
                            success: function(res) {
                                if (res.confirm) {
                                    setTimeout(() => {
                                        if(process.env.TARO_ENV === 'h5'){
                                            Taro.redirectTo({
                                                url: `/pages/TopUp/TopUp?id=${result.data.order.orderNo || result.data.orderNo}`
                                            });
                                        } else {
                                            const {order} = result.data;
                                            Taro.redirectTo({
                                                url: `/pages/TopUp/TopUp?id=${order.orderNo}`
                                            });
                                        }
            
                                    }, 500);
            
                                    productSdk.cashierOrderCallbackOnly(dispatch, result.data, orderPayType);
                                    productSdk.preparePayOrderDetail({remark: '', selectedCoupon: {}}, dispatch)
                                    UserAction.getMemberInfo(dispatch);
                                    this.setState({
                                        isOnClick: true
                                    })
                                    return;
                                } else if (res.cancel) {
                                    callB();
                                }
                                
                            },

                        });
                        
                        
                    }  else {
                        if(orderPayType === 7){
                            Taro.showToast({
                                title: '储值支付成功',
                                icon: 'success',
                                duration: 2000
                            })
                        }
                        callB();
                    }
                    
                } else {
                   
                    productSdk.cashierOrderCallbackOnly(this.props.dispatch, result.data, orderPayType)
                        const {order} = result.data;
                        Taro.redirectTo({
                            url: `/pages/order/order.detail?id=${order.orderNo}`
                        });
                    productSdk.preparePayOrderDetail({remark: '', selectedCoupon: {}}, this.props.dispatch)
                    UserAction.getMemberInfo(this.props.dispatch);
                    this.setState({
                        isOnClick: true
                    })
                    
                }
                
            } catch (error) {
                Taro.hideLoading();
                Taro.showToast({
                    title: error.message,
                    icon: 'none'
                })
                this.setState({
                    isOnClick: true
                })
            }
        }
    }

    public onChangeValue = (key: string, value: any) => {
        if(process.env.TARO_ENV === 'h5'){
            const obj = this.state;
            obj[key] = value;
            this.setState(obj)
        } else {
            this.setState(prevState => {
                return {
                    ...prevState,
                    [key]: value
                };
            });
        }
    }

    onShowTimeSelect = () => {

        this.getDateList();
        this.setState({
            showTimeSelect: true
        })
    }

    onDateClick = (date: any) => {
        this.setState({currentDate: date}, () => {
            this.getTimeList();
        })
    }

    onTimeClick = (time: string) => {
        const {dispatch} = this.props;
        this.onChangeValue('selectTime', time);
        this.onChangeValue('showTimeSelect', false);
        const {currentDate} = this.state;
        this.onChangeValue('selectDate', currentDate);
        // if (selectTime !== '立即送出') {
            
        const selectTimeStr =
            `${(time === '立即自提' || time === '立即送出') ? '' : (currentDate.date || '')}${time !== '立即自提' && time !== '立即送出' ? ' ' : ''}${time}`;
        productSdk.preparePayOrderDetail({planDeliveryTime: selectTimeStr}, dispatch);
        // }
    }

    getTimeList = () => {
        const {currentDate, selectTime} = this.state;
        const {payOrderDetail, dispatch} = this.props;
        let timeList: string[] = [];
        if (currentDate.id === undefined) {
            return;
        }
        if (currentDate.id === 0) {
            if (payOrderDetail.deliveryType === 1) {
                timeList.push('立即送出');
            } else {
                timeList.push('立即自提');
            }
            const currentHour = dayJs().hour();
            const currentMinute = dayJs().minute();
            if (currentMinute < 30) {
                timeList.push(`${currentHour}:30 ~ ${currentHour + 1}:00`);
            }
            for (let i = currentHour + 1; i < closeTime; i++) {
                timeList.push(`${i}:00 ~ ${i}:30`);
                timeList.push(`${i}:30 ~ ${i + 1}:00`);
            }
        } else {
            for (let i = openTime; i < closeTime; i++) {
                timeList.push(`${i}:00 ~ ${i}:30`);
                timeList.push(`${i}:30 ~ ${i + 1}:00`);
            }
        }
        this.onChangeValue('timeList', timeList);
        if (
            selectTime === '' ||
            (selectTime === '立即自提' && payOrderDetail.deliveryType === 1) ||
            (selectTime === '立即送出' && payOrderDetail.deliveryType === 0)
        ) {
            this.onChangeValue('selectTime', timeList[0]);
            this.setState({selectTime: timeList[0]}, () => {
                const selectTimeStr =
                    `${(timeList[0] === '立即自提' || timeList[0] === '立即送出') ? '' : (currentDate.date || '')}${timeList[0] !== '立即自提' && timeList[0] !== '立即送出' ? ' ' : ''}${timeList[0]}`;
                productSdk.preparePayOrderDetail({planDeliveryTime: selectTimeStr}, dispatch);
            })
        }
    }

    getDateList = () => {
        const {currentDate} = this.state;
        const date = dayJs();
        const nextDate = dayJs().add(1, 'day');
        let dateList: any[] = [];
        const currentHour = dayJs().hour();
        if (currentHour >= closeTime) {
            dateList = [
                {
                    id: 1,
                    name: `明天（${nextDate.month() + 1}月${nextDate.date()}日）`,
                    date: `${nextDate.month() + 1}月${nextDate.date()}日`
                }
            ];
        } else {
            dateList = [
                {
                    id: 0,
                    name: `今天（${date.month() + 1}月${date.date()}日）`,
                    date: `${date.month() + 1}月${date.date()}日`
                },
                {
                    id: 1,
                    name: `明天（${nextDate.month() + 1}月${nextDate.date()}日）`,
                    date: `${nextDate.month() + 1}月${nextDate.date()}日`
                }
            ];
        }
        this.onChangeValue('dateList', dateList);
        if (currentDate.id === undefined) {
            this.setState({currentDate: dateList[0], selectDate: dateList[0]}, () => {
                this.getTimeList();
            });
        }
    }
    countTotal = () => {
        const {payOrderDetail, orderDetail, payOrderProductList, DeliveryFee } = this.props;
        const { order } = orderDetail;
        let total = 0;
        payOrderProductList.forEach((val) => {
            total += val.price * val.sellNum;
        })
        if(((payOrderDetail && payOrderDetail.deliveryType !== undefined && payOrderDetail.deliveryType === 1)
        || (order && order.deliveryType !== undefined && order.deliveryType === 1))){
            total += DeliveryFee;
        }
        return total;
    }
    onRefProductPayListView = (reset) => {
        this.onRefProductPayListViewObj = reset;
    }
    render() {
        const {payOrderProductList, payOrderDetail, activityList, memberInfo, productSDKObj, DeliveryFee, dispatch, OrderCompute} = this.props;
        const {showTimeSelect, currentDate, selectDate, selectTime, timeList, dateList} = this.state;
        const {countTotal, onRefProductPayListView, onRefProductPayListViewObj} = this;
        const price = payOrderProductList && payOrderProductList.length > 0
            ? numeral(productSdk.getProductTransPrice(activityList, memberInfo, productSDKObj.productCartList, payOrderProductList)).format('0.00')
            : '0.00';
        // let tarnsPrice = payOrderProductList && payOrderProductList.length > 0
        //     ? numeral(
        //         productSdk.getProductTransPrice(activityList, memberInfo, productSDKObj.productCartList,payOrderProductList)  -
        //         (payOrderDetail.selectedCoupon && payOrderDetail.selectedCoupon.couponVO ? payOrderDetail.selectedCoupon.couponVO.discount : 0)
        //     ).format('0.00')
        //     : '0.00';
        let tarnsPrice = `${numeral(OrderCompute.orderComputeBO && OrderCompute.orderComputeBO.transAmount).format('0.00')}`
        // if(numeral(tarnsPrice).value() < 0 ){
        //     tarnsPrice = numeral(payOrderDetail.deliveryType === 1 ? DeliveryFee : 0).format('0.00')
        // } else {
        //     tarnsPrice = numeral(numeral(tarnsPrice).value() +(payOrderDetail.deliveryType === 1 ? DeliveryFee : 0)).format('0.00')
        // }
        if(productSDKObj.pointsTotal){
            tarnsPrice = numeral(numeral(tarnsPrice).value() - productSDKObj.pointsTotal).format('0.00');
        }
        let priceDiscountPay = countTotal() - numeral(tarnsPrice).value();
 
        const selectTimeStr = (selectTime === '立即送出' || selectTime === '立即自提') ? selectTime : `${selectDate.date || ''} ${selectTime}`;

        return (
            <View className='container container-color' style={{backgroundColor: '#f2f2f2', height: 'auto'}}>
                <View className={`${cssPrefix}-bg`}/>
                <PickAddress
                    isPay={true}
                    timeSelectClick={() => {
                        this.onShowTimeSelect();
                    }}
                    currentTime={`${selectTimeStr}`}
                    changeTabCallback={() => {
                        this.getTimeList();
                        this.getComputeData(this.props);
                    }}
                    // onRefProductPayListViewObj={onRefProductPayListViewObj}
                />
                {
                    payOrderDetail.deliveryType === 0 ? (
                        <ProductPayListView
                            DeliveryFee={DeliveryFee}
                            productList={payOrderProductList}
                            payOrderDetail={payOrderDetail}
                            productSDKObj={productSDKObj}
                            OrderCompute={OrderCompute}
                            // onRef={onRefProductPayListView}
                        />
                    ) : (
                        <ProductPayListView
                            DeliveryFee={DeliveryFee}
                            payOrderDetail={payOrderDetail}
                            productList={payOrderProductList}
                            productSDKObj={productSDKObj}
                            OrderCompute={OrderCompute}
                            // onRef={onRefProductPayListView}
                        />
                    )
                }
                
                <View className={`${cssPrefix}-remark`}>
                    <View className={`${cssPrefix}-remark-card`}>
                        <FormCard
                            items={[{
                                title: '备注',
                                onClick: () => {
                                    Taro.navigateTo({
                                        url: `/pages/order/order.pay.remark`
                                    })
                                },
                                extraText: payOrderDetail && payOrderDetail.remark ? payOrderDetail.remark : '请输入备注信息',
                                extraTextColor: payOrderDetail && payOrderDetail.remark ? '#333333' : '#CCCCCC',
                                arrow: 'right',
                                hasBorder: false,
                                extraTextStyle: 'maxWidth',
                                isRemark: true
                            }]}
                        />
                    </View>


                </View>
                <View style='width: 100%; height: 100px' className={'container-color'}/>
                <CartFooter
                    dispatch={this.props.dispatch}
                    productCartList={productSDKObj.productCartList}
                    buttonTitle={'提交订单'}
                    buttonClick={() => this.onSubmit()}
                    priceTitle={'合计：'}
                    priceSubtitle='￥'
                    price={tarnsPrice}
                    priceOrigin={OrderCompute.orderComputeBO && OrderCompute.orderComputeBO.totalAmount}
                    priceDiscountPay={OrderCompute.orderComputeBO  && OrderCompute.orderComputeBO.discount}
                />
                <AtFloatLayout
                    isOpened={showTimeSelect}
                    title={`选择${payOrderDetail.deliveryType === 0 ? '自提' : '配送'}时间`}
                    onClose={() => {
                        this.setState({showTimeSelect: false})
                    }
                    }>
                    <View className={process.env.TARO_ENV === 'h5' ? `${cssPrefix}-modal-h5` : `${cssPrefix}-modal`}>
                        <ProductMenu
                            menu={dateList}
                            currentMenu={currentDate}
                            onClick={(type: any) => {
                                this.onDateClick(type);
                            }}
                            className={process.env.TARO_ENV === 'h5' ? `${cssPrefix}-modal-h5-menu` : `${cssPrefix}-modal-menu`}
                        />

                        <ScrollView scrollY={true} className={`${cssPrefix}-modal-list`}>
                            {
                                timeList && timeList.length > 0 && timeList.map((time: string) => {
                                    return (
                                        <View
                                            onClick={() => {
                                                this.onTimeClick(time)
                                            }}
                                            className={classnames(`${process.env.TARO_ENV === 'h5' ? `${cssPrefix}-modal-h5-list-item` : `${cssPrefix}-modal-list-item`} `, {
                                                [`${cssPrefix}-modal-list-select`]: selectTime === time,
                                            })}
                                        >
                                            {time}
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </AtFloatLayout>
            </View>
        )
    }
}

const select = (state: AppReducer.AppState) => {
    return {
        DeliveryFee: getDeliveryFee(state),
        OrderCompute: getOrderCompute(state),
        orderPayType: getOrderPayType(state),
        payOrderProductList: state.productSDK.payOrderProductList,
        payOrderAddress: state.productSDK.payOrderAddress,
        payOrderDetail: state.productSDK.payOrderDetail,
        orderDetail: getOrderDetail(state),
        productCartList: getProductCartList(state),
        activityList: state.merchant.activityList,
        currentMerchantDetail: getCurrentMerchantDetail(state),
        memberInfo: getMemberInfo(state),
        productSDKObj: state.productSDK,
    }
}
export default connect(select)(Page);