import request from "../utils/axios";
import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";

export const getBanners = (params) =>
  request({ method: "get", url: "/banner", params });
export const deleteBanner = (id) =>
  request({ method: "delete", url: `/banner/${id}` });
export const getBannerById = (id) =>
  request({ method: "get", url: `/banner/${id}` });
export const postBanner = (data, params) =>
  request({ method: "post", url: "/banner", data, params });
export const updateBanner = (banner_id, data, params) =>
  request({ method: "put", url: `/banner/${banner_id}`, data, params });

export const useBanners = ({ params, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_BANNERS_LIST, params],
    () => getBanners(params),
    props,
  );
};

export const useBannerById = ({ id, params, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_BANNER_BY_ID, props],
    () => getBannerById(id, params),
    props,
  );
};
