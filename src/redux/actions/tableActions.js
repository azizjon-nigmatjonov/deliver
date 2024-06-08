import { SET_TABLE_ORDER, CLEAR_TABLE_ORDER } from "redux/constants";

export function updateOrder(payload) {
  return {
    type: SET_TABLE_ORDER,
    payload,
  };
}

export function clearOrder(payload) {
  return {
    type: CLEAR_TABLE_ORDER,
    payload,
  };
}
