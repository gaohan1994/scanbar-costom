
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import '../style/product.less'
import { ProductAction, MerchantAction } from '../../actions'
import productAction from '../../actions/product.action'
import { getProductCartList } from '../../common/sdk/product/product.sdk.reducer'
import HeaderInput from '../../component/header/header.input'
import ButtonCostom from '../../component/button/button'
import { BASE_PARAM } from '../../common/util/config';
import MerchantListView from '../../component/product/merchant.listview'
import { getMerchantSearchList, getMerchantSearchTotal } from '../../reducers/app.merchant';
import { getIndexAddress } from '../../reducers/app.user'

const cssPrefix = 'product';
const prefix = 'page-search'

let page: number = 1;

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
    navigationBarTitleText: '店铺搜索'
  }

  async componentDidMount() {
    this.setState({ value: '' });
    page = 1;
    MerchantAction.merchantEmptySearchList(this.props.dispatch);
    const res = await ProductAction.getSearchRecord('MERCHANT');
    if (res.success) {
      this.setState({ searchRecordList: res.result });
    }
  }

  public onValueChange = ({ detail: { value } }) => {
    this.setState({ value });
    if (value === '') {
      this.setState({ searchFlag: false });
      page = 1;
      MerchantAction.merchantEmptySearchList(this.props.dispatch);
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
    page = 1;
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
    ProductAction.setSearchRecord(newList, 'MERCHANT');
  }

  public fetchData = async () => {
    const { value } = this.state;
    const { address } = this.props;
    if (!value) {
      Taro.showToast({
        title: '请输入要搜索的店铺名称',
        icon: 'none'
      })
      return
    }
    this.setState({ loading: true });
    const result = await MerchantAction.merchantSearchList(this.props.dispatch, {
      pageNum: page,
      pageSize: 20,
      longitude: address.longitude || 119,
      latitude: address.latitude || 26,
      institutionCode: BASE_PARAM.institutionCode,
      name: value
    } as any);
    this.setState({ loading: false });
    if (result.success) {
      page = page + 1;
    } else {
      Taro.showToast({
        title: result.result || '获取店铺信息失败',
        icon: "none"
      });
    }
    return result;
  }

  public delSearchRecord = () => {
    this.setState({ searchRecordList: [] });
    productAction.setSearchRecord([], 'MERCHANT');
  }

  onScrollToLower = () => {
    const { merchantList, merchantTotal } = this.props;
    const hasMore = merchantList.length < merchantTotal;
    if (hasMore) {
      this.fetchData();
    }
  }

  render() {
    const { merchantList, merchantTotal } = this.props;
    const hasMore = merchantList.length < merchantTotal;
    const { value, searchFlag } = this.state;
    return (
      <View className={`container ${cssPrefix}`}>
        {this.renderHeader()}
        {
          (value === '' || searchFlag === false) && this.renderSearchRecord()
        }
        {
          ((merchantList && merchantList.length > 0) || (searchFlag === true)) && (
            <View className={`${cssPrefix}-list-container-costom`}>
              <View className={`${cssPrefix}-list-right`}>
                <MerchantListView data={merchantList} hasMore={hasMore} onScrollToLower={this.onScrollToLower} />
              </View>
            </View>
          )
        }

        {/* <Cart /> */}
        {/* {value !== '' && productCartList && productCartList.length > 0 && (
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
        )} */}
      </View>
    )
  }

  private renderHeader = () => {
    const { value } = this.state;
    const { dispatch } = this.props;
    return (
      <View className={`${prefix}-header`}>
        <HeaderInput
          focus={true}
          placeholder="请输入店铺名称名称"
          value={value}
          onInput={this.onValueChange}
          isRenderInputRight={true}
          inputRightClick={() => {
            this.setState({ value: '', searchFlag: false });
            MerchantAction.merchantEmptySearchList(dispatch);
            page = 1;
          }}
        >
          <ButtonCostom
            title="搜索"
            onClick={() => this.onSearch()}
            className={`${prefix}-header-button`}
            style={process.env.TARO_ENV === 'h5' ? { width: '20%' } : {}}
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
            searchRecordList && searchRecordList.length ? searchRecordList.map((item) => {
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
            }) : null
          }
        </View>
      </View>
    )
  }
}


const select = (state) => {
  return {
    merchantList: getMerchantSearchList(state),
    merchantTotal: getMerchantSearchTotal(state),
    productCartList: getProductCartList(state),
    address: getIndexAddress(state)
  }
}

export default connect(select)(Index);
