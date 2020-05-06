
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import '../style/product.less'
import ProductListView from '../../component/product/product.listview'
import { ProductAction } from '../../actions'
import productAction from '../../actions/product.action'
import { getProductSearchList } from '../../reducers/app.product'
import { getProductCartList } from '../../common/sdk/product/product.sdk.reducer'
import productSdk from '../../common/sdk/product/product.sdk'
import HeaderInput from '../../component/header/header.input'
import ButtonCostom from '../../component/button/button'
import {getCurrentMerchantDetail} from '../../reducers/app.merchant'
import { Dispatch } from 'redux';

const cssPrefix = 'product';
const prefix = 'page-search'

class Index extends Component<any> {

  readonly state = {
    value: '',
    searchRecordList: [] as any[],
    searchFlag: false,
  };

  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  config: Config = {
    navigationBarTitleText: '商品搜索'
  }

  async componentDidMount() {
    this.setState({ value: '' })
    productAction.productInfoEmptySearchList(this.props.dispatch);
    const res = await productAction.getSearchRecord();
    if (res.success) {
      this.setState({ searchRecordList: res.result });
    }
  }

  public onValueChange = ({ detail: { value } }) => {
    this.setState({ value });
    if (value === '') {
      this.setState({ searchFlag: false });
      productAction.productInfoEmptySearchList(this.props.dispatch);
    }
  }

  public onSearch = () => {
    const { value, searchRecordList } = this.state;
    if (!value) {
      Taro.showToast({
        title: '请输入要搜索的商品',
        icon: 'none'
      })
      return
    }
    this.fetchData();
    let newList: any[] = [];
    newList.push(value);
    const index = searchRecordList.length > 9 ? 9 : searchRecordList.length;
    for (let i = 0; i < index; i++) {
      if (searchRecordList[i] !== value) {
        newList.push(searchRecordList[i]);
      }
    }
    this.setState({ searchRecordList: newList, searchFlag: true });
    productAction.setSearchRecord(newList);
  }

  public fetchData = async () => {
    const { value } = this.state;
      const {currentMerchantDetail} = this.props;
    if (!value) {
      Taro.showToast({
        title: '请输入要搜索的商品',
        icon: 'none'
      })
      return
    }
    this.setState({ loading: true });
    const result = await ProductAction.productInfoSearchList(this.props.dispatch, {
        status: 0,
        words: value,
        saleType: 0,
        merchantId: currentMerchantDetail && currentMerchantDetail.id ? currentMerchantDetail.id : 1
    } as any);
    this.setState({ loading: false });
    return result;
  }

  public delSearchRecord = () => {
    this.setState({ searchRecordList: [] });
    productAction.setSearchRecord([]);
  }

  render() {
    const { productList, productCartList } = this.props;
    const { value, searchFlag } = this.state;
    return (
      <View className={`container ${cssPrefix}`}>
        {this.renderHeader()}
        {
          (value === '' || searchFlag === false) && this.renderSearchRecord()
        }
        {
          ((productList && productList.length > 0) || (searchFlag === true)) && (
            <View className={`${cssPrefix}-list-container-costom`}>
              <View className={`${cssPrefix}-list-right`}>
                <ProductListView
                  productList={productList}
                  className={`${prefix}-header-container`}
                  isHome={false}
                />
              </View>
            </View>
          )
        }

        {/* <Cart /> */}
        {value !== '' && productCartList && productCartList.length > 0 && (
          <View
            className={`${prefix}-cart`}
            onClick={() => {
              Taro.switchTab({
                url: '/pages/cart/cart'
              })
            }}
          >
            <View className={`${prefix}-cart-bge`}>
              {productSdk.getProductNumber(productCartList)}
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
        <HeaderInput
          placeholder="请输入商品名称"
          value={value}
          onInput={this.onValueChange}
          isRenderInputRight={true}
          inputRightClick={() => {
            this.setState({ value: '', searchFlag: false });
            productAction.productInfoEmptySearchList(this.props.dispatch);
          }}
        >
          <ButtonCostom
            title="搜索"
            onClick={() => this.onSearch()}
            className={`${prefix}-header-button`}
          />
        </HeaderInput>
      </View >
    )
  }

  private renderSearchRecord = () => {
    const { searchRecordList } = this.state;
    return (
      <View className={`${prefix}-record`}>
        <View className={`${prefix}-record-title`}>
          <View>历史搜索</View>
          <View className={`${prefix}-record-del`} onClick={this.delSearchRecord}>
            <View className={`${prefix}-record-del-img`} />
          </View>
        </View>
        <View className={`${prefix}-record-list`}>
          {
            searchRecordList && searchRecordList.length && searchRecordList.map((item) => {
              return (
                <View
                  key={item}
                  className={`${prefix}-record-list-item`}
                  onClick={() => {
                    this.setState({
                      value: item
                    }, () => {
                      this.onSearch();
                    })
                  }}
                >{item}</View>
              )
            })
          }
        </View>
      </View>
    )
  }
}


const select = (state) => {
  return {
    productList: getProductSearchList(state),
    productCartList: getProductCartList(state),
      currentMerchantDetail: getCurrentMerchantDetail(state),
  }
}

export default connect(select)(Index);
