import request from "utils/axios";

export const getNotificationsHistory = (params) =>
  request({ method: "get", url: "/notifications-history", params });

export const postNotification = (data, params) =>
  request({ method: "post", url: "/notification", data, params });
