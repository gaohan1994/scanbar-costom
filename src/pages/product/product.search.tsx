
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import '../style/product.less'
import ProductListView from '../../component/product/product.listview'
import ProductMenu from '../../component/product/product.menu'
import invariant from 'invariant'
import { ProductAction } from '../../actions'
import { ResponseCode, ProductInterface } from '../../constants'
import LoginModal from '../../component/login/login.modal'

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

  }


  public fetchData = async (type: any) => {
    this.setState({ loading: true });
    const result = await ProductAction.productOrderInfoList({ type: `${type.id}`, status: 0 });
    this.setState({ loading: false });
    return result;
  }

  render() {
    const { isOpen } = this.state;
    const { productList } = this.props;
    return (
      <View className={`container ${cssPrefix}`}>
        <View className={`${cssPrefix}-list-container-costom`}>
          <View className={`${cssPrefix}-list-right`}>
            <ProductListView
              productList={productList}
              className={`${cssPrefix}-list-right-container`}
            />
          </View>
        </View>
        {/* <Cart /> */}
        <LoginModal isOpen={isOpen} onCancle={() => { this.setState({ isOpen: false }) }}/>
      </View>
    )
  }
}


const select = (state) => {
  return {
    productList: state.product.productList,
  }
}

export default connect(select)(Index);
