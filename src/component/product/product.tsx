import Taro from '@tarojs/taro';
import {View, Image, Text} from '@tarojs/components';
import './product.less';
import {ProductInterface} from '../../constants';
import {connect} from '@tarojs/redux';
import {AppReducer} from '../../reducers';
import productSdk, {ProductCartInterface} from '../../common/sdk/product/product.sdk';
import {getMemberInfo} from '../../reducers/app.user'
import classnames from 'classnames';
import numeral from 'numeral';
import { Dispatch } from 'redux';

const cssPrefix = 'component-product';

interface Props {
    dispatch: Dispatch;
    ismenu?: boolean;
    product: ProductInterface.ProductInfo;
    direct?: boolean;
    productInCart?: ProductCartInterface.ProductCartInfo;
    last?: boolean;
    activityList: any;
    memberInfo: any;
    productSDKObj: any;
    isHome?: boolean;
    isCart?: boolean;
    selectedIndex?: number[];
    selectClick?: () => void;
}

interface State {
    priceModal: boolean;
    changePrice: string;
    changeSellNum: string;
}

class ProductComponent extends Taro.Component<Props, State> {

    defaultProps = {
        direct: false
    }

    static options = {
        addGlobalClass: true
    }

    state = {
        priceModal: false,
        changePrice: '',
        changeSellNum: '',
    };

    public changeValue = (key: string, value: string) => {
        this.setState(prevState => {
            return {
                ...prevState,
                [key]: value
            };
        });
    }

    public manageProduct = (type: ProductCartInterface.ProductCartAdd | ProductCartInterface.ProductCartReduce, e: any) => {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        const {product, dispatch, productSDKObj} = this.props;
        productSdk.manage(dispatch, productSDKObj, {type, product});
    }

    public onContentClick = () => {
        const {product} = this.props;
        Taro.navigateTo({
            url: `/pages/product/product.detail?id=${product.id}`
        })
    }

    public renderPrice = () => {
        const {product, memberInfo} = this.props;
        const priceNum = product && product.price ? numeral(product.price).value() : 0;
        const price = numeral(priceNum).format('0.00');
        const discountPriceNum = numeral(productSdk.getProductItemDiscountPrice(product, memberInfo)).value();
        const discountPrice = numeral(discountPriceNum).format('0.00');
        return (
            <View className={`${cssPrefix}-normal`}>
                <Text className={`${cssPrefix}-price-bge`}>￥</Text>
                <Text className={`${cssPrefix}-price`}>{discountPrice.split('.')[0]}</Text>
                <Text
                    className={`${cssPrefix}-price-bge ${cssPrefix}-price-pos`}>{`.${discountPrice.split('.')[1]}`}</Text>
                {
                    priceNum !== discountPriceNum && (
                        <Text className={`${cssPrefix}-price-origin`}>{price}</Text>
                    )
                }

            </View>
        );
    }

    render() {
        const {selectedIndex, selectClick, product, last, isHome, ismenu, dispatch} = this.props;
        const isCart = Array.isArray(selectedIndex);
        const token = !!isCart && selectedIndex && selectedIndex.some((i) => i === product.id);
        return (
            <View
                className={classnames(`${cssPrefix}-border`, {
                    // [`${cssPrefix} `]: !showManageDetailToken,
                    // [`${cssPrefix}-manage`]: showManageDetailToken,
                    [`${cssPrefix}`]: true,
                    [`${cssPrefix}-cart`]: !!isCart,
                    [`${cssPrefix}-last`]: last,
                    [`${cssPrefix}-full`]: isHome !== undefined && isHome === false,
                })}
                style={ismenu === true ? {} : {border: 'none'}}
            >
                {isCart && (
                    <View 
                        className={`${cssPrefix}-select`}
                        onClick={() => {
                            if (!!selectClick) {
                                selectClick();
                                return;
                            } 
                            productSdk.selectProduct(dispatch, 'normal', product as any);
                        }}
                    >
                        <View 
                            className={classnames(`${cssPrefix}-select-item`, {
                                [`${cssPrefix}-select-normal`]: !token, 
                                [`${cssPrefix}-select-active`]: !!token,
                            })}
                        />
                    </View>
                )}
                <View
                    className={`${cssPrefix}-content`}
                    onClick={this.onContentClick.bind(this)}
                >
                    <View className={`${cssPrefix}-content-cover ${process.env.TARO_ENV === 'h5' ? `${cssPrefix}-content-cover-h5` : ''}`}>
                        {product.saleNumber <= 0 && (
                            <View className={`${cssPrefix}-content-cover-empty`}>补货中</View>
                        )}
                        {product.pictures && product.pictures !== '' ? (
                            <View
                                className={`${cssPrefix}-content-cover-image`}
                                style={`background-image: url(${product.pictures[0]})`}
                            />
                        ) : (
                            <Image
                                src="//net.huanmusic.com/scanbar-c/v1/pic_nopicture.png"
                                className={`${cssPrefix}-content-cover-image`}
                            />
                        )}
                        {
                            product && product.saleNumber && product.saleNumber > 0 && product.saleNumber <= 20 && (
                                <View className={`${cssPrefix}-inventory`}>
                                    <Text className={`${cssPrefix}-inventory-text`}>
                                        {`仅剩${product.saleNumber}份`}
                                    </Text>
                                </View>
                            )
                        }
                    </View>
                    {this.renderDetail()}
                    {this.renderStepper()}
                </View>
            </View>
        );
    }

    private renderDetail = () => {
        const {product, memberInfo, isHome} = this.props;
        const activeList = product && Array.isArray(product.activityInfos) ? product.activityInfos : [];
        const singleActiveList = activeList.filter(val => val.type === 1 || val.type === 2);
        const batchActiveList = activeList.filter(val => val.type === 3 || val.type === 4);
        return (
            <View className={classnames(`${cssPrefix}-content-detail`)} style={isHome === false ? {} : {width: '70%'}}>
                <View>
                    <View 
                        className={`${cssPrefix}-title ${process.env.TARO_ENV === 'h5' ? `${cssPrefix}-title-h5` : ''} `}
                        style={process.env.TARO_ENV === 'h5' ? {WebkitBoxOrient: 'vertical'} :{}}
                    >
                        {product.name}
                    </View>
                    <View style={process.env.TARO_ENV === 'h5' ? {WebkitBoxOrient: 'vertical'} :{}} className={`${process.env.TARO_ENV === 'h5' ? `${cssPrefix}-tips-h5` : ''} ${cssPrefix}-tips`}>
                        {product.description && product.description.length > 0 ? product.description : product.name}
                    </View>
                </View>
                <View className={`${cssPrefix}-activity`}>
                    {
                        singleActiveList.length && productSdk.getDiscountString(memberInfo, activeList, product) !== '会员专享' ? (
                            <View className={`${cssPrefix}-discount`}>
                                <Text className={`${cssPrefix}-discount-text`}>
                                    {`${productSdk.getDiscountString(memberInfo, activeList, product)}`}
                                </Text>
                            </View>
                        ): null
                    }
                    {
                        /**
                         * @time 0409
                         * @todo [去掉batchActiveList.length的限制]
                         */
                        productSdk.getDiscountString(memberInfo, batchActiveList, product) && (
                            <View 
                                className={classnames({
                                    [`${cssPrefix}-discount`]: productSdk.getDiscountString(memberInfo, batchActiveList, product) === '会员专享',
                                    [`${cssPrefix}-batchDiscount`]: productSdk.getDiscountString(memberInfo, batchActiveList, product) !== '会员专享',
                                })}
                            >
                                <Text 
                                    className={classnames({
                                        [`${cssPrefix}-discount-text`]: productSdk.getDiscountString(memberInfo, batchActiveList, product) === '会员专享',
                                        [`${cssPrefix}-batchDiscount-text`]: productSdk.getDiscountString(memberInfo, batchActiveList, product) !== '会员专享',
                                    })}
                                >
                                    {`${productSdk.getDiscountString(memberInfo, batchActiveList, product)}`}
                                </Text>
                            </View>
                        )
                    }
                </View>
                {
                    this.renderPrice()
                }
            </View>
        );
    }

    private renderStepper = () => {
        // direct 黑魔法code 不加这段代码 购物车页面减少时有渲染bug
        const {product, productInCart, direct, isCart} = this.props;
        if (direct === true) {
            return (
                <View className={`${cssPrefix}-stepper`}>
                    {(product as any).number <= 0 ? (
                        isCart === true ? (<View
                                className={`${cssPrefix}-stepper-empty ${cssPrefix}-stepper-delete`}
                                onClick={this.manageProduct.bind(this, productSdk.productCartManageType.REDUCE)}
                            >
                                删除
                            </View>)
                            : (<View className={`${cssPrefix}-stepper-empty`}>
                                售罄
                            </View>)
                    ) : product !== undefined ? (
                        <View className={`${cssPrefix}-stepper-container`}>
                            <View
                                className={`${cssPrefix}-stepper-touch`}
                                onClick={this.manageProduct.bind(this, productSdk.productCartManageType.REDUCE)}
                            >
                                <View
                                    className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-reduce`)}
                                />
                            </View>
                            <Text className={`${cssPrefix}-stepper-text`}>{(product as any).sellNum}</Text>
                            <View
                                className={`${cssPrefix}-stepper-touch`}
                                onClick={this.manageProduct.bind(this, productSdk.productCartManageType.ADD)}
                            >
                                <View
                                    className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-add`)}
                                />
                            </View>

                        </View>
                    ) : (
                        <View className={`${cssPrefix}-stepper-container`}>
                            <View
                                className={`${cssPrefix}-stepper-touch`}
                                onClick={this.manageProduct.bind(this, productSdk.productCartManageType.ADD)}
                            >
                                <View
                                    className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-add`)}
                                />
                            </View>
                        </View>
                    )}
                </View>
            )

        }
        return (
            <View className={`${cssPrefix}-stepper`}>
                {product.saleNumber <= 0 ? (
                    <View className={`${cssPrefix}-stepper-empty`}>
                        售罄
                    </View>
                ) : productInCart !== undefined ? (
                    <View className={`${cssPrefix}-stepper-container`}>
                        <View
                            className={`${cssPrefix}-stepper-touch`}
                            onClick={this.manageProduct.bind(this, productSdk.productCartManageType.REDUCE)}
                        >
                            <View
                                className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-reduce`)}
                            />
                        </View>
                        <Text className={`${cssPrefix}-stepper-text`}>{productInCart.sellNum}</Text>
                        <View
                            className={`${cssPrefix}-stepper-touch`}
                            onClick={this.manageProduct.bind(this, productSdk.productCartManageType.ADD)}
                        >
                            <View
                                className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-add`)}
                            />
                        </View>
                    </View>
                ) : (
                    <View className={`${cssPrefix}-stepper-container`}>
                        <View
                            className={`${cssPrefix}-stepper-touch`}
                            onClick={this.manageProduct.bind(this, productSdk.productCartManageType.ADD)}
                        >
                            <View
                                className={classnames(`${cssPrefix}-stepper-button`, `${cssPrefix}-stepper-button-add`)}
                            />
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

const select = (state: AppReducer.AppState, ownProps: Props) => {
    const {product} = ownProps;
    const productList = state.productSDK.productCartList;
    const productInCart = product !== undefined && productList.find(p => p.id === product.id);
    return {
        product,
        productInCart,
        activityList: state.merchant.activityList,
        productSDKObj: state.productSDK,
        memberInfo: getMemberInfo(state)
    };
};

export default connect(select)(ProductComponent as any);