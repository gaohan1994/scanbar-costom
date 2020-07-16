import { Reducer, compose } from "redux";
import { useReducer, useEffect } from "@tarojs/taro";

/**
 * 把redux和react-hooks结合起来
 *
 * @param reducer
 * @param middleWares 中间件
 */
export const useRedux = (reducer: Reducer, ...middleWares: any[]) => {
  const [state, dispatch] = useReducer(reducer, {});
  let newDispatch;
  if (middleWares.length > 0) {
    newDispatch = compose(...middleWares)(dispatch);
  }
  useEffect(() => {
    dispatch({
      type: "ACTION_TYPES_INIT"
    });
  }, []);

  return {
    state,
    dispatch: newDispatch
  };
};
