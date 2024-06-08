import { queryConstants } from "constants/queryConstants";
import { useQuery } from "@tanstack/react-query";
import request from "utils/axios_v2";
const defaultProps = {
  enabled: false,
};

export const getNotificationAlerts = (params) =>
  request({ method: "get", url: "/shipper-notification", params });
export const getNotificationAlertsByID = (id) =>
  request({ method: "get", url: `/shipper-notification/${id}` });

export const useNotificationAlerts = ({
  notificationProps = defaultProps,
  notificationIdProps = defaultProps,
  notificationParams,
  notificationAlertsId,
}) => {
  const getNotificationAlertsQuery = useQuery(
    [queryConstants.GET_NOTIFICATION_ALERTS, notificationParams],
    () => getNotificationAlerts(notificationParams),
    notificationProps,
  );
  const getNotificationAlertsByIDQuery = useQuery(
    [queryConstants.GET_NOTIFICATION_ALERTS_BYID, notificationAlertsId],
    () => getNotificationAlertsByID(notificationAlertsId),
    notificationIdProps,
  );

  return {
    getNotificationAlertsQuery,
    getNotificationAlertsByIDQuery,
  };
};
