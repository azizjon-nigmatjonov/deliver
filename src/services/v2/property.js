import request from "utils/axios_v2";

export const getProperties = async (params) => {
  return await request({
    method: "get",
    url: `/property`,
    params,
  });
};
export const getProperty = async (id, params) => {
  return await request({
    method: "get",
    url: `/property/${id}`,
    params,
  });
};
export const deleteProperty = async (id) => {
  return await request({
    method: "delete",
    url: `/property/${id}`,
  });
};
export const postProperty = async (data, params) => {
  return await request({
    method: "post",
    url: `/property`,
    data,
    params,
  });
};
export const updateProperty = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/property/${id}`,
    data,
    params,
  });
};
export const getVariants = async (id, params) => {
  let res = await request({
    method: "get",
    url: `/product/${id}/variants`,
    params,
  });
  return res;
};
export const postVariants = async (data, params) => {
  let res = await request({
    method: "post",
    url: "/product/many",
    data,
    params,
  });
  return res;
};
