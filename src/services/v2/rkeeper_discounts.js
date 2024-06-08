import request from "utils/axios_v2";

export const getRkeeperDiscounts = (params) =>
  request({ method: "get", url: `/rkeeper-discount`, params });

export const deleteRkeeperDiscount = async (id) => {
  return await request({
    method: "delete",
    url: `/rkeeper-discount/${id}`,
  });
};

export const getCrmDiscounts = (params) =>
  request({ method: "get", url: `/crm/discounts`, params });

export const postRKeeperDiscounts = (data, params) =>
  request({ method: "post", url: `/rkeeper-discount`, data, params });