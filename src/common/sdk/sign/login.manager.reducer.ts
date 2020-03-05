/*
 * @Author: Ghan 
 * @Date: 2019-11-25 16:30:14 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-04 09:15:14
 */
import LoginManager, { LoginInterface } from "./login.manager";

declare namespace LoginManagerReducer {
  interface State {

  }

  interface Action {
    type: LoginInterface.RECEIVE_AUTH;
    payload: any;
  }
}

const initState: LoginManagerReducer.State = {
  
};

export default function loginManagerReducer (state: LoginManagerReducer.State = initState, action: LoginManagerReducer.Action): LoginManagerReducer.State {
  switch (action.type) {
    case LoginManager.reducerInterface.RECEIVE_AUTH: {
      const { payload: { auth } } = action;
      return {
        ...state,
        auth
      };
    }
    default: {
      return {...state};
    }
  }
}