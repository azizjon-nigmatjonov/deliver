import { useQuery, useMutation } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios";

const defaultProps = {
  enabled: false,
};

export const getGeozone = (params) =>
  request({ method: "GET", url: "/geozones", params });
export const getGeozoneByIDFn = (id) =>
  request({ method: "GET", url: `/geozones/${id}` });
export const postGeozoneFn = (data) =>
  request({ method: "POST", url: `/geozones`, data });
export const putGeozoneFn = (data) =>
  request({ method: "PUT", url: `/geozones/${data.id}`, data });
export const deleteGeozone = (id) =>
  request({ method: "delete", url: `/geozones/${id}`});

export const useGeozone = ({
  geozoneParams,
  geozoneProps = defaultProps,
  byIDParams,
  ByIDProps = defaultProps,
  postProps,
  putProps,
}) => {
  const getGeozoneQuery = useQuery(
    [queryConstants.GET_GEOZONE, geozoneParams],
    () => getGeozone(geozoneParams),
    geozoneProps,
  );
  const getGeozoneByID = useQuery(
    [queryConstants.GET_GEOZONEBYID, byIDParams],
    () => getGeozoneByIDFn(byIDParams),
    ByIDProps,
  );
  const postGeozone = useMutation(postGeozoneFn, postProps);
  const putGeozone = useMutation(putGeozoneFn, putProps);

  return {
    getGeozoneQuery,
    getGeozoneByID,
    postGeozone,
    putGeozone,
  };
};
