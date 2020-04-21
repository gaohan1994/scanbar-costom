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

const cssPrefix = 'order';
const openTime = 8;
const closeTime = 24;

type Props = {
    payOrderProductList: Array<ProductCartInterface.ProductCartInfo>;
    payOrderAddress: UserInterface.Address;
    payOrderDetail: any;
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
        merchantAction.activityInfoList();
        this.getDateList();
        const {payOrderProductList} = this.props;
        let productIds: any[] = [];
        for (let i = 0; i < payOrderProductList.length; i++) {
            productIds.push(payOrderProductList[i].id)
        }
        const params = {
            productIds: productIds,
            amount: productSdk.getProductTransPrice(payOrderProductList)
        };
        orderAction.getAbleToUseCoupon(params);
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
            const {payOrderAddress, payOrderProductList, payOrderDetail} = this.props;
            const payload = productSdk.getProductInterfacePayload(
                payOrderProductList,
                payOrderAddress,
                {
                    ...payOrderDetail,
                    // delivery_time: dayJs().format('YYYY-MM-DD HH:mm:ss'),
                }
            );
            const result = await productSdk.cashierOrder(payload)
            console.log('result', result)
            invariant(result.code === ResponseCode.success, result.msg || ' ');
            Taro.hideLoading();
            const payment = await productSdk.requestPayment(result.data.order.orderNo, (res) => {
            })
            console.log('payment: ', payment)
            if (payment.errMsg !== 'requestPayment:ok') {
                productSdk.cashierOrderCallback(result.data);
                Taro.navigateTo({
                    url: '/pages/orderList/order'
                }).catch((error) => {
                    console.log(error)
                    /* 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 */
                    Taro.switchTab({url: '/pages/orderList/order'})
                })
                return;
            }
            productSdk.cashierOrderCallback(result.data)
            productSdk.preparePayOrderDetail({remark: '', selectedCoupon: {}})
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
        this.onChangeValue('showTimeSelect', true);
        this.getDateList();
    }

    onDateClick = (date: any) => {
        this.setState({currentDate: date}, () => {
            this.getTimeList();
        })
    }

    onTimeClick = (time: string) => {
        this.onChangeValue('selectTime', time);
        this.onChangeValue('showTimeSelect', false);
        const {currentDate} = this.state;
        this.onChangeValue('selectDate', currentDate);
        // if (selectTime !== '立即送出') {
        const selectTimeStr =
            `${(time === '立即自提' || time === '立即送出') ? '' : (currentDate.date || '')}${time !== '立即自提' && time !== '立即送出' ? ' ' : ''}${time}`;
        productSdk.preparePayOrderDetail({planDeliveryTime: selectTimeStr});
        // }
    }

    getTimeList = () => {
        const {currentDate, selectTime} = this.state;
        const {payOrderDetail} = this.props;
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
                productSdk.preparePayOrderDetail({planDeliveryTime: selectTimeStr});
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

    render() {
        const {payOrderProductList, payOrderDetail} = this.props;
        const {showTimeSelect, currentDate, selectDate, selectTime, timeList, dateList} = this.state;
        const price = payOrderProductList && payOrderProductList.length > 0
            ? numeral(productSdk.getProductTransPrice(payOrderProductList)).format('0.00')
            : '0.00';
        const tarnsPrice = payOrderProductList && payOrderProductList.length > 0
            ? numeral(
                productSdk.getProductTransPrice(payOrderProductList) +
                (payOrderDetail.deliveryType === 1 ? 3.5 : 0) -
                (payOrderDetail.selectedCoupon && payOrderDetail.selectedCoupon.couponVO ? payOrderDetail.selectedCoupon.couponVO.discount : 0)
            ).format('0.00')
            : '0.00';
        const selectTimeStr = (selectTime === '立即送出' || selectTime === '立即自提') ? selectTime : `${selectDate.date || ''} ${selectTime}`;
        return (
            <View className='container container-color' style={{backgroundColor: '#f2f2f2'}}>
                <View className={`${cssPrefix}-bg`}/>
                <PickAddress
                    timeSelectClick={() => {
                        this.onShowTimeSelect()
                    }}
                    currentTime={`${selectTimeStr}`}
                    changeTabCallback={this.getTimeList}
                />
                <ProductPayListView
                    productList={payOrderProductList}
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
                />
                <AtFloatLayout
                    isOpened={showTimeSelect}
                    title={`选择${payOrderDetail.deliveryType === 0 ? '自提' : '配送'}时间`}
                    onClose={() => {
                        this.setState({showTimeSelect: false})
                    }
                    }>
                    <View className={`${cssPrefix}-modal`}>
                        <ProductMenu
                            menu={dateList}
                            currentMenu={currentDate}
                            onClick={(type: any) => {
                                this.onDateClick(type);
                            }}
                            className={`${cssPrefix}-modal-menu`}
                        />

                        <ScrollView scrollY={true} className={`${cssPrefix}-modal-list`}>
                            {
                                timeList && timeList.length > 0 && timeList.map((time: string) => {
                                    return (
                                        <View
                                            onClick={() => {
                                                this.onTimeClick(time)
                                            }}
                                            className={classnames(`${cssPrefix}-modal-list-item `, {
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
        payOrderProductList: state.productSDK.payOrderProductList,
        payOrderAddress: state.productSDK.payOrderAddress,
        payOrderDetail: state.productSDK.payOrderDetail,
    }
}
export default connect(select)(Page);