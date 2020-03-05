import Taro from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import './modal.less';
import { AtModal, AtModalContent } from 'taro-ui';

const cssPrefix = 'login-modal';

interface Props {
  isOpen: boolean;
  title: string;
  onCancle: () => void;
  onConfirm: () => void;
  callback?: (userinfo: any) => void;
}

interface State {

}

class CostomModal extends Taro.Component<Props, State> {

  public onClick = () => {
    const { onConfirm, onCancle } = this.props;
    onConfirm();
    onCancle();
  }

  render() {
    const { isOpen, onCancle, title } = this.props
    return (
      <AtModal isOpened={isOpen} className={`${cssPrefix}-modal`}>
        <AtModalContent>
          <View className={`${cssPrefix}-content`}>
            {title}
          </View>
        </AtModalContent>
        <View className={`${cssPrefix}-buttons`}>
          <Button
            className={`${cssPrefix}-button`}
            onClick={onCancle}
          >
            取消

          </Button>
          <Button
            onClick={this.onClick}
            className={`${cssPrefix}-button ${cssPrefix}-blue`}
          >
            确定
          </Button>
        </View>
      </AtModal>
    )
  }


}

export default CostomModal;