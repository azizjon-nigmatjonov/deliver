import request from "utils/axios_v2";

export const getRKeeperCredentials = (data, params) =>
  request({ method: "get", url: `/rkeeper-credentials`, data, params });

export const updateRKeeperCredentials = (data, params) =>
  request({ method: "put", url: `/rkeeper-credentials`, data, params });

export const postRKeeperCredentials = (data, params) =>
  request({ method: "post", url: `/rkeeper-credentials`, data, params });

export const getRkeeperUpdateMenu = (params) =>
  request({ method: "get", url: `/rkeeper/update-menu`, params });

export const rkeeperMenu = (params) =>
  request({ method: "get", url: "/rkeeper/menu", params });

export const getRKeeperBranchCredentials = (params) =>
  request({ method: "get", url: `/rkeeper-branch-credentials`, params });

export const postRKeeperBranchCredentials = (data, params) =>
  request({ method: "post", url: `/rkeeper-branch-credentials`, data, params });

export const updateRKeeperBranchCredentials = (data, params) =>
  request({ method: "put", url: `/rkeeper-branch-credentials`, data, params });

export const getRkeeperOneBranchCredentials = (id, params) => {
  return request({
    method: "get",
    url: `/rkeeper-branch-credentials/${id}`,
    params,
  });
};
