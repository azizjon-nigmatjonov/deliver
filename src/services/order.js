import request from "utils/axios";
import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";

export const getOrders = (params) =>
  request({ method: "get", url: "/order", params });

export const getOrderById = (order_id, params) =>
  request({ method: "get", url: `/order/${order_id}`, params });

export const postOrder = (data, params) =>
  request({
    method: "post",
    url: "/ondemand-order",
    data,
    params,
  });

export const updateOrder = (order_id, data, params) =>
  request({ method: "put", url: `/order/${order_id}`, data, params });
export const getCountOrder = (params) =>
  request({ method: "get", url: "/orders-count-by-statuses", params });
export const changeOrderStatus = (id, data, shipperId) =>
  request({
    method: "patch",
    url: `/order/${id}/change-status${shipperId ? "?shipper_id=" + shipperId : ""
      }`,
    data,
  });
export const getCustomerAddresses = (phone, params) =>
  request({
    method: "get",
    url: `/customer-addresses/${phone}`,
    params,
  });
export const getCouriersByBranch = (branch_id, params) =>
  request({
    method: "get",
    url: `/branches/${branch_id}/couriers`,
    params,
  });

export const getOrdersWithAveragePrice = (order_id, params) =>
  request({
    method: "get",
    url: `/orders-with-average-price/${order_id}`,
    params,
  });

export const removeCourierFromOrder = (id) =>
  request({
    method: "patch",
    url: `/order/${id}/remove-courier`,
  });
export const addCourierByOrderId = (id, data) =>
  request({
    method: "patch",
    url: `/order/${id}/add-courier`,
    data,
  });

// React Query
export const useOrderList = ({
  params,
  props = { enabled: false },
}) => {
  const ordersQuery = useQuery(
    [queryConstants.GET_ORDER_LIST, props, params],
    () => getOrders(params),
    props,
  );
  return ordersQuery;
};