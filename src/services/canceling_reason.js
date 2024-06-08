import request from "utils/axios";

export const getCancelingReasons = (params) =>
  request({ method: "get", url: "/canceling_reason", params });
export const getCancelingReason = (id, params) =>
  request({ method: "get", url: `/canceling_reason/${id}`, params });
export const deleteCancelingReason = (id) =>
  request({ method: "delete", url: `/canceling_reason/${id}` });
export const postCancelingReason = (data, params) =>
  request({ method: "post", url: "/canceling_reason", data, params });
export const updateCancelingReason = (id, data, params) =>
  request({ method: "put", url: `/canceling_reason/${id}`, data, params });
