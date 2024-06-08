import request from "../utils/axios";

export const putSmsProvider = (data, id) =>
  request({ method: "put", url: `/sms-provider/${id}`, data });

export const postSmsProvider = (data) =>
  request({ method: "post", url: `/sms-provider`, data });

export const getSmsProvider = (id) =>
  request({ method: "get", url: `/sms-provider/${id}` });


  
export const getRfmSms = async (params) => {
  return await request({ method: "get", url: `/sms-history`, params });
};
