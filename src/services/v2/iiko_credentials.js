import request from "utils/axios_v2";

export const updateIikoWebHook = () =>
  request({ method: "put", url: `/iiko-webhook-update` });
