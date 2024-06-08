import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios_v2";

export const getModifiers = async (params) => {
  return await request({
    method: "get",
    url: `/modifier`,
    params,
  });
};
export const getModifierById = async (id, params) => {
  return await request({
    method: "get",
    url: `/modifier/${id}`,
    params,
  });
};
export const deleteModifier = async (id) => {
  return await request({
    method: "delete",
    url: `/modifier/${id}`,
  });
};
export const postModifier = async (data, params) => {
  return await request({
    method: "post",
    url: `/modifier`,
    data,
    params,
  });
};
export const updateModifier = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/modifier/${id}`,
    data,
    params,
  });
};

export const useModifiers = ({
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_MODIFIERS_LIST, props],
    () => getModifiers(params),
    props,
  );
};
