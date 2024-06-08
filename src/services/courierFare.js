import request from "../utils/axios";

export const getCourierFares = (params) =>
  request({ method: "get", url: "/courier_fares", params });
export const deleteCourierFare = (id) =>
  request({ method: "delete", url: `/courier_fares/${id}` });
export const getCourierFare = (id) =>
  request({ method: "get", url: `/courier_fares/${id}` });
export const postCourierFare = (data, params) =>
  request({ method: "post", url: "/courier_fares", data, params });
export const updateCourierFare = (courier_fare_id, data, params) =>
  request({
    method: "put",
    url: `/courier_fares/${courier_fare_id}`,
    data,
    params,
  });
