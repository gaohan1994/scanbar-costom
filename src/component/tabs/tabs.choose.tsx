import Taro from '@tarojs/taro';
import { View, Image, ScrollView, Text } from '@tarojs/components';
import classnames from 'classnames';
import { AtTabs } from 'taro-ui';
import './tabs.choose.less';

const cssPrefix = 'tabs-choose';
type Props = {
  tabs: any[];
  position?: string;
  onChange?: (tab: any) => void;
  onClose?: () => void;
  currentType: any;
};

type State = {
  current: number;
  visible: boolean;
};

class TabsChoose extends Taro.Component<Props, State> {

  static options: Taro.ComponentOptions = {
    addGlobalClass: true
  };

  static defaultProps = {
    tabs: [{ id: 1, title: '全部品类' }],
    onClose: () => {/** */ }
  };

  readonly state: State = {
    visible: false,
    current: 0,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.currentType.id !== this.props.currentType.id) {
      this.setState({ current: 0, visible: false });
    }
  }

  public onClickHandle = (value) => {
    const { onChange, tabs } = this.props;
    if(process.env.TARO_ENV === 'h5'){

      if (onChange) {
        onChange(tabs[value]);
      }
      this.onChangeVisible(false);
      this.setState({
        current: value
      })
    } else {
      this.setState({ current: value }, () => {
        if (onChange) {
          onChange(tabs[value]);
        }
      });
      this.onChangeVisible(false);
    }
  }

  public onChangeVisible = (visible?: boolean) => {
    this.setState(prevState => {
      return {
        ...prevState,
        visible: typeof visible === 'boolean' ? visible : !prevState.visible
      };
    });
  }

  public onContentItemClick = (type: any) => {
    const { tabs } = this.props;
    const index = tabs.findIndex(t => t.name === type.name);
    if (index !== -1) {
      this.onClickHandle(index);
    }
  }

  render() {
    const { tabs, } = this.props;
    const { current } = this.state;
    const {onContentItemClick} = this;
    console.log('this.state', this.state)
    return (
      <View className={`${cssPrefix} ${cssPrefix}-pos`}>
        <View className={`${cssPrefix}-container`}>
          <View className={`${cssPrefix}-header`}>
            <ScrollView
              className={`${cssPrefix}-header-list`}
              scrollX={true}
              scrollWithAnimation={true}
              scrollIntoView={`tab${current}`}
            >
              <View className={`${cssPrefix}-header-list-container`}>
                {
                  tabs && tabs.length > 0 && tabs.map((tab, index) => {

                    console.log(current === index, current,  index)
                    return (
                      <View
                        id={`tab${index}`}
                        onClick={() => {
                          onContentItemClick(tab);
                        }}
                        className={classnames(`${cssPrefix}-header-list-item`, {
                          [`item-current`]: current === index,
                          [`${cssPrefix}-header-list-item-h5`]: process.env.TARO_ENV === 'h5' ? true: false
                        })}>
                        <Text>{tab.name}</Text>
                      </View>
                    );
                  })
                }
              </View>
            </ScrollView>
            {this.renderCorner()}
          </View>
          {this.renderTabsContent()}
        </View>
      </View>
    );
  }

  private renderCorner = () => {
    const { visible } = this.state;
    return (
      <View
        className={process.env.TARO_ENV === 'h5' ? `${cssPrefix}-header-corner-h5`: `${cssPrefix}-header-corner`}
        onClick={() => this.onChangeVisible()}
      >
        {
          visible === true ? (
            <Image
              src="//net.huanmusic.com/weapp/icon_packup_gray.png"
              className={`${cssPrefix}-header-corner-image`}
            />
          ) : (
              <Image
                src="//net.huanmusic.com/weapp/icon_packup_gray.png"
                className={`${cssPrefix}-header-corner-image ${cssPrefix}-header-corner-image-down`}
              />
            )
        }

      </View>
    );
  }

  private renderTabsContent = () => {
    const { tabs } = this.props;
    const { visible, current } = this.state;
    if (visible) {
      return (
        <View className={`${cssPrefix}-content-mask`}>
          <View className={`${cssPrefix}-content`}>
            {
              tabs && tabs.length && tabs.map((tab, index) => {
                return (
                  <View
                    key={tab.id}
                    className={classnames(`${cssPrefix}-content-item`, {
                      [`item-current`]: current === index
                    }
                    )}
                    onClick={() => this.onContentItemClick(tab)}
                  >
                    {tab.name.length < 5 ? tab.name : (tab.name as string).slice(0, 5)}
                  </View>
                );
              })
            }
          </View>
          <View
            className={`${cssPrefix}-content-mask-touch`}
            onClick={() => this.onChangeVisible(false)}
          />
        </View>
      );
    }
    return <View />;
  }
}

export default TabsChoose;