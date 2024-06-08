import { useQuery, useMutation } from "@tanstack/react-query";
import request from "utils/axios_v2";
import { queryConstants } from "constants/queryConstants";

const defaultProps = {
  enabled: false,
};

export const getFareByIDFn = (id) =>
  request({ method: "get", url: `/shipper-fares/${id}` });
export const getFaresFn = (params) =>
  request({ method: "get", url: `/shipper-fares`, params });
export const getFutureFareFn = (data) =>
  request({ method: "put", url: `/shipper-fare`, data });
export const putFareFn = (data) =>
  request({ method: "put", url: `/shipper-fare/confirm`, data });

export const useFares = ({
  fareIDParams,
  fareIDProps = defaultProps,
  faresParams,
  faresProps,
  futureFareProps,
  putFareProps,
}) => {
  const getFareByID = useQuery(
    [queryConstants.GET_FARE_BY_ID, fareIDParams],
    () => getFareByIDFn(fareIDParams),
    fareIDProps,
  );
  const getFares = useQuery(
    [queryConstants.GET_FARES, faresParams],
    () => getFaresFn(faresParams),
    faresProps,
  );
  const getFutureFare = useMutation(getFutureFareFn, futureFareProps);
  const putFare = useMutation(putFareFn, putFareProps);

  return {
    getFareByID,
    getFares,
    getFutureFare,
    putFare,
  };
};
