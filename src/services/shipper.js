// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "utils/axios";

export const getShippers = (params) =>
  request({ method: "get", url: "/shippers", params });
export const getShipper = (id, params) =>
  request({ method: "get", url: `/shippers/${id}`, params });
export const updateShipper = (data, params) =>
  request({ method: "put", url: `/shippers`, data, params });

export const postShipperUserLogin = (data, params) =>
  request({ method: "post", url: `/shipper-users/login`, data, params });
