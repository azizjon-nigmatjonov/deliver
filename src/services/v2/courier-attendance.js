import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios_v2";

//request functions

export const courierAttendance = (params) =>
  request({ method: "GET", url: "/courier-attendance-time", params });

// React Query
export const useCourierAttendance = ({
  params,
  props = { enabled: false },
}) => {
  const ordersQuery = useQuery(
    [queryConstants.GET_COURIER_ATTENDANCE, props],
    () => courierAttendance(params),
    props,
  );
  return ordersQuery;
};
