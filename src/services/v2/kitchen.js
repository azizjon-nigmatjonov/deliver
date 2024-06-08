import { queryConstants } from "constants/queryConstants";
import { useQuery } from "@tanstack/react-query";
import request from "utils/axios_v2";
const defaultProps = {
  enabled: false,
};
export const getKitchenData = (params) =>
  request({ method: "get", url: `/get-all-branch-orders`, params });
export const getOrderFinanceReport = (params) =>
  request({ method: "get", url: `/kds-order-report`, params });

export const getCourierFinanceReport = (params) =>
  request({ method: "get", url: `/kds-courier-report`, params });

export const useKitchen = ({
  courierFinanceParams,
  courierFinanceProps = defaultProps,
  orderFinanceParams,
  orderFinanceProps = defaultProps,
}) => {
  const orderFinanceRepostQuery = useQuery(
    [queryConstants.GET_ORDER_FINANCE_REPORT, orderFinanceParams],
    () => getOrderFinanceReport(orderFinanceParams),
    orderFinanceProps,
  );
  const courierFinanceRepostQuery = useQuery(
    [queryConstants.GET_COURIER_FINANCE_REPORT, courierFinanceParams],
    () => getCourierFinanceReport(courierFinanceParams),
    courierFinanceProps,
  );

  return {
    orderFinanceRepostQuery,
    courierFinanceRepostQuery,
  };
};
