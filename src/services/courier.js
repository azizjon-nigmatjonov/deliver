import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios";

export const getCouriers = (params) =>
  request({ method: "get", url: "/couriers", params });
export const deleteCourier = (id) =>
  request({ method: "delete", url: `/couriers/${id}` });
export const getCourier = (id) =>
  request({ method: "get", url: `/couriers/${id}` });
export const postCourier = (data, params) =>
  request({ method: "post", url: "/couriers", data, params });
export const updateCourier = (courier_id, data, params) =>
  request({ method: "put", url: `/couriers/${courier_id}`, data, params });
export const updateIikoCourier = (courier_id, params) =>
  request({
    method: "patch",
    url: `/couriers/${courier_id}/iiko-courier`,
    params,
  });

export const useCouriers = ({ params, props = { enabled: false } }) => {
  const couriersQuery = useQuery(
    [queryConstants.GET_COURIERS, props],
    () => getCouriers(params),
    props,
  );
  return couriersQuery;
};

export const getCourierTransport = (id) =>
  request({ method: "get", url: `/courier_vehicle/${id}` });
export const postCourierTransport = (data, params) =>
  request({ method: "post", url: "/courier_vehicle", data, params });
export const updateCourierTransport = (courier_id, data, params) =>
  request({
    method: "put",
    url: `/courier_vehicle/${courier_id}`,
    data,
    params,
  });
