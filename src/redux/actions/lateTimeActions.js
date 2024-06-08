import { SET_COLOR_AND_TIME } from "redux/constants";

export const setLateTimeData = (val) => ({
  type: SET_COLOR_AND_TIME,
  payload: val,
});
