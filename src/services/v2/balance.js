import { useQuery, useMutation } from "@tanstack/react-query";
import request from "utils/axios_v2";
import { queryConstants } from "constants/queryConstants";

const defaultProps = {
  enabled: false,
};

export const getBalanceData = (params) =>
  request({ method: "get", url: `/shipper-balance`, params });
export const getTransactionData = (params) =>
  request({ method: "get", url: `/transaction`, params });
// export const getExcelTransaction = (params) =>
//   request({ method: "get", url: `/excel/shipper-transactions`, params });
export const postReplenishBalance = (data) =>
  request({ method: "post", url: `/transaction`, data });
export const useBalance = ({
  createReplanishBalanceProps,
  balanceParams,
  balanceProps = defaultProps,
  transactionParams,
  transactionProps = defaultProps,
}) => {
  const postTransaction = useMutation(
    postReplenishBalance,
    createReplanishBalanceProps,
  );
  const getBalanceQuery = useQuery(
    [queryConstants.GET_BALANCE, balanceParams],
    () => getBalanceData(balanceParams),
    balanceProps,
  );
  const getTransactions = useQuery(
    [queryConstants.GET_TRANSACTION, transactionParams],
    () => getTransactionData(transactionParams),
    transactionProps,
  );
  return {
    postTransaction,
    getBalanceQuery,
    getTransactions,
    // getExcelTransaction,
  };
};
