import { useMutation, useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios_v2";

export const getBPs = (params) =>
  request({ method: "GET", url: "/courier_bonus_penalty", params });
export const getBP = (id) =>
  request({ method: "GET", url: `/courier_bonus_penalty/${id}` });
export const postBPfn = (data, params) =>
  request({ method: "POST", url: `/courier_bonus_penalty`, data, params });
export const putBPfn = (id, data, params) =>
  request({
    method: "PUT",
    url: `/courier_bonus_penalty/${id}`,
    data,
    params,
  });
export const deleteBP = (id) =>
  request({ method: "DELETE", url: `/courier_bonus_penalty/${id}` });

//React query
export const useBPs = ({ params, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_COURIER_BPS, props, params],
    () => getBPs(params),
    props,
  );
};
export const useBP = ({ id, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_COURIER_BP, props],
    () => getBP(id),
    props,
  );
};

export const useBPMutations = ({ id, props }) => {
  const postBP = useMutation(postBPfn, props);
  const putBP = useMutation((data) => putBPfn(id, data), props);
  return {
    postBP,
    putBP,
  };
};
