import request from "utils/axios_v2";

export const getCouriersBalance = (params) =>
  request({ method: "get", url: "/couriers", params });
export const getCourierBalance = (id) =>
  request({ method: "get", url: `/courier-balance/${id}` });
export const getCourierTransactions = (id, params) =>
  request({
    method: "get",
    url: `/courier-transaction/${id}`,
    params,
  });
export const postCourierTransaction = (data, params) =>
  request({ method: "post", url: "/courier-transaction", data, params });
