import request from "utils/axios";

export const getTrackings = (params) =>
  request({ method: "get", url: "/tracking/couriers-last-location", params });
export const getTracking = (id) =>
  request({ method: "get", url: `/tracking/last-location/${id}` });