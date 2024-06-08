// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "utils/axios";

export const changePayment = (data, id) =>
  request({ method: "patch", url: `/order/${id}/change-payment-type`, data });
