import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios";
import requestV2 from "utils/axios_v2";

export const getCourierReports = (params) =>
  request({ method: "get", url: "/reports/courier_report", params });
export const getCourierOrderReports = (params) =>
  request({ method: "get", url: "/reports/courier_order_report", params });
export const getCourierReviewReports = (params) =>
  request({ method: "get", url: "/reports/courier_reviews", params });
export const getBranchReports = (params) =>
  request({ method: "get", url: "/reports/branches", params });
export const getBranchesReport = (params) =>
  request({ method: "get", url: "/reports/branch_report", params });
export const getBranchOrderTimeReport = (params) =>
  request({ method: "get", url: "/reports/branch_order_time_report", params });
export const getUserReports = (params) =>
  request({ method: "get", url: "/reports/users_report", params });
export const getProfileReport = (id, params) =>
  request({ method: "get", url: `/report/shipper-user/${id}`, params });
export const getOperatorReport = (params) =>
  request({ method: "get", url: `/reports/operators`, params });
export const getNewOperatorReport = (params) =>
  request({ method: "get", url: `/reports/order_report`, params });
export const getAllReports = (params) =>
  request({ method: "get", url: `/reports/order_report`, params });
export const getProductReportWithTime = (params) =>
  request({ method: "get", url: `/reports/order_report_with_time`, params });
export const getProductReportWithDelayed = (params) =>
  request({ method: "get", url: `/reports/order_report_with_delayed`, params });
export const getBranchReviews = (params) =>
  request({ method: "get", url: `/reports/branch_reviews`, params });
export const getOperatorReviews = (params) =>
  request({ method: "get", url: `/reports/operator_reviews`, params });
export const getCustomReviews = (params) =>
  request({ method: "get", url: `/reports/custom_reviews`, params });
export const getReviews = (params) =>
  request({ method: "get", url: `/reports/reviews`, params });
export const getDashboardBranch = (params) =>
  request({
    method: "get",
    url: `/reports/dashboard_branch_comparison_report`,
    params,
  });
export const getDashboardCourier = (params) =>
  request({ method: "get", url: `/reports/dashboard_courier_report`, params });
export const getCourierPredictReport = (params) =>
  request({ method: "get", url: `/reports/courier_predict_report`, params });
export const getClientOrderReport = (params) =>
  request({ method: "get", url: `/reports/client_order_report`, params });
export const getStatusTimerReport = (params) =>
  request({ method: "get", url: `/reports/status-times`, params });
export const getTimeReport = (params) =>
  request({ method: "get", url: `/reports/time`, params });
export const getTransactionReport = (params) =>
  requestV2({ method: "get", url: `/courier-report-transaction`, params });

export const useTransactionReport = ({
  params,
  props = { enabled: false },
}) => {
  const transactionReportQuery = useQuery(
    [queryConstants.GET_TRANSACTION_REPORT, props],
    () => getTransactionReport(params),
    props,
  );
  return transactionReportQuery;
};
