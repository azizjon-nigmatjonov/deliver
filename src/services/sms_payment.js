import request from "utils/axios";

export const getSmsPayments = (params) => {
  return request({ method: "get", url: "/sms-payment/", params });
};
export const getSmsPayment = (id) =>
  request({ method: "get", url: `/sms-payment/${id}` });
