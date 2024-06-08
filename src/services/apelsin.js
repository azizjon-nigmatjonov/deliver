import request from "utils/axios";

export const getApelsinInfo = (params) =>
  request({ method: "get", url: "/apelsin-info", params });
export const getApelsinInfoBranchID = (id, params) =>
  request({ method: "get", url: `/apelsin-info/${id}`, params });
export const deleteApelsinInfo = (id) =>
  request({ method: "delete", url: `/apelsin-info/${id}` });
export const postApelsinInfo = (data, params) =>
  request({ method: "post", url: "/apelsin-info", data, params });
export const updateApelsinInfo = (id, data, params) =>
  request({ method: "put", url: `/apelsin-info/${id}`, data, params });
