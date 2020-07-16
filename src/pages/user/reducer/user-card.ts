import { IUserStore } from "../types/index";

export const initState: IUserStore.IUserCardState = {
  cardDetail: {}
};

export const ACTION_TYPES = {
  RECEIVE_CARD_DETAIL: "RECEIVE_CARD_DETAIL"
};

export default function userCard(
  state: IUserStore.IUserCardState = initState,
  action
): IUserStore.IUserCardState {
  switch (action.type) {
    case ACTION_TYPES.RECEIVE_CARD_DETAIL: {
      const { data } = action.payload;
      return {
        cardDetail: data
      };
    }
    default:
      return {
        ...state
      };
  }
}
