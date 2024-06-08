import request from "utils/axios";

export const getCompletionReasons = (params) =>
  request({ method: "get", url: "/finishing_reason", params });
export const getCompletionReason = (id, params) =>
  request({ method: "get", url: `/finishing_reason/${id}`, params });
export const deleteCompletionReason = (id) =>
  request({ method: "delete", url: `/finishing_reason/${id}` });
export const postCompletionReason = (data, params) =>
  request({ method: "post", url: "/finishing_reason", data, params });
export const updateCompletionReason = (id, data, params) =>
  request({ method: "put", url: `/finishing_reason/${id}`, data, params });
