import { useMutation, useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios_v2";

export const getSourceSettings = (params) =>
  request({ method: "get", url: `/source-settings`, params });
export const postSettings = (data) =>
  request({ method: "POST", url: `/source-settings`, data });
export const putSettings = (data) =>
  request({ method: "PUT", url: `/source-settings`, data });

export const useSourceSettings = ({ params, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_SOURCE_SETTINGS, params],
    () => getSourceSettings(params),
    props,
  );
};

export const useSourceSettingsMutations = ({ props }) => {
  const postSourceSetting = useMutation(postSettings, props);
  const putSourceSetting = useMutation(putSettings, props);
  return {
    postSourceSetting,
    putSourceSetting,
  };
};
