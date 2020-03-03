import Taro from '@tarojs/taro';
import { ScrollView, View } from '@tarojs/components';
import "../../pages/style/product.less";
import "../../pages/style/order.less";
import { ProductInterface, OrderInterface } from '../../constants';
import classnames from 'classnames';

const cssPrefix = 'product';

type Props = { 
  className?: string;
  currentMenu: ProductInterface.ProductType | OrderInterface.DateItem;
  menu: ProductInterface.ProductType[] | OrderInterface.DateItem[];
  onClick: ((menu: ProductInterface.ProductType) => void) | ((menu: any) => void);
};

class ProductMenu extends Taro.Component<Props> {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    currentMenu: {},
    menu: [],
    onClick: undefined,
  };

  render () {
    const { className, menu, currentMenu, onClick } = this.props;
    return (
      <ScrollView 
        scrollY={true}
        className={classnames(`${cssPrefix}-list-left`, className)}
      > 
        {this.props.children}
        {
          menu && menu.length > 0
            ? menu.map((type) => {
              return (
                <View 
                  key={type.id}
                  className={classnames(`${cssPrefix}-list-left-item`, {
                    [`${cssPrefix}-list-left-item-active`]:  type.id === currentMenu.id
                  })}
                  onClick={() =>onClick(type)}
                >
                  {type.id === currentMenu.id && (
                    <View className={`${cssPrefix}-list-left-item-active-bge`} />
                  )}
                  {type.name}
                </View>
              );
            })
            : <View />
        }
      </ScrollView>  
    );
  }
}
export default ProductMenu;