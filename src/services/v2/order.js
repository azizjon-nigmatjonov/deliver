import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios_v2";

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
export const changeOrderStatus = (id, data, shipperId) =>
  request({
    method: "patch",
    url: `/order/${id}/change-status${shipperId ? `?shipper_id=${shipperId}` : ""
      }`,
    data,
  });
export const getCountOrder = (id, params) =>
  request({ method: "get", url: `/order-num/${id}`, params });
export const courierPaidToCashier = (data, params) =>
  request({ method: "put", url: `/courier-paid-cashier`, data, params });

export const useOrderById = ({ id, params, props }) => {
  return useQuery(
    [queryConstants.GET_ORDER_BY_ID, props],
    () => getOrderById(id, params),
    props,
  )
}