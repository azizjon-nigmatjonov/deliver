import request from "utils/axios_v2";

export const sendOrderCRM = async (id, params) => {
  return await request({
    method: "get",
    url: `/crm/send_order/${id}`,
    params,
  });
};

export const getDiscounts = async (params) => {
  return await request({
    method: "get",
    url: "/crm/discounts",
    params,
  });
};

export const getCRMDiscounts = async (id, params) => {
  return await request({
    method: "get",
    url: `/crm-discounts/${id}`,
    params,
  });
};

export const getPaymentTypes = async (params) => {
  return await request({
    method: "get",
    url: "/crm/payment-types",
    params,
  });
};

export const postPaymentTypes = async (data, params) => {
  return await request({
    method: "post",
    url: "/crm/payment-types",
    data,
    params,
  });
};

export const deletePaymentType = async (id, params) => {
  return await request({
    method: "delete",
    url: "/crm/payment-types/" + id,
    params,
  });
};

export const updateCrmDiscount = (params) =>
  request({ method: "put", url: `/crm/discounts`, params });

export const getCrmCouriers = (params) =>
  request({
    method: "get",
    url: "/crm/couriers",
    params,
  });

export const updateCrmCouriers = (params) =>
  request({ method: "put", url: `/crm/update-couriers`, params });

export const postYandexDelivery = (data, params) => request({
  method: "post",
  url: "/crm/yandex-delivery",
  data,
  params,
});
