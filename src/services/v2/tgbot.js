import request from "utils/axios_v2";

export const getTgbot = async (id, params) => {
  return await request.request({ method: "get", url: `/tgbot/${id}`, params });
};
export const postTgbot = async (data, params) => {
  return await request.request({ method: "post", url: `/tgbot`, data, params });
};
export const updateTgbot = async (id, data, params) => {
  return await request({ method: "put", url: `/tgbot/${id}`, data, params });
};
export const getTgbotStngs = async (id, params) => {
  return await request.request({ method: "get", url: `/tgbot_settings/${id}`, params });
};
export const delTgbotStngs = async (id) => {
  return await request({ method: "delete", url: `/tgbot_settings/${id}` });
};
export const postTgbotStngs = async (data, params) => {
  return await request({ method: "post", url: `/tgbot_settings`, data, params });
};
export const updateTgbotStngs = async (id, data, params) => {
  return await request({ method: "put", url: `/tgbot_settings/${id}`, data, params });
};
