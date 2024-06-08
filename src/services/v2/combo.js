import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios_v2";

export const getCombos = async (params) => {
  return await request({
    method: "get",
    url: `/combo`,
    params,
  });
};
export const getCombo = async (id, params) => {
  return await request({
    method: "get",
    url: `/product/combo/${id}`,
    params,
  });
};
export const deleteCombo = async (id) => {
  return await request({
    method: "delete",
    url: `/product/combo/${id}`,
  });
};
export const postCombo = async (data, params) => {
  return await request({
    method: "post",
    url: `/combo`,
    data,
    params,
  });
};
export const updateCombo = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/product/combo/${id}`,
    data,
    params,
  });
};

export const useComboById = ({
  product_id,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_COMBO_BY_ID, props],
    () => getCombo(product_id),
    props,
  );
};
