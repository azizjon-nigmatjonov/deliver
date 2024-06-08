import request from "utils/axios_v2";

export const postRfmSms = async (data, params) => {
  return await request({ method: "post", url: `/sms/send-sms`, data, params });
};

export const getRfmSms = (params) => {
  console.log("params", params);
  return request({ method: "get", url: "/sms-history", params });
};
