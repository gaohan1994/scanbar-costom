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
import {ResponseCode, OrderInterface, UserInterface} from '../../constants'
import FormCard from '../../component/card/form.card'
import {AtFloatLayout} from 'taro-ui'
import ProductMenu from '../../component/product/product.menu'
import classnames from 'classnames';
import orderAction from '../../actions/order.action'
import merchantAction from '../../actions/merchant.action';
import { getMemberInfo } from '../../reducers/app.user';
import { Dispatch } from 'redux';
import { getCurrentMerchantDetail } from '../../reducers/app.merchant';
import { getPointConfig } from '../../reducers/app.order';

const cssPrefix = 'order';
const openTime = 8;
const closeTime = 24;

type Props = {
    dispatch: Dispatch;
    currentMerchantDetail: any;
    payOrderProductList: Array<ProductCartInterface.ProductCartInfo>;
    payOrderAddress: UserInterface.Address;
    payOrderDetail: any;
    activityList: any;
    memberInfo: any;
    productSDKObj: any;
    getPointConfig: any;
}

type State = {
    showTimeSelect: boolean;
    currentDate: any;
    selectDate: any;
    selectTime: string;
    timeList: string[];
    dateList: OrderInterface.DateItem;
}

class Page extends Taro.Component<Props, State> {

    config: Config = {
        navigationBarTitleText: '确认订单'
    }

    state = {
        isOpen: false,
        showTimeSelect: false,
        currentDate: {} as any,
        selectDate: {} as any,
        selectTime: '',
        timeList: [],
        dateList: [] as any,
    }

    componentDidMount() {
        const {dispatch, currentMerchantDetail} = this.props;
        merchantAction.activityInfoList(dispatch, currentMerchantDetail.id);
        this.getDateList();
        const {payOrderProductList, activityList, memberInfo, productSDKObj} = this.props;
        let productIds: any[] = [];
        for (let i = 0; i < payOrderProductList.length; i++) {
            productIds.push(payOrderProductList[i].id)
        }
        const params = {
            productIds: productIds,
            amount: productSdk.getProductTransPrice(activityList, memberInfo, productSDKObj.productCartList, payOrderProductList)
        };
        orderAction.getAbleToUseCoupon(dispatch, params);
        orderAction.getPointConfig(dispatch);
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
        try {
            const {payOrderAddress, payOrderProductList, payOrderDetail, activityList, memberInfo, productSDKObj, dispatch} = this.props;
            const payload = productSdk.getProductInterfacePayload(productSDKObj.currentMerchantDetail,activityList, memberInfo, payOrderProductList, payOrderProductList, payOrderAddress, payOrderDetail, productSDKObj.pointsTotal);

            const result = await productSdk.cashierOrder(payload)

            invariant(result.code === ResponseCode.success, result.msg || ' ');
            Taro.hideLoading();
            const payment = await productSdk.requestPayment(result.data.order.orderNo, (res) => {
            })
            if (payment.errMsg !== 'requestPayment:ok') {
                productSdk.cashierOrderCallback(this.props.dispatch, result.data);
                Taro.navigateTo({
                    url: '/pages/orderList/order'
                }).catch((error) => {sss
                    /* 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 */
                    Taro.switchTab({url: '/pages/orderList/order'})
                })
                return;
            }
            productSdk.cashierOrderCallback(dispatch, result.data)
            productSdk.preparePayOrderDetail({remark: '', selectedCoupon: {}}, dispatch)
        } catch (error) {
            Taro.hideLoading();

            Taro.showToast({
                title: error.message,
                icon: 'none'
            })
        }
    }

    public onChangeValue = (key: string, value: any) => {
        this.setState(prevState => {
            return {
                ...prevState,
                [key]: value
            };
        });
    }

    onShowTimeSelect = () => {
        this.getDateList();
        this.onChangeValue('showTimeSelect', true);
    }

    onDateClick = (date: any) => {
        this.setState({currentDate: date}, () => {
            this.getTimeList();
        })
    }

    onTimeClick = (time: string) => {
        const {dispatch} = this.props;
        const {currentDate} = this.state;
        // this.onChangeValue('selectTime', time);
        // this.onChangeValue('selectDate', currentDate);
        this.setState({
            selectTime: time,
            selectDate: currentDate
        })
        // if (selectTime !== '立即送出') {
        const selectTimeStr =
            `${(time === '立即自提' || time === '立即送出') ? '' : (currentDate.date || '')}${time !== '立即自提' && time !== '立即送出' ? ' ' : ''}${time}`;
        productSdk.preparePayOrderDetail({planDeliveryTime: selectTimeStr}, dispatch);
        // }
        this.onChangeValue('showTimeSelect', false);
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
        // this.onChangeValue('timeList', timeList);

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
        this.setState({
            timeList: timeList
        })
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
        const {payOrderProductList} = this.props;
        let total = 0;
        payOrderProductList.forEach((val) => {
            total += val.price;
        })
        return total;
    }
    render() {
        const {payOrderProductList, payOrderDetail, activityList, memberInfo, productSDKObj,} = this.props;
        const {showTimeSelect, currentDate, selectDate, selectTime, timeList, dateList} = this.state;
        const price = payOrderProductList && payOrderProductList.length > 0
            ? numeral(productSdk.getProductTransPrice(activityList, memberInfo, productSDKObj.productCartList, payOrderProductList)).format('0.00')
            : '0.00';
        let tarnsPrice = payOrderProductList && payOrderProductList.length > 0
            ? numeral(
                productSdk.getProductTransPrice(activityList, memberInfo, productSDKObj.productCartList,payOrderProductList) +
                (payOrderDetail.deliveryType === 1 ? 3.5 : 0) -
                (payOrderDetail.selectedCoupon && payOrderDetail.selectedCoupon.couponVO ? payOrderDetail.selectedCoupon.couponVO.discount : 0)
            ).format('0.00')
            : '0.00';
        if(productSDKObj.pointsTotal){
            tarnsPrice = numeral(numeral(tarnsPrice).value() - productSDKObj.pointsTotal).format('0.00');
        }
        console.log('activityList, memberInfo, productSDKObj.productCartList,payOrderProductList', activityList, memberInfo, productSDKObj.productCartList,payOrderProductList);
        const priceDiscountPay = this.countTotal() - numeral(tarnsPrice).value();

        // const selectTimeStr = (selectTime === '立即送出' || selectTime === '立即自提') ? selectTime : `${selectDate.date || ''} ${selectTime}`;
        return (
            <View className='container container-color' style={{backgroundColor: '#f2f2f2', height: 'auto'}}>
                <View className={`${cssPrefix}-bg`}/>
                <PickAddress
                    timeSelectClick={() => {
                        this.onShowTimeSelect()
                    }}
                    currentTime={`${payOrderDetail.planDeliveryTime}`}
                    changeTabCallback={this.getTimeList}
                />
                <ProductPayListView
                    productList={payOrderProductList}
                    payOrderDetail={payOrderDetail}
                    isPay={true}
                    
                />
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
                            }]}
                        />
                    </View>


                </View>
                <View style='width: 100%; height: 100px' className={'container-color'}/>
                <CartFooter
                    buttonTitle={'提交订单'}
                    buttonClick={() => this.onSubmit()}
                    priceTitle={'合计：'}
                    priceSubtitle='￥'
                    price={tarnsPrice}
                    priceOrigin={price}
                    priceDiscountPay={priceDiscountPay}
                />
                <AtFloatLayout
                    isOpened={showTimeSelect}
                    className={process.env.TARO_ENV === 'h5' ? `${cssPrefix}-modal-h5-layout` : ''}
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

                        <ScrollView scrollY={true} className={process.env.TARO_ENV === 'h5' ? `${cssPrefix}-modal-h5-list` :`${cssPrefix}-modal-list`}>
                            {
                                timeList && timeList.length > 0 && timeList.map((time: string) => {
                                    return (
                                        <View
                                            onClick={() => {
                                                this.onTimeClick(time)
                                            }}
                                            className={classnames(process.env.TARO_ENV === 'h5' ? `${cssPrefix}-modal-h5-list-item` :`${cssPrefix}-modal-list-item `, {
                                                [process.env.TARO_ENV === 'h5' ? `${cssPrefix}-modal-h5-list-select` :`${cssPrefix}-modal-list-select`]: selectTime === time,
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
        payOrderProductList: state.productSDK.payOrderProductList,
        payOrderAddress: state.productSDK.payOrderAddress,
        payOrderDetail: state.productSDK.payOrderDetail,
        activityList: state.merchant.activityList,
        currentMerchantDetail: getCurrentMerchantDetail(state),
        memberInfo: getMemberInfo(state),
        productSDKObj: state.productSDK,
        getPointConfig: getPointConfig(state),
    }
}
export default connect(select)(Page);