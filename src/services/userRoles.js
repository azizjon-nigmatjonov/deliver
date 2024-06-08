import request from "utils/axios";
import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";

export const getUserRoles = (params) =>
  request({ method: "get", url: "/user-roles", params });
export const getUserRole = (id, params) =>
  request({ method: "get", url: `/user-roles/${id}`, params });
export const deleteUserRole = (id) =>
  request({ method: "delete", url: `/user-roles/${id}` });
export const postUserRole = (data, params) =>
  request({ method: "post", url: "/user-roles", data, params });
export const updateUserRole = (id, data, params) =>
  request({ method: "put", url: `/user-roles/${id}`, data, params });
export const getUserRolesPermission = (id, params) =>
  request({ method: "get", url: `/user-roles/${id}/permissions`, params });
export const postUserRolesPermission = (id, data) =>
  request({ method: "post", url: `/user-roles/${id}/permissions`, data });
export const getPermission = (params) =>
  request({ method: "get", url: `/permissions`, params });

// React Query
export const usePermissionList = ({
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_PERMISSION_LIST, props],
    () => getPermission(params),
    props,
  );
};

export const useUserRolesPermissionList = ({
  id,
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_USER_ROLE_PERMISSION_LIST, props],
    () => getUserRolesPermission(id, params),
    props,
  );
};

export const useUserRoleById = ({
  id,
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_USER_ROLE_LIST, props],
    () => getUserRole(id, params),
    props,
  );
};