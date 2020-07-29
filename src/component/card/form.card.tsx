/*
 * @Author: Ghan 
 * @Date: 2019-11-05 10:33:07 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-04 10:42:21
 */
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import "./form.card.less";
import FormRow from './form.row';
import { FormRowProps } from './form.row';
import classnames from 'classnames';

interface Props {
  items: FormRowProps[];  // 传入表单列数据
  shadow: boolean;        // 是否选择阴影
}

class FormCard extends Taro.Component<Props> {

  static defaultProps = {
    shadow: true,
    items: [],
  };

  render () {
    const { items = [] } = this.props;
    return (
      <View 
        className={classnames('component-form', {
          // 'component-form-shadow': shadow
        })}
      >
        {
          items.map((item, index) => {
            return (
              <FormRow key={`${index}`} {...item} />
            );
          })
        }
        {this.props.children}
      </View>
    );
  }
}

export default FormCard;