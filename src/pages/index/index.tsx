
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import '../style/product.less'
import ProductListView from '../../component/product/product.listview'
import ProductMenu from '../../component/product/product.menu'
import IndexAddress from './component/address'
import invariant from 'invariant'
import { ProductAction, MerchantAction } from '../../actions'
import { ResponseCode, ProductInterface } from '../../constants'
import { LoginManager } from '../../common/sdk'
import WeixinSdk from '../../common/sdk/weixin/weixin'
import productSdk from '../../common/sdk/product/product.sdk'
import orderAction from '../../actions/order.action'

const cssPrefix = 'product';

class Index extends Component<any> {

  readonly state = {
    currentType: {
      name: '',
      id: 0,
      createTime: ''
    },
    loading: false,
    isOpen: false,
  };

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

  async componentDidShow() {
    try {
      const result = await LoginManager.getUserInfo();
      console.log('userinfo: ', result);
      if (!result.success) {
        const { success, msg } = await LoginManager.wxLogin();
        invariant(!!success, msg || '登陆失败');
        this.init();
        return;
      }
      productSdk.refreshCartNumber();
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      })
    }
  }

  async componentDidMount() {
    // const result = await LoginManager.getUserInfo();
    // if (result.success && (!result.result.phone || result.result.phone.length === 0)) {
    //   this.setState({ isOpen: true });
    // }
    this.init();
    orderAction.orderAllStatus();
  }

  public changeCurrentType = (typeInfo: any, fetchProduct: boolean = true) => {
    this.setState({ currentType: typeInfo }, async () => {
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

  public init = async (): Promise<void> => {
    try {
      MerchantAction.merchantList();
      WeixinSdk.initAddress();
      const productTypeResult = await ProductAction.productInfoType();
      invariant(productTypeResult.code === ResponseCode.success, productTypeResult.msg || ' ');
      const { data } = productTypeResult;
      const firstType = data[0] || {};
      this.changeCurrentType(firstType);
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
    this.changeCurrentType(params);
  }

  public fetchData = async (type: any) => {
    this.setState({ loading: true });
    const result = await ProductAction.productInfoList({ type: `${type.id}`, status: 0, saleType: 0 } as any);
    this.setState({ loading: false });
    return result;
  }

  public onScrollToLower = async () => {
    const { currentType } = this.state;
    const { productType } = this.props;
    for (let i = 0; i < productType.length; i ++) {
      if (currentType.id === productType[i].id && (i !== productType.length - 1)) {
        this.onTypeClick(productType[i + 1]);
        break;
      }
    }
  }

  render() {
    const { currentType, loading } = this.state;
    const { productList, productType } = this.props;
    return (
      <View className={`container ${cssPrefix}`}>
        <IndexAddress />
        <View className={`${cssPrefix}-list-container-costom`}>
          <ProductMenu
            menu={productType}
            currentMenu={currentType}
            onClick={(type) => this.onTypeClick(type)}
          />
          <View className={`${cssPrefix}-list-right`}>
            <View className={`${cssPrefix}-list-right-header product-component-section-header-height`}>
              <View className={`${cssPrefix}-list-right-header-bge`} />
              <Text className={`${cssPrefix}-list-right-header-text`}>{currentType.name}</Text>
            </View>
            <ProductListView
              loading={loading}
              productList={productList}
              className={`${cssPrefix}-list-right-container`}
              // onScrollToLower={this.onScrollToLower}
            />
          </View>
        </View>
        {/* <Cart /> */}
        {/* <LoginModal isOpen={isOpen} onCancle={() => { this.setState({ isOpen: false }) }} /> */}
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
    productList: state.product.productList,
  }
}

export default connect(select)(Index);
