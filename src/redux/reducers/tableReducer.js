import { SET_TABLE_ORDER, CLEAR_TABLE_ORDER } from "../constants";

export default function tableReducer(state = {}, { type, payload }) {
  const pages = Object.assign({}, state);
  switch (type) {
    case SET_TABLE_ORDER:
      pages[payload.location + payload.tab] = payload.order;
      return pages;
    case CLEAR_TABLE_ORDER:
      delete pages[payload.location + payload.tab];
      return pages;
    default:
      return pages;
  }
}
