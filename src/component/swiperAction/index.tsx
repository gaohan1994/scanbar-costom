/*
 * @Author: Ghan 
 * @Date: 2019-10-31 17:10:38 
 * @Last Modified by: Ghan
 * @Last Modified time: 2019-11-28 15:19:14
 */
import Taro from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import "./index.less";

interface Props {
    onRemove: () => void,
}

interface State {

}

class SwiperAction extends Taro.Component<Props, State> {
    state = {
        animation: '',
        startX: 0, //开始坐标
        startY: 0,
    }

    componentDidMount() {
        // 页面渲染完成
        //实例化一个动画
        let animation = Taro.createAnimation({
            duration: 400,
            timingFunction: 'linear',
            delay: 100,
            transformOrigin: 'left top 0',
            success: (res) => {
                // console.log(res);
            }
        });
        this.setState({
            animation: animation
        })
        if (this.props.onRef) this.props.onRef(this);
    }

    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle(start, end) {
        const _X = end.X - start.X,
            _Y = end.Y - start.Y
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    }

    // 滑动开始
    touchstart = (e) => {
        this.setState({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
        })
    }

    touchmove = (e) => {
        const that = this;
        const { startX, startY } = this.state;
        const { clientX: touchMoveX, clientY: touchMoveY } = e.changedTouches[0];

        //获取滑动角度
        const angle = that.angle({X: startX, Y: startY}, {X: touchMoveX, Y: touchMoveY});
        //滑动超过30度角 return
        if (Math.abs(angle) > 30) return;
        //右滑
        if (touchMoveX > startX) {
            //实例化一个动画
            let _animation = Taro.createAnimation({
                duration: 200,
                timingFunction: 'linear',
                delay: 50,
                transformOrigin: 'left top 0',
                // success: (res) => {
                //     // console.log(res)
                // }
            })

            _animation.translateX(0).step()
            that.setState({
                //输出动画
                animation: _animation.export()
            })
        } else if (touchMoveX - startX < -10) {//左滑
            //实例化一个动画
            let _animation = Taro.createAnimation({
                duration: 200,
                timingFunction: 'linear',
                delay: 50,
                transformOrigin: 'left top 0',
                // success: (res) => {
                //     console.log(res)
                // }
            })

            _animation.translateX(-80).step()
            that.setState({
                //输出动画
                animation: _animation.export()
            })
        }
    }

    public onRemove = () => {
        const { onRemove } = this.props;
        this.clear();
        onRemove();
    }

    public clear = () => {
        let animation = Taro.createAnimation({
            duration: 200,
            timingFunction: 'linear',
            delay: 50,
            transformOrigin: 'left top 0',
            // success: (res) => {
            //     console.log(res);
            // }
        });
        animation.translateX(0).step()
        this.setState({
            animation: animation.export()
        })
    }

    render() {
        const { onRemove, children } = this.props;
        return (
            <View className="historyItem">
                {/* 删除 */}
                <View className="itemDelete right" onClick={this.onRemove}>删除</View>
                {/* 遮盖层 */}
                <View className="itemCover" style={{border: 'none'}} onTouchStart={this.touchstart.bind(this)}
                      onTouchEnd={this.touchmove.bind(this)} animation={this.state.animation}>
                    {children}
                </View>
            </View>
        );
    }
}

export default SwiperAction;