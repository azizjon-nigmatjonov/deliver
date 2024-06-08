import { CLEAR_ALL_REPORT_WS, SET_ALL_ORDER_WS } from "redux/constants";

export const setAllOrder = (val) => ({
  type: SET_ALL_ORDER_WS,
  payload: val,
});

export const clearAllOrder = (val) => ({
  type: CLEAR_ALL_REPORT_WS,
});
