import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import classNames from 'classnames'
import { MerchantInterface } from '../../constants';
import './index.less'

const prefix = 'address-component-item'

type Props = {
  address: MerchantInterface.Address;
  isBorder?: boolean;
  showEdit?: boolean;
  onClick?: any;
  showArrow?: boolean;
}

class Item extends Taro.Component<Props> {

  render () {
    const { address, onClick = undefined, isBorder = true, showEdit = true, showArrow = false } = this.props;
    
    return (
      <View 
        className={classNames(`${prefix}`, {
          [`${prefix}-border`]: !!isBorder
        })}
        onClick={() => {
          if (!!onClick) {
            onClick()
          }
        }}
      >
        <View className={`${prefix}-box`}>
          
          <View className={`${prefix}-title`}>
            <Text className={`${prefix}-bge`}>
              {address.flag === 0 
                ? '家' 
                : address.flag === 1 
                  ? '公司'
                  : address.flag === 2 
                    ?'学校'
                    : ''}
            </Text>
            {address.address}
          </View>
        </View>
        <View className={`${prefix}-detail`}>
          <View className={`${prefix}-detail-text`}>{address.contact}</View>
          <View className={`${prefix}-detail-text`}>{address.phone}</View>
        </View>
        
        {!!showArrow && (
          <Image 
            className={`${prefix}-arrow`} 
            src={'//net.huanmusic.com/scanbar-c/icon_commodity_into.png'}
          />
        )}

        {!!showEdit && (
          <Image 
            className={`${prefix}-edit`} 
            src={'//net.huanmusic.com/scanbar-c/icon_edit.png'}
          />
        )}
      </View>
    )
  }
}

export default Item