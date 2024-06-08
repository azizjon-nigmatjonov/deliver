import request from "../../utils/axios_v2";
import { useMutation } from "@tanstack/react-query";

export const iikoUpdateBranches = (params) =>
  request({ method: "get", url: "/iiko/update-branches", params });
export const iikoUpdateMenu = (params) =>
  request({ method: "get", url: "/iiko/update-menu", params });
export const iikoMenu = (params) =>
  request({ method: "get", url: "/iiko/menu", params });
export const iikoUpdateTerminals = (params) =>
  request({ method: "get", url: "/iiko/update-terminals", params });
export const getIikoTerminal = (id, params) =>
  request({ method: "get", url: `/iiko/terminals/${id}`, params });
export const getIikoCities = (params) =>
  request({ method: "get", url: "/iiko-cities", params });
export const getIikoStreets = (params) =>
  request({ method: "get", url: `/iiko-streets-by-city`, params });
export const getIikoPaymentTypes = (params) =>
  request({ method: "get", url: `/iiko-payment-types`, params });

export const putStopListFn = (params) =>
  request({ method: "put", url: `/crm/stop-list-products`, params });
export const useIiko = ({ props }) => {
  const putStopList = useMutation(putStopListFn, props);
  return {
    putStopList,
  };
};
