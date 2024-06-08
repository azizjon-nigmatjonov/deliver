import { useMutation, useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios_v2";

export const getSmsTemplate = (params) =>
  request({ method: "get", url: `/sms-template`, params });
export const postSmsTemplate = (data) =>
  request({ method: "POST", url: `/sms-template`, data });
export const putSmsTemplate = (data) =>
  request({ method: "PUT", url: `/sms-template`, data });

export const useSmsTemplate = ({ params, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_SMS_TEMPLATE, params],
    () => getSmsTemplate(params),
    props,
  );
};

export const useSmsTemplateMutations = ({ props }) => {
  const postSMSTemplate = useMutation(postSmsTemplate, props);
  const putSMSTemplate = useMutation(putSmsTemplate, props);
  return {
    postSMSTemplate,
    putSMSTemplate,
  };
};
