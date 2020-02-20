
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import '../style/product.less'
import ProductListView from '../../component/product/product.listview'
import invariant from 'invariant'
import { ProductAction } from '../../actions'
import { ResponseCode, ProductInterface } from '../../constants'
import productAction from '../../actions/product.action'
import { getProductSearchList } from '../../reducers/app.product'
import { getProductCartList } from '../../common/sdk/product/product.sdk.reducer'
import productSdk from '../../common/sdk/product/product.sdk'

const cssPrefix = 'product';
const prefix = 'page-search'

class Index extends Component<any> {

  readonly state = {
    value: ''
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
    this.setState({value: ''})
    productAction.productInfoEmptySearchList();
  }
  
  public onSearch = () => {
    const { value } = this.state;
    if (!value) {
      Taro.showToast({
        title: '请输入要搜索的商品',
        icon: 'none'
      })
      return
    }
    this.fetchData();
  }

  public fetchData = async () => {
    const { value } = this.state;
    if (!value) {
      Taro.showToast({
        title: '请输入要搜索的商品',
        icon: 'none'
      })
      return
    }
    this.setState({ loading: true });
    const result = await ProductAction.productInfoSearchList({ status: 0, words: value });
    this.setState({ loading: false });
    return result;
  }

  render() {
    const { productList, productCartList } = this.props;
    return (
      <View className={`container ${cssPrefix}`}>
        {this.renderHeader()}
        <View className={`${cssPrefix}-list-container-costom`}>
          <View className={`${cssPrefix}-list-right`}>
            <ProductListView
              productList={productList}
              className={`${prefix}-header-container`}
            />
          </View>
        </View>
        {/* <Cart /> */}

        {productCartList && productCartList.length > 0 && (
          <View 
            className={`${prefix}-cart`}
            onClick={() => {
              Taro.switchTab({
                url: '/pages/cart/cart'
              })
            }}
          >
            <View className={`${prefix}-cart-bge`}>
              {productSdk.getProductNumber()}
            </View>
          </View>
        )}
      </View>
    )
  }

  private renderHeader = () => {
    const { value } = this.state;
    return (
      <View className={`${prefix}-header`}>
        <View className={`${prefix}-header-input`}>
          <Input
            value={value}
            onInput={({detail: {value}}) => this.setState({
              value: value
            })}
            className={`${prefix}-header-input-area`}
            placeholder='请输入商品名称'
          />
          {!!value && (
            <View 
              className={`${prefix}-header-input-icon`} 
              onClick={() => {
                this.setState({value: ''})
                productAction.productInfoEmptySearchList();
              }}
            />
          )}
        </View>
        <View 
          className={`${prefix}-header-button`}
          onClick={() => this.onSearch()}
        >
          搜索
        </View>
      </View>
    )
  }
}


const select = (state) => {
  return {
    productList: getProductSearchList(state),
    productCartList: getProductCartList(state)
  }
}

export default connect(select)(Index);
