import request from "utils/axios";

export const getUserLog = (id) =>
  request({ method: "get", url: `/user_logs?order_id=${id}` });
  
export const postUserLog = (data) =>
  request({ method: "post", url: `/user_logs`,data });
