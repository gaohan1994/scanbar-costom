import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import classnames from "classnames";
import "./index.less";

const prefix = "index-component";

type TabItem = { id: number; title: string };

const tabs: TabItem[] = [
  {
    id: 0,
    title: "附近推荐"
  },
  {
    id: 1,
    title: "常去的店 "
  }
];

type Props = {
  onChange: (tab: TabItem) => void;
  children: any;
};

function Tabs(props: Props) {
  const [currentTab, setCurrentTab] = useState(0);
  const { onChange } = props;

  const onChangeTab = async (tab: TabItem) => {
    if (currentTab === tab.id) {
      return;
    }

    setCurrentTab(tab.id);
    onChange && onChange(tab);
  };

  return (
    <View>
      <View className={`${prefix}-tab`}>
        {tabs.map(tab => {
          return (
            <View
              className={classnames(`${prefix}-tab-item`, {
                [`${prefix}-tab-item-active`]: currentTab === tab.id
              })}
              onClick={() => onChangeTab(tab)}
            >
              {tab.title}
              {currentTab === tab.id && (
                <View className={`${prefix}-tab-item-border`} />
              )}
            </View>
          );
        })}
      </View>
      {this.props.children}
    </View>
  );
}
export default Tabs;
