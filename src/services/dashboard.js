import { queryConstants } from "constants/queryConstants";
import { useQuery } from "@tanstack/react-query";
import request from "utils/axios";

export const getStatistics = (params) =>
  request({ method: "get", url: "/reports/dashboard", params });
export const getBranchesCount = (params) =>
  request({ method: "get", url: "/branches", params });
export const getIikoBranches = (params) =>
  request({ method: "get", url: "/iiko/branches", params });
export const getCouriersCount = (params) =>
  request({ method: "get", url: "/couriers", params });
export const getCustomersCount = (params) =>
  request({ method: "get", url: "/customers", params });
export const getOrderLocations = (params) =>
  request({ method: "get", url: "/order-locations", params });
export const dashboardCounter = (params) =>
  request({ method: "get", url: "/dashboard/dashboard_counter", params });
export const dashboardLtv = (params) =>
  request({ method: "get", url: "/dashboard/ltv", params });
export const getSalePipline = (params) =>
  request({ method: "get", url: "/dashboard/sales-pipeline", params });
export const getRFM = (params) =>
  request({ method: "get", url: "/dashboard/rfm", params });
export const getABC = (params) =>
  request({ method: "get", url: "/dashboard/abc", params });
export const getXYZ = (params) =>
  request({ method: "get", url: "/dashboard/xyz", params });
export const getABCXYZ = (params) =>
  request({ method: "get", url: "/dashboard/abcxyz", params });
export const getProductListABCXYZ = (params) =>
  request({ method: "get", url: "/dashboard/products-list-abcxyz", params });
export const getBranchStatistics = (params) =>
  request({ method: "get", url: "/dashboard/for-branch", params });
export const getOrderSource = (params) =>
  request({ method: "get", url: "/dashboard/order-source", params });
export const getOrderPayment = (params) =>
  request({ method: "get", url: "/dashboard/order-payment", params });
export const getTopOperators = (params) =>
  request({ method: "get", url: "/dashboard/operator", params });
export const getTopCouriers = (params) =>
  request({ method: "get", url: "/dashboard/courier", params });
export const getDashboardReview = (params) =>
  request({ method: "get", url: "/dashboard/review", params });

export const getDashboardCount = (params) => {
  return request({ method: "get", url: "/reports/dashboard_count", params });
};

export const getRfmCustomersList = (params) => {
  return request({
    method: "get",
    url: "/dashboard/customers-list-rfm",
    params,
  });
};

const defaultProps = {
  enabled: false,
};
export const useCustomerList = ({
  rfmState,
  params,
  props = defaultProps,
}) => {
  return useQuery(
    [queryConstants.GET_RFM_CUSTOMERS_LIST, params],
    () => getRfmCustomersList({ ...params, ...rfmState }),
    props,
  );
};

export const useRFM = ({
  params,
  props = defaultProps,
}) => {
  return useQuery(
    [queryConstants.GET_RFM, props, params],
    () => getRFM(params),
    props,
  );
};
