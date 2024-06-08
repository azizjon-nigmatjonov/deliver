import request from "utils/axios_v2";

export const getPropertyGroups = async (params) => {
  return await request({
    method: "get",
    url: `/property-group`,
    params,
  });
};
export const getPropertyGroup = async (id, params) => {
  return await request({
    method: "get",
    url: `/property-group/${id}`,
    params,
  });
};
export const deletePropertyGroup = async (id) => {
  return await request({
    method: "delete",
    url: `/property-group/${id}`,
  });
};
export const postPropertyGroup = async (data, params) => {
  return await request({
    method: "post",
    url: `/property-group`,
    data,
    params,
  });
};
export const updatePropertyGroup = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/property-group/${id}`,
    data,
    params,
  });
};
