import Taro from '@tarojs/taro'
import './index.less'
import { View } from '@tarojs/components'

type Props = {
  img: string;
  text?: string;
  button?: any
}

const prefix = 'component-empty'

class Empty extends Taro.Component<Props> {
  render () {
    const { img, text = undefined, button = undefined} = this.props;
    return (
      <View className={`${prefix}-layout`}>
        <View className={`${prefix}-img`} style={`background-image: url(${img})`}>
          {!!text && (
            <View className={`${prefix}-text`}>{text}</View>
          )}
        </View>
        {!!button && (
          <View
           className={`${prefix}-button`}
           onClick={button.onClick}
          >
            {button && button.title}
          </View>
        )}
      </View>
    )
  }
}

export default Empty;