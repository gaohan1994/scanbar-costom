
import Taro from '@tarojs/taro'
import { View, PickerView, PickerViewColumn} from '@tarojs/components'
import "./index.less"

const prefix = 'component-picker'

type Props = {

}

type State = {
  items: string[];
  value: any[]
}

class PickerComponent extends Taro.Component<Props, State> {
  state = {
    items: ['立即送出', '14:00-15:00'],
    value: []
  }

  public onChange = (params) => {
    console.log('params: ', params)
  }

  render () {
    const { value, items } = this.state;
    return (
      <View className={`${prefix}-`}>
        <PickerView
          className={`${prefix}`}
          value={value}
          onChange={(params) => this.onChange(params)}
        >
          <PickerViewColumn>
            {items.map((item, index) => {
              return (
                <View key={`i-${index}`}>
                  {item}
                </View>
              )
            })}
          </PickerViewColumn>
        </PickerView>
      </View>
    )
  }
}

export default PickerComponent;