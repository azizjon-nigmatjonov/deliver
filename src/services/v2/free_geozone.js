import { useQuery, useMutation } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios";

const defaultProps = {
  enabled: false,
};

export const getFreeGeozones = (params) =>
  request({ method: "GET", url: "/free_geozones", params });
export const getGeozoneByIDFn = (id) =>
  request({ method: "GET", url: `/free_geozones/${id}` });
export const postGeozoneFn = (data) =>
  request({ method: "POST", url: `/free_geozones`, data });
export const putGeozoneFn = (data) =>
  request({ method: "PUT", url: `/free_geozones/${data.id}`, data });
export const deleteFreeGeozone = (id) =>
  request({ method: "delete", url: `/free_geozones/${id}` });

export const useFreeGeozone = ({
  freeGeozoneParams,
  geozoneProps = defaultProps,
  byIDParams,
  ByIDProps = defaultProps,
  postProps,
  putProps,
}) => {
  const getFreeGeozoneList = useQuery(
    [queryConstants.GET_FREE_GEOZONE, freeGeozoneParams],
    () => getFreeGeozones(freeGeozoneParams),
    geozoneProps,
  );
  const getGeozoneByID = useQuery(
    [queryConstants.GET_FREE_GEOZONEBYID, byIDParams],
    () => getGeozoneByIDFn(byIDParams),
    ByIDProps,
  );
  const postFreeGeozone = useMutation(postGeozoneFn, postProps);
  const putFreeGeozone = useMutation(putGeozoneFn, putProps);
  return {
    getFreeGeozoneList,
    getGeozoneByID,
    postFreeGeozone,
    putFreeGeozone,
  };
};
