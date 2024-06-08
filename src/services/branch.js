import request from "utils/axios";
import requestV2 from "utils/axios_v2";
import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";

const branchService = {
  getList: (params, id) =>
    request({
      headers: { Shipper: id },
      method: "get",
      url: "/branches",
      params,
    }),
  postBranch: (data, id) =>
    request({
      headers: { Shipper: id },
      method: "post",
      url: "/branches",
      data,
    }),
  postBranchCourier: (data) =>
    request({ method: "post", url: "/branches/add-courier", data }),
  removeBranchCourier: (data) =>
    request({ method: "post", url: "/branches/remove-courier", data }),
  getBranchById: (branch_id, params) =>
    request({ method: "get", url: `/branches/${branch_id}`, params }),
  updateBranch: (data, branch_id) =>
    request({ method: "put", url: `/branches/${branch_id}`, data }),
  deleteBranch: (branch_id) =>
    request({ method: "delete", url: `/branches/${branch_id}` }),
  getBranchCouriers: (branch_id, params) =>
    request({ method: "get", url: `/branches/${branch_id}/couriers`, params }),
  getNearestBranch: (params) =>
    request({ method: "get", url: `/nearest-branch`, params }),
};
export default branchService;

export const getBranches = (params, id) =>
  request({
    headers: { Shipper: id },
    method: "get",
    url: "/branches",
    params,
  });
export const postBranch = (data, params) =>
  request({ method: "post", url: "/branches", data, params });
export const postBranchCourier = (data) =>
  request({ method: "post", url: "/branches/add-courier", data });
export const removeBranchCourier = (data) =>
  request({ method: "post", url: "/branches/remove-courier", data });
export const updateBranch = (data, branch_id, params) =>
  request({ method: "put", url: `/branches/${branch_id}`, data, params });
export const deleteBranch = (branch_id, id) =>
  request({
    headers: { shipper_id: id },
    method: "delete",
    url: `/branches/${branch_id}`,
  });
export const getBranchCouriers = (branch_id, params) =>
  request({ method: "get", url: `/branches/${branch_id}/couriers`, params });
export const getNearestBranch = (params) =>
  request({ method: "get", url: "/nearest-branch", params });
export const getCrmBranches = (id, params) =>
  requestV2({
    headers: { Shipper: id },
    method: "get",
    url: "/crm/branches",
    params,
  });

// React Query
export const useBranchList = ({
  shipper_id,
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_BRANCH_LIST, props, params],
    () => getBranches(params, shipper_id),
    props,
  );
};

export const useBranchById = ({
  branch_id,
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_BRANCH_BY_ID, props],
    () => branchService.getBranchById(branch_id, params),
    props,
  );
};

export const useCouriersByBranch = ({
  branch_id,
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_COURIERS_BY_BRANCH, props, branch_id, params],
    () => branchService.getBranchCouriers(branch_id, params),
    props,
  );
};
