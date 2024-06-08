import request from "utils/axios_v2";

export const getPopUps = async (params) => {
  return await request({
    method: "get",
    url: `/popup`,
    params,
  });
};
export const getOnePopUp = async (id, params) => {
  return await request({
    method: "get",
    url: `/popup/${id}`,
    params,
  });
};
export const deletePopUp = async (id) => {
  return await request({
    method: "delete",
    url: `/popup/${id}`,
  });
};
export const postPopUp = async (data, params) => {
  return await request({
    method: "post",
    url: `/popup`,
    data,
    params,
  });
};
export const updatePopUp = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/popup/${id}`,
    data,
    params,
  });
};
