
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import '../style/product.less'
import ProductListView from '../../component/product/product.listview'
import ProductMenu from '../../component/product/product.menu'
import invariant from 'invariant'
import { ProductAction } from '../../actions'
import { ResponseCode, ProductInterface } from '../../constants'
import { LoginManager } from '../../common/sdk'
import { store } from '../../app'
// import Cart from '../../component/cart/cart'


const cssPrefix = 'product';

class Index extends Component<any> {

  readonly state = {
    currentType: {
      name: '',
      id: 0,
      createTime: ''
    },
    loading: false,
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

  async componentDidShow () {
    const result = await LoginManager.getUserInfo();
    if (!result.success) {  
      await LoginManager.wxLogin();
    }
    this.init();

  }

  public changeCurrentType = (typeInfo: any, fetchProduct: boolean = true) => {
    this.setState({ currentType: typeInfo }, async () => {
      if (fetchProduct) {
        this.fetchData(typeInfo);
      }
    });
  }

  public init = async (): Promise<void> => {
    try {
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
    const result = await ProductAction.productOrderInfoList({type: `${type.id}`, status: 0});
    this.setState({ loading: false });
    return result;
  }

  render () {
    const { currentType } = this.state;
    const { productList, productType } = this.props;
    return (
      <View className={`container ${cssPrefix}`}>
        <View className={`${cssPrefix}-list-container-costom`}>
          <ProductMenu 
            menu={productType}
            currentMenu={currentType}
            onClick={(type) => this.onTypeClick(type)}
          />
          <View className={`${cssPrefix}-list-right`}>
            <View className={`${cssPrefix}-list-right-header product-component-section-header-height`}>
              <View className={`${cssPrefix}-list-right-header-bge`}/>
              <Text className={`${cssPrefix}-list-right-header-text`}>{currentType.name}</Text>
            </View>
            <ProductListView
              productList={productList}
              className={`${cssPrefix}-list-right-container`}
            />
          </View>
        </View>
        {/* <Cart /> */}
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
    productList: state.product.productList
  }
}

export default connect(select)(Index);
