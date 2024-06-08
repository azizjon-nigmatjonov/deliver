import request from "utils/axios";
import request2 from 'utils/axios_v2'
export const postCustomerComment = (data) =>
  request({ method: "post", url: "customer-comment", data });


export const UpdateVendorComment = (data, id) =>
request2({ method: "put", url: `/update-order-vendor-comment/${id}`, data });

export const getCustomerComments = (id, params) =>
  request({
    method: "get",
    url: `/customer-comment?customer_id=${id}`,
    params,
  });
