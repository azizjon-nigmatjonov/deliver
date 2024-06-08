import request from "utils/axios";

export const getJowiId = (data, params) =>
  request({ method: "get", url: `/jowi-credentials`, data, params });
export const updateJowiId = (data, params) =>
  request({ method: "put", url: `/jowi-credentials`, data, params });
export const postJowiId = (data, params) =>
  request({ method: "post", url: `/jowi-credentials`, data, params });
export const deleteJowiId = (data, params) =>
  request({ method: "delete", url: `/jowi-credentials`, data, params });

export const getIikoId = (data, params) =>
  request({ method: "get", url: `/iiko-credentials`, data, params });
export const updateIikoId = (data, params) =>
  request({ method: "put", url: `/iiko-credentials`, data, params });
export const postIikoId = (data, params) =>
  request({ method: "post", url: `/iiko-credentials`, data, params });
export const deleteIikoId = (data, params) =>
  request({ method: "delete", url: `/iiko-credentials`, data, params });
