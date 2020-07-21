/*
 * @Author: centerm.gaozhiying
 * @Date: 2020-03-04 09:02:08
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-07-17 09:48:08
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
import { CommonEventFunction } from "@tarojs/components/types/common";
import { MerchantInterface } from "src/constants";

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
  emptyString?: string;
  emptyImg?: string;
  emptyCss?: string;
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

  public onScroll = (event: CommonEventFunction) => {
    const { detail } = event;
    console.log("detail: ", detail);
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
      isHome,
      onScroll,
      emptyString,
      emptyImg,
      emptyCss
    } = this.props;
    return (
      <ScrollView
        scrollY={true}
        scrollIntoView={this.state.scrollIntoView}
        className={classnames(
          `${cssPrefix}-list-right ${
            process.env.TARO_ENV === "h5" ? `${cssPrefix}&-h5-height` : ""
          }`,
          className
        )}
        onScroll={onScroll}
      >
        {!loading ? (
          data && data.length > 0 ? (
            data.map(product => {
              return (
                <View id={`data${product.id}`} key={product.id}>
                  <MerchantComponent merchant={product} />
                </View>
              );
            })
          ) : (
            <Empty
              img={
                emptyImg || "//net.huanmusic.com/scanbar-c/v1/img_commodity.png"
              }
              css={emptyCss || "index"}
              text={emptyString || "还没有商品"}
            />
          )
        ) : (
          <View className="container">
            <AtActivityIndicator mode="center" />
          </View>
        )}
        {isRenderFooter && data && data.length > 0 && (
          <View className={`${cssPrefix}-list-bottom`}>已经到底啦</View>
        )}
        {bottomSpector && <View style="height: 100px" />}
      </ScrollView>
    );
  }
}

export default MerchantListView;
