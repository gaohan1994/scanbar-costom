/*
 * @Author: centerm.gaozhiying
 * @Date: 2020-03-04 09:02:08
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-07-28 18:01:58
 *
 * @todo 商品列表
 */
import Taro from "@tarojs/taro";
import { ScrollView, View } from "@tarojs/components";
import MerchantComponent from "./merchant";
import "../../pages/style/product.less";
import { AtActivityIndicator } from "taro-ui";
import classnames from "classnames";
import merge from "lodash.merge";
import Empty from "../empty";
import { MerchantInterface } from "../../constants";

const cssPrefix = "product";

type Props = {
  className?: string;
  loading?: boolean;
  title?: string;
  data: Array<MerchantInterface.AlianceMerchant>;
  isRenderFooter?: boolean;
  bottomSpector?: boolean;
  isHome?: boolean;
  onScroll?: (e: any) => any;
  onScrollToLower?: (e: any) => any;
  emptyString?: string;
  emptyImg?: string;
  emptyCss?: string;
  hasMore?: boolean;
  entry?: string;
  style?: string;
};

class MerchantListView extends Taro.Component<Props> {
  state = {
    scrollIntoView: ""
  };

  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    title: undefined,
    loading: false,
    productList: [],
    isRenderFooter: true,
    bottomSpector: true
  };

  /**
   * @todo [切换类别滑动到顶端code]
   * @param nextProps
   */
  componentWillReceiveProps(nextProps: Props) {
    const nextList: any = merge([], nextProps.data);
    const currentList: any = merge([], this.props.data);
    if (nextList.length > 0 && currentList.length > 0) {
      if (nextList.length !== currentList.length || nextList !== currentList) {
        this.setState({
          scrollIntoView: `data${nextList[0].id}`
        });
      }
    }
  }

  render() {
    const {
      className,
      loading,
      data,
      isRenderFooter,
      bottomSpector,
      onScroll,
      emptyString,
      emptyImg,
      emptyCss,
      hasMore,
      onScrollToLower,
      entry,
      style
    } = this.props;
    return (
      <ScrollView
        scrollY={true}
        scrollIntoView={this.state.scrollIntoView}
        className={classnames(
          `${cssPrefix}-list-right ${cssPrefix}-list-margin ${
          process.env.TARO_ENV === "h5" ? `${cssPrefix}&-h5-height` : ""
          }`,
          className
        )}
        onScroll={onScroll ? onScroll : () => {}}
        onScrollToLower={onScrollToLower ? onScrollToLower : () => {}}
        style={style}
      >
        {!loading ? (
          Array.isArray(data) === true && data.length > 0 ? (
            (data || []).map((merchant, index) => {
              return (
                <View id={`data${merchant.id}`} key={merchant.id}>
                  <MerchantComponent merchant={merchant} border={!(data.length - 1 === index && entry === 'attention')}/>
                </View>
              );
            })
          ) : (
              <Empty
                img={
                  emptyImg || "//net.huanmusic.com/scanbar-c/v1/img_commodity.png"
                }
                css={emptyCss || "index"}
                text={emptyString || "没有相关门店"}
              />
            )
        ) : (
            <View className="container">
              <AtActivityIndicator mode="center" />
            </View>
          )}
        {hasMore !== true && isRenderFooter && data && data.length > 0 && (
          <View className={`${cssPrefix}-list-bottom`}>已经到底啦</View>
        )}
        {bottomSpector && <View style="height: 100px" />}
      </ScrollView>
    );
  }
}

export default MerchantListView;
