import request from "utils/axios_v2";
import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";

export const getNotificationsHistory = (params) =>
  request({ method: "get", url: "/notification", params });

export const postNotification = (data, params) =>
  request({ method: "post", url: "/notification", data, params });

export const useNotificationHistory = ({ params, props }) => {
  return useQuery(
    [queryConstants.GET_NOTIFICATION_HISTORY, params],
    () => getNotificationsHistory(params),
    props,
  );
};
