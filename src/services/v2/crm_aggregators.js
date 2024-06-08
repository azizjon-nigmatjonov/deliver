import { useMutation, useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios_v2";

export const getAggregators = (params) =>
  request({ method: "GET", url: "/crm-aggregators", params });
export const getAggregator = (id) =>
  request({ method: "GET", url: `/crm-aggregators/${id}` });
export const postCRMAggregator = (data, params) =>
  request({ method: "POST", url: `/crm-aggregators`, data, params });
export const putCRMAggregator = (data, params) =>
  request({ method: "PUT", url: `/crm-aggregators`, data, params });
export const deleteCRMAggregator = (id) =>
  request({ method: "DELETE", url: `/crm-aggregators/${id}` });

//React query
export const useAggregators = ({ params, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_CRM_AGGREGATORS, props],
    () => getAggregators(params),
    props,
  );
};
export const useAggregator = ({ id, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_CRM_AGGREGATOR, props],
    () => getAggregator(id),
    props,
  );
};

export const useAggregatorMutations = ({ id, props }) => {
  const postAggregator = useMutation(postCRMAggregator, props);
  const putAggregator = useMutation(putCRMAggregator, props);
  return {
    postAggregator,
    putAggregator,
  };
};
