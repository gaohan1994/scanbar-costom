import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import classNames from 'classnames'
import { UserInterface } from '../../constants';
import './index.less'
import { ITouchEvent } from '@tarojs/components/types/common';

const prefix = 'address-component-item'

type Props = {
  address: UserInterface.Address;
  isBorder?: boolean;
  pre?: boolean;
  showEdit?: boolean;
  onClick?: any;
  showArrow?: boolean;
  onEditClick?: any;
  isPay?: any
}

class Item extends Taro.Component<Props> {

  onEditPress = (event: ITouchEvent) => {
    event.stopPropagation();
    const { onEditClick } = this.props;
    onEditClick()
  }

  render() {
    const { address,isPay, pre = false, onClick = undefined, isBorder = true, showEdit = true, showArrow = false } = this.props;
    const showFlag = address && address.flag ? (address.flag === 0 || address.flag === 1 || address.flag === 2) : false;
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
        {!!pre && (
          <View className={`${prefix}-detail ${prefix}-detail-bot`}>
            <View className={`${prefix}-detail-text`}>{address.contact}</View>
            <View className={`${prefix}-detail-text`}>{address.phone}</View>
          </View>
        )}
        <View className={`${prefix}-box`}>
          <View className={`${prefix}-title ${isPay === true ? `${prefix}-title-big` : ''}`}>
            {showFlag && (
              <Text
                className={classNames(`${prefix}-bge`, `${prefix}-bge-${address.flag}`)}
              >
                {address.flag === 0
                  ? '家'
                  : address.flag === 1
                    ? '公司'
                    : address.flag === 2
                      ? '学校'
                      : ''}
              </Text>
            )}
            {address.address}
          </View>
        </View>
        {!pre && (
          <View className={`${prefix}-detail ${process.env.TARO_ENV === 'h5' ? `${prefix}-detail-h5` : ''}`}>
            <View className={`${prefix}-detail-text`}>{address.contact}</View>
            <View className={`${prefix}-detail-text`}>{address.phone}</View>
          </View>
        )}

        {!!showArrow && (
          <Image
            className={`${prefix}-arrow`}
            src={'//net.huanmusic.com/scanbar-c/icon_commodity_into.png'}
          />
        )}

        {!!showEdit && (
          <View
            onClick={this.onEditPress.bind(this)}
            className={`${prefix}-edit`}
          >
            <Image
              className={`${prefix}-edit-img`}
              src={'//net.huanmusic.com/scanbar-c/icon_edit.png'}
            />
          </View>
        )}
      </View>
    )
  }
}

export default Item