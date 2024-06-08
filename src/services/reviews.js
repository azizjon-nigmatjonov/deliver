import request from "utils/axios";

export const getReviews = (params) =>
  request({ method: "get", url: "/review", params });
export const getReview = (id, params) =>
  request({ method: "get", url: `/review/${id}`, params });
export const deleteReview = (id) =>
  request({ method: "delete", url: `/review/${id}` });
export const postReview = (data, params) =>
  request({ method: "post", url: "/review", data, params });
export const updateReview = (id, data, params) =>
  request({ method: "put", url: `/review/${id}`, data, params });
