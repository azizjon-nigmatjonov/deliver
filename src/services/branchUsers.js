// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "utils/axios";
import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";

export const getBranchUsers = (params) =>
  request({ method: "get", url: "/branch-users", params });
export const deleteBranchUser = (id) =>
  request({ method: "delete", url: `/branch-users/${id}` });
export const getBranchUserById = (id, params) =>
  request({ method: "get", url: `/branch-users/${id}`, params });
export const postBranchUser = (data, params) =>
  request({ method: "post", url: "/branch-users", data, params });
export const updateBranchUser = (id, data, params) =>
  request({ method: "put", url: `/branch-users/${id}`, data, params });

export const useBranchUsersList = ({ params, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_BRANCH_USERS_LIST, params],
    () => getBranchUsers(params),
    props,
  );
};

export const useBranchUserById = ({
  id,
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_BRANCH_USER_BY_ID, props],
    () => getBranchUserById(id, params),
    props,
  );
};
