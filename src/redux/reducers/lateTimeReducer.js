import { SET_COLOR_AND_TIME } from "redux/constants";

export const lateTimeReducer = (state = [], { type, payload }) => {
  switch (type) {
    case SET_COLOR_AND_TIME:
      return {
        ...state,
        payload,
      };
    default:
      return state;
  }
};
