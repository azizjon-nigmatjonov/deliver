import { SET_ORDER_DATA } from "redux/constants/table";

const initialState = {
  toggle: false,
  id: "",
};

export const orderHistoryReducer = (
  state = initialState,
  { type, payload },
) => {
  switch (type) {
    case SET_ORDER_DATA:
      return {
        ...state,
        toggle: payload.toggle,
        id: payload.id
      }
    default:
      return state;
  }
};
