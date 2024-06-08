import request from "utils/axios_v2";
import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";

export const getCategories = async (params) => {
  return await request({
    method: "get",
    url: `/category`,
    params,
  });
};
export const getAllCategories = async (params) => {
  return await request({
    method: "get",
    url: `/category-all`,
    params,
  });
};
export const getCategoryWithProducts = async (params) => {
  return await request({
    method: "get",
    url: "/category-with-products",
    params,
  });
};
export const getCategoryWithChildren = async (category_id, params) => {
  return await request({
    method: "get",
    url: `/category-with-children/${category_id}`,
    params,
  });
};
export const getCategory = async (id, params) => {
  return await request({
    method: "get",
    url: `/category/${id}`,
    params,
  });
};
export const deleteCategory = async (id) => {
  return await request({
    method: "delete",
    url: `/category/${id}`,
  });
};
export const postCategory = async (data, params) => {
  return await request({
    method: "post",
    url: `/category`,
    data,
    params,
  });
};
export const updateCategory = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/category/${id}`,
    data,
    params,
  });
};


export const useCategories = ({
  params,
  props = { enabled: false },
}) => {
  const categories = useQuery(
    [queryConstants.GET_CATEGORY_WITH_PRODUCTS, props],
    () => getCategoryWithProducts(params),
    props,
  );

  return categories;
};


export const useCategoryWithChildren = ({
  category_id,
  params,
  props = { enabled: false },
}) => {
  const childCategories = useQuery(
    [queryConstants.GET_CHILD_CATEGORIES, props, params, category_id],
    () => getCategoryWithChildren(category_id, params),
    props,
  );
  return childCategories;
};