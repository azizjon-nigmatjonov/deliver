import request from "utils/axios_v2";

export const jowiUpdateMenu = (params) =>
  request({ method: "get", url: "/jowi/update-menu", params });
export const getJowiId = (data, params) =>
  request({ method: "get", url: `/jowi-credentials`, data, params });
export const updateJowiId = (data, params) =>
  request({ method: "put", url: `/jowi-credentials`, data, params });
export const postJowiId = (data, params) =>
  request({ method: "post", url: `/jowi-credentials`, data, params });
export const deleteJowiId = (data, params) =>
  request({ method: "delete", url: `/jowi-credentials`, data, params });
export const jowiUpdateBranches = (data, params) =>
  request({ method: "get", url: `/jowi/update-branches`, data, params });
