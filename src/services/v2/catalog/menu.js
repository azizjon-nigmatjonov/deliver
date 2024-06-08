import request from "utils/axios_v2";
import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";

const menuService = {
  getList: (params) => request.get("/menu", { params }),
  getById: (id) => request.get(`/menu/${id}`),
  create: (data) => request.post("/menu", data),
  update: (id, data) => request.put(`/menu/${id}`, data),
  delete: (id) => request.delete(`/menu/${id}`),
};

export const getMenu = async (id, params) => {
  return await request({
    method: "get",
    url: `/menu/${id}`,
    params,
  });
};

export const deleteMenu = async (id) => {
  return await request({
    method: "delete",
    url: `/menu/${id}`,
  });
};

export const postMenu = async (data, params) => {
  return await request({
    method: "post",
    url: `/menu`,
    data,
    params,
  });
};

export const updateMenu = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/menu/${id}`,
    data,
    params,
  });
};

export const getJowiMenus = (params) =>
  request({ method: "get", url: "/jowi/menu", params });
// API Menu Product
export const getMenuProducts = async (params) => {
  return await request({
    method: "get",
    url: `/menu-product`,
    params,
  });
};
export const putMenuStopProducts = async (id, data) => {
  return await request({
    method: "put",
    url: `/menu-product/${id}`,
    data,
  });
};
export const postMenuProducts = async (params) => {
  return await request({
    method: "post",
    url: `/menu-product`,
    params,
  });
};
export const getMenuProduct = async (id, params) => {
  return await request({
    method: "get",
    url: `/menu-product/${id}`,
    params,
  });
};
export const deleteMenuProduct = async (id, params) => {
  return await request({
    method: "delete",
    url: `/menu-product/${id}`,
    params,
  });
};
export const activateMenuProduct = async (product_id, params) => {
  return await request({
    method: "put",
    url: `/menu-product/activate/${product_id}`,
    params,
  });
};

export const menuProductStatuses = async (params) => {
  return await request({
    method: "get",
    url: "/menu-product-statuses",
    params,
  });
};

// React Query
export const useMenuList = ({ params, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_MENU_LIST, params],
    () => menuService.getList(params),
    props,
  );
};

export const useMenuById = ({ id, params, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_MENU_BY_ID, params],
    () => menuService.getById(id, params),
    props,
  );
};

export default menuService;
