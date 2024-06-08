// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import { queryConstants, defaultProps } from "constants/queryConstants";
import { useQuery } from "@tanstack/react-query";
import request from "utils/axios";

const customerService = {
  getList: (params) => request.get("/customers", { params }),
  getById: (id) => request.get("/customers/" + id),
  create: (data) => request.post("/customers", data),
  update: (id, data) => request.put("/customers/" + id, data),
  delete: (id) => request.delete("/customers/" + id),
  searchbyPhone: (params) => request.get("/search-customers", { params }),
  getTypes: (params) => request.get("/customer_type", { params }),
  getBirthdayCelebrants: (params) =>
    request.get("/customers-birthday", { params }),
  getSMSCustomers: (params) => request.get("/customers-sms-page", { params }),
};

export default customerService;

export const useCustomersByPhone = ({ params, props = defaultProps }) => {
  return useQuery(
    [queryConstants.GET_CUSTOMERS_BY_PHONE, props, params],
    () => customerService.searchbyPhone(params),
    props,
  );
};

export const useCustomerById = ({ id, props = defaultProps }) => {
  return useQuery(
    [queryConstants.GET_CUSTOMER_BY_ID, props],
    () => customerService.getById(id),
    props,
  );
};

export const useCustomerBirthdays = ({ params, props = defaultProps }) => {
  return useQuery(
    [queryConstants.GET_CUSTOMER_BIRTHDAYS, props, params],
    () => customerService.getBirthdayCelebrants(params),
    props,
  );
};
