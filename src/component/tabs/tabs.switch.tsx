import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import classnames from 'classnames';
const cssPrefix = 'tabs-switch';
import './tabs.switch.less';

interface Props {
  current: number,
  tabs: any[],
  isCoupon?: boolean;
  onChangeTab: (tabNum: number) => void;
}

interface State {

}

class TabsSwitch extends Taro.Component<Props, State> {

  public onTabClick = (tabNum: number) => {
    const { onChangeTab } = this.props;
    if (onChangeTab) {
      onChangeTab(tabNum);
    }
  }

  render() {
    const { current, tabs, isCoupon } = this.props;
    return (
      <View className={`${cssPrefix}`}>
        {
          tabs && tabs.length && tabs.map((tab: any, index: number) => {
            return (
              <View className={`${cssPrefix}-tab`} style={`width: ${750 / tabs.length}px; ${process.env.TARO_ENV === 'h5' ? '    background-color: #F2F2F2;' : ''}`}>
                <View
                  key={tab.title}
                  className={classnames(`${cssPrefix}-tab-content`, {
                    [`${cssPrefix}-tab-content-active`]: index === current,
                  })}
                  onClick={() => { this.onTabClick(index); }}
                // style={'width: 100px'}
                >
                  {tab.title}
                  {
                    tab.num && tab.num > 0 ? (
                      <View className={`${cssPrefix}-tab-badge`} style={{right: '2rem'}}>{tab.num}</View>
                    ) : null
                  }
                  
                </View>
                <View className={index === current ? `${cssPrefix}-tab-content-active-div` : ''}/>
              </View>

            );
          })
        }
      </View>
    )
  }


}

export default TabsSwitch;