import request from "utils/axios_v2";
import { useQuery } from "@tanstack/react-query";

const discountService = {
  getList: (params) =>
    request({
      method: "get",
      url: "/discount",
      params,
    }),
  getById: (shipper_id, id) =>
    request({
      method: "get",
      url: `/discount/${id}`,
      headers: { Shipper: shipper_id },
    }),
  create: (data) => request.post("/discount", data),
  update: (id, data) => request.put(`/discount/${id}`, data),
  delete: (id) => request.delete(`/discount/${id}`),
};
export const getIntegrationDiscounts = (params, id) =>
  request({
    headers: { Shipper: id },
    method: "get",
    url: "/integration-discounts",
    params,
  });

export const getIntergrationDiscountsByID = async (id, params) => {
  return await request({
    method: "get",
    url: `/integration-discounts/${id}`,
    params,
  });
};

export const postIntegrationDiscounts = async (data) => {
  request({ method: "post", url: "/integration-discounts", data });
};
export const putIntegrationDiscounts = async (data) => {
  request({ method: "put", url: `/integration-discounts`, data });
};
export const useDiscountsList = ({ params, props = { enabled: false } }) => {
  return useQuery(
    ["GET_DISCOUNTS_LIST", params],
    () => discountService.getList(params),
    props,
  );
};

export const useDiscountById = ({
  shipper_id,
  id,
  props = { enabled: false },
}) => {
  return useQuery(
    ["GET_DISCOUNT_BY_ID"],
    () => discountService.getById(shipper_id, id),
    props,
  );
};

export default discountService;
