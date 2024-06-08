import {
  CLEAR_ALL_REPORT_DOWNLOAD_FILE,
  SET_ALL_REPORT_DOWNLOAD_FILE,
} from "redux/constants";

export const reportExcelDownloadReducer = (state = [], { type, payload }) => {
  switch (type) {
    case SET_ALL_REPORT_DOWNLOAD_FILE:
      return {
        ...state,
        payload: payload,
      };
    case CLEAR_ALL_REPORT_DOWNLOAD_FILE:
      return {};
    default:
      return state;
  }
};
