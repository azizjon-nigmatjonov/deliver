import request from "utils/axios_v2";

export const getCouriersInfo = async (params) => {
  return await request({
    method: "get",
    url: "/couriers-info",
    params,
  });
};
