import { CLEAR_ALL_REPORT_WS, SET_ALL_ORDER_WS } from "redux/constants";

export const allOrderReducer = (state = [], { type, payload }) => {
  switch (type) {
    case SET_ALL_ORDER_WS:
      return {
        ...state,
        payload: payload,
      };
    case CLEAR_ALL_REPORT_WS:
      return {};
    default:
      return state;
  }
};
