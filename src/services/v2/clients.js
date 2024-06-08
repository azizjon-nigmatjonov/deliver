import request from "utils/axios_v2";

export const postClientsImport = (data, params) =>
  request({ method: "post", url: `/clients-import`, data, params });
export const updateRfmSettings = (data) =>
  request({ method: "put", url: "/dashboard_settings", data });
export const getRfmSettings = () =>
  request({ method: "get", url: "/dashboard_settings" });