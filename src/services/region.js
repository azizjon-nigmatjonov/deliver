import request from "../utils/axios";

export const getAllRegions = (params) =>
  request({
    method: "get",
    url: "/regions",
    params,
  });
export const getRegions = (params) =>
  request({ method: "get", url: "/regions", params });
export const deleteRegion = (id) =>
  request({ method: "delete", url: `/regions/${id}` });
export const getOneRegion = (id) =>
  request({ method: "get", url: `/regions/${id}` });
export const postRegion = (data, params) =>
  request({ method: "post", url: "/regions", data, params });
export const updateRegion = (region_id, data, params) =>
  request({ method: "put", url: `/regions/${region_id}`, data, params });
