import request from "utils/axios";
import requestV2 from "utils/axios_v2";

export const ExcelReport = {
  all_operator: (params) =>
    request({ method: "get", url: "/excel/main_order_report", params }),
  order_operator: (params) =>
    request({ method: "get", url: "/excel/operators", params }),
  new_order_operator: (params) =>
    request({ method: "get", url: "/excel/main_order_report", params }),
  branch_order_report: (params) =>
    request({ method: "get", url: "/excel/branch_report", params }),
  branch_order_time_report: (params) =>
    request({ method: "get", url: "/excel/branch_order_time_report", params }),
  courier_report: (params) =>
    request({ method: "get", url: "/excel/courier_report", params }),
  courier_order_report: (params) =>
    request({ method: "get", url: "/excel/courier_order_report", params }),
  courier_review_report: (params) =>
    request({ method: "get", url: "/excel/courier_review_report", params }),
  products_report: (params) =>
    request({ method: "get", url: "/excel/products", params }),
  interval_order_report: (params) =>
    request({ method: "get", url: "/excel/interval_order_report", params }),
  order_report: (params) =>
    request({ method: "get", url: "/excel/order_report", params }),
  order_report_old: (params) =>
    request({ method: "get", url: "/excel/order_report_old", params }),
  order_report_with_delayed: (params) =>
    request({ method: "get", url: "/excel/order_report_with_delayed", params }),
  aggregator_order_report: (params) =>
    request({ method: "get", url: "/excel/aggregator_order_report", params }),
  courier_predict_report: (params) =>
    request({ method: "get", url: "/excel/courier_predict_report", params }),
  product_predicted_report: (params) =>
    request({ method: "get", url: "/excel/product_predicted_report", params }),
  reports_review_excel: (params) =>
    request({ method: "get", url: "/reports/reviews-excel", params }),
  time_report_excel: (params) =>
    request({ method: "get", url: "/excel/time_report", params }),
  client_order_report: (params) =>
    request({ method: "get", url: "/excel/client_order_report", params }),
  external_delivery_report: (params) =>
    requestV2({ method: "get", url: "/excel/external-orders", params }),
  courier_transaction_report: (params) =>
    requestV2({
      method: "get",
      url: "/excel/courier-report-transaction",
      params,
    }),
};
