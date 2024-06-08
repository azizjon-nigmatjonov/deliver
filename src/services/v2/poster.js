import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios_v2";

export const getCrmCredentials = (id) =>
  request({ method: "get", url: `/crm-credentials/${id}` });

export const getPosterMenu = (params) =>
  request({ method: "get", url: "/crm/menu", params });
export const postCrmCredentials = (data, params) =>
  request({ method: "post", url: `/crm-credentials`, data, params });
export const updateCrmCredentials = (data, params) =>
  request({ method: "put", url: `/crm-credentials`, data, params });
export const posterUpdateMenu = (params) =>
  request({ method: "get", url: "/crm/update-menu", params });
export const postPosterBranches = (data) =>
  request({ method: "post", url: `/crm-branches`, data });
export const posterUpdateBranches = (params) =>
  request({ method: "get", url: `/crm/update-branches`, params });
export const getAllCrmBranches = (params) =>
  request({ method: "get", url: "/crm-branches", params });
export const getPosterBranchByID = (id, params) =>
  request({ method: "get", url: `/crm-branches/${id}`, params });
export const putPosterBranch = (data) =>
  request({ method: "put", url: `/crm-branches`, data });

export const useCrmCredentials = ({ id, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_CRM_CREDENTIALS, props],
    () => getCrmCredentials(id),
    props,
  );
};
