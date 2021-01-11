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
      <AtModal isOpened={isOpen} className={process.env.TARO_ENV === 'h5' ?`${cssPrefix}-modal-h5` : `${cssPrefix}-modal`}>
        <AtModalContent>
          <View className={process.env.TARO_ENV === 'h5' ?`${cssPrefix}-content-h5` :  `${cssPrefix}-content`}>
            {title}
          </View>
        </AtModalContent>
        <View className={process.env.TARO_ENV === 'h5' ?`${cssPrefix}-buttons-h5` : `${cssPrefix}-buttons`}>
          <Button
            className={`${cssPrefix}-button`}
            style={process.env.TARO_ENV === 'h5' ? {marginBottom: '.4rem'} : {}}
            onClick={onCancle}
          >
            取消

          </Button>
          <Button
            onClick={this.onClick}
            style={process.env.TARO_ENV === 'h5' ? {marginBottom: '.4rem'} : {}}
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