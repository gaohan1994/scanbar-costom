import Taro from '@tarojs/taro'
import { View, Textarea } from '@tarojs/components'
import './index.less'
import '../style/product.less'
import { AtButton} from 'taro-ui'
import { AppReducer } from '../../reducers'
import { getPayOrderDetail } from '../../common/sdk/product/product.sdk.reducer'
import { connect } from '@tarojs/redux'
import productSdk from '../../common/sdk/product/product.sdk'

const prefix = 'order-remark'

const remarks = [
  '无接触配送',
  '特殊期间外卖放小区门口，谢谢',
  '请放小区“无接触配送自提点”'
];

type Props = {
  payOrderDetail: any;
}

type State = {
  remark: string;
}

class Page extends Taro.Component <Props, State> {

  state = {
    remark: ''
  }

  componentDidShow () {
    const { payOrderDetail } = this.props;
    this.setState({remark: payOrderDetail && payOrderDetail.remark || ''})
  }

  public changeRemark = (value: string) => {
    this.setState({remark: value})
  }

  public onSubmit = () => {
    const { remark } = this.state;
    productSdk.preparePayOrderDetail({remark})
    Taro.navigateBack({})
  }

  render () {
    const {remark } = this.state;
    return (
      <View className={`${prefix}`}>
        <View className={`${prefix}-input`}>
          <Textarea
            className={`${prefix}-input-text`}
            value={remark}
            onInput={({detail: {value}}) => this.changeRemark(value)}
            placeholder='请输入备注'
          />
        </View>
        <View className={`${prefix}-title`}>快捷输入</View>

        <View className={`${prefix}-buttons`}>
          {remarks.map((item) => {
            return (
              <View 
                key={item} 
                className={`${prefix}-button`}
                onClick={() => this.changeRemark(item)}
              >
                {item}
              </View>
            )
          })}
        </View>

        <View className={`${prefix}-box product-add-buttons-one`}>
          <AtButton
            className='theme-button'
            onClick={() => this.onSubmit()}
          >
            完成
          </AtButton>
        </View>
      </View>
    )
  }
}

const select = (state: AppReducer.AppState) => ({
  payOrderDetail: getPayOrderDetail(state)
})

export default connect(select)(Page);