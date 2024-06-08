// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE operations

import { queryConstants } from "constants/queryConstants";
import { useQuery } from "@tanstack/react-query";
import request from "utils/axios";
import requestV2 from "utils/axios_v2";

export const getAggregatorsOrderReport = (params) =>
  request({ method: "get", url: "/reports/aggregator_order_report", params });
export const getAggregators = (params) =>
  request({ method: "get", url: "/aggregator", params });
export const getIikoAggregators = (params) =>
  requestV2({ method: "get", url: "/iiko-order-type", params });
export const getAggregator = (id, params) =>
  request({ method: "get", url: `/aggregator/${id}`, params });
export const deleteAggregator = (id) =>
  request({ method: "delete", url: `/aggregator/${id}` });
export const postAggregator = (data, params) =>
  request({ method: "post", url: "/aggregator", data, params });
export const updateAggregator = (id, data, params) =>
  request({ method: "put", url: `/aggregator/${id}`, data, params });

const defaultProps = {
  enabled: false,
};

export const useAggregators = ({
  aggregatorsParams,
  aggregatorsProps = defaultProps,
}) => {
  const aggregatorsQuery = useQuery(
    [queryConstants.GET_AGGREGATORS, aggregatorsParams],
    () => getAggregators(aggregatorsParams),
    aggregatorsProps,
  );

  return {
    aggregatorsQuery,
  };
};

export const useIIKOAggregators = ({ params, props }) => {
  const aggregatorsIIKOQuery = useQuery(
    [queryConstants.GET_IIKO_AGGREGATORS, params],
    () => getIikoAggregators(params),
    props,
  );

  return {
    aggregatorsIIKOQuery,
  };
};

export const useAllAggregators = ({ params, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_AGGREGATORS, props],
    () => getAggregators(params),
    props,
  );
};
