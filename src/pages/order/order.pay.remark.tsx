import Taro from '@tarojs/taro'
import { View, Textarea } from '@tarojs/components'
import './index.less'

const prefix = 'order-remark'

const remarks = [
  '无接触配送',
  '特殊期间外卖放小区门口，谢谢',
  '请放小区“无接触配送自提点”'
];

type Props = {

}

class Page extends Taro.Component <Props> {
  render () {
    return (
      <View className={`${prefix}`}>
        <View className={`${prefix}-input`}>
          <Textarea
            value=''
            placeholder='请输入备注'
          />
        </View>
        
        {remarks.map((item) => {
          return (
            <View key={item} className={`${prefix}-button`}>
              {item}
            </View>
          )
        })}
      </View>
    )
  }
}

export default Page;