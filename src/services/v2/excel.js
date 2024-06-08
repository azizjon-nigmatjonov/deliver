import request from "utils/axios_v2";

export const getExcelData = (params) =>
  request({ method: "get", url: "/excel/products", params });

export const getExcelProductsByBranch = (params) =>
  request({ method: "get", url: "/excel/products-by-branch", params });

export const getOrderDailyExcelReport = (params) =>
  request({ method: "get", url: "/excel/order-daily-report", params });

export const downloadCustomersListRfm = (params) =>
  request({ method: "get", url: "/excel/customers-list-rfm", params });

export const downloadProductsListAbcXyz = (params) =>
  request({ method: "get", url: "/excel/products-list-abcxyz", params });
