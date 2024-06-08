import {
  CLEAR_ALL_REPORT_DOWNLOAD_FILE,
  SET_ALL_REPORT_DOWNLOAD_FILE,
} from "redux/constants";

export const setAllOrderReportFile = (val) => ({
  type: SET_ALL_REPORT_DOWNLOAD_FILE,
  payload: val,
});

export const clearAllOrderReportFile = (val) => ({
  type: CLEAR_ALL_REPORT_DOWNLOAD_FILE,
});
