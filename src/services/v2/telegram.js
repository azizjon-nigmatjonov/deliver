import request from "utils/axios_v2";

export const getTelegramContent = (params) =>
  request({ method: "get", url: "/telegram", params });

export const postTelegramContent = (data) =>
  request({ method: "post", url: `/telegram`, data });
