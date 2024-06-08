import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios_v2";

export const getExternalDeliveryReport = (params) =>
  request({ method: "get", url: `/reports/external-orders`, params });

export const useExternalDeliveryReport = ({
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_EXTERNAL_DELIVERY_REPORT, params],
    () => getExternalDeliveryReport(params),
    props,
  );
};
