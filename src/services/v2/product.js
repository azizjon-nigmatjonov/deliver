import request from "utils/axios_v2";
import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";

export const getGoods = async (params) => {
  return await request({
    method: "get",
    url: `/product`,
    params,
  });
};

export const getNonOriginProducts = async (params) => {
  return await request({
    method: "get",
    url: "/product-non-origin",
    params,
  });
};

export const getNonOriginModifierProducts = async (params) => {
  return await request({
    method: "get",
    url: "/product-non-origin-modifier",
    params,
  });
};

export const getNonVariantModifierComboProducts = async (params) => {
  return await request({
    method: "get",
    url: "/product-non-variant-modifier-combo",
    params,
  });
};

// v2/product-variant-simple

export const getVariantSimpleProducts = async (params) => {
  return await request({
    method: "get",
    url: "/product-variant-simple",
    params,
  });
};

// v2/product-non-variant-modifier-combo

export const getNonVariantProducts = async (params) => {
  return await request({
    method: "get",
    url: "/product-non-variant",
    params,
  });
};
export const getGood = async (id, params) => {
  return await request({
    method: "get",
    url: `/product/${id}`,
    params,
  });
};
export const deleteGood = async (id) => {
  return await request({
    method: "delete",
    url: `/product/${id}`,
  });
};
export const postGood = async (data, params) => {
  return await request({
    method: "post",
    url: `/product`,
    data,
    params,
  });
};
export const updateGood = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/product/${id}`,
    data,
    params,
  });
};
export const updateGoodCombo = async (id, data) => {
  return await request({
    method: "patch",
    url: `/product/attach-combo/${id}`,
    data,
  });
};
export const changeStatus = async (id, data) => {
  return await request({
    method: "patch",
    url: `/product/${id}/change-status`,
    data,
  });
};
export const connectGoods = async (data, params) => {
  return await request({
    method: "post",
    url: `/product-relation-variants`,
    data,
    params,
  });
};

export const getComboProduct = async (id, params) => {
  return await request({
    method: "get",
    url: `/product/combo/${id}`,
    params,
  });
};

export const updateCombo = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/product/combo/${id}`,
    data,
    params,
  });
};

export const addComboProduct = async (data, params) => {
  return await request({
    method: "post",
    url: `/product/combo`,
    data,
    params,
  });
};

export const deleteComboProduct = async (id) => {
  return await request({
    method: "delete",
    url: `/product/combo/${id}`,
  });
};
export const getCrmCombo = async (params) => {
  return await request({
    method: "get",
    url: `/crm/combo`,
    params,
  });
};

export const getFavouritedProducts = async (params) => {
  return await request({
    method: "get",
    url: `/product-favourites`,
    params,
  });
};

export const updateCrmIds = async (data, params) => {
  return await request({
    method: "put",
    url: `/product_crm_ids`,
    data,
    params,
  });
};

// React Query
export const useNonOriginModifierProducts = ({
  params,
  props = { enabled: false },
}) => {
  const ordersQuery = useQuery(
    [queryConstants.GET_NON_ORIGIN_MODIFIER_LIST, params, props],
    () => getNonOriginModifierProducts(params),
    props,
  );
  return ordersQuery;
};

export const useFavouritedProducts = ({
  params,
  props = { enabled: false },
}) => {
  const favouritedQuery = useQuery(
    [queryConstants.GET_FAVOURITED_PRODUCTS, props],
    () => getFavouritedProducts(params),
    props,
  );
  return favouritedQuery;
};

export const useProductById = ({
  product_id,
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_PRODUCT_BY_ID, props],
    () => getGood(product_id, params),
    props,
  );
};