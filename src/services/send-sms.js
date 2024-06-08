import request from "utils/axios";

export const sendSms = (data) =>
  request({ method: "post", url: "/sms-payment/send-sms", data });

export const SendSmsToUsers = (data) =>
  request({ method: "post", url: "sms/send-sms", data });
