import React, { useMemo, useState } from "react";
import { BalanceContext } from "./context";
import BalanceTable from "./BalanceTable";
import { useTranslation } from "react-i18next";
import balanceHeaderData from "./HeaderData";
import BalanceModal from "./BalanceModal";
import { Grid } from "@mui/material";
import styles from "./Balance.module.scss";
import { DateIcon, PocketIcon } from "constants/icons";
import { useBalance } from "services/v2/balance";
import { useSelector } from "react-redux";

export const filterHeadData = [
  {
    title: "№",
    key: "index",
    isChecked: true,
  },
  {
    title: "Сумма",
    key: "amount",
    isChecked: true,
  },
  {
    title: "Коммент",
    key: "comment",
    isChecked: true,
  },
  {
    title: "Тип оплаты",
    key: "transaction_type",
    isChecked: true,
  },
  {
    title: "Тип создателя",
    key: "creator_type",
    isChecked: true,
  },
  {
    title: "Пользователь",
    key: "creator_name",
    isChecked: true,
  },
  {
    title: "Валюта",
    key: "payment_currency",
    isChecked: true,
  },
  {
    title: "Дата оплаты",
    key: "created_at",
    isChecked: true,
  },
  {
    title: "Статус",
    key: "payment_status",
    isChecked: true,
  },
];
const Balance = () => {
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [creatorType, setCreatorType] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [users, setUsers] = useState("");
  const [filterColumn, setFilterColumn] = useState(filterHeadData);
  const [open, setOpen] = useState(false);

  // const filteredUser = useDebounce(users, 300);
  const { t } = useTranslation();

  const typeOptions = useMemo(
    () => [
      { value: "", label: "Все" },
      { value: "debt", label: t("debt") },
      { value: "topup", label: t("topup") },
      { value: "withdraw", label: t("withdraw") },
    ],
    [t],
  );

  const creatorTypeOptions = useMemo(
    () => [
      { value: "", label: "Все" },
      { value: "system-user", label: "Cуперадмин" },
      { value: "user", label: "Пользователь" },
    ],
    [],
  );

  const isSimilar = () => {
    const arr = [];
    for (let i = 0; i < HeaderData.length; i++) {
      for (let j = 0; j < filterColumn.length; j++) {
        if (
          HeaderData[i].key === filterColumn[j].key &&
          filterColumn[j].isChecked === true
        ) {
          arr.push(HeaderData[i]);
        }
      }
    }
    arr.push(HeaderData.at(-1));
    return arr;
  };
  const HeaderData = useMemo(() => {
    return balanceHeaderData({
      t,
      creatorTypeOptions,
      creatorType,
      setCreatorType,
      typeFilter,
      setTypeFilter,
      typeOptions,
      users,
      setUsers,
      filterHeadData,
      filterColumn,
      setFilterColumn,
      currentPage,
    });
  }, [
    t,
    creatorTypeOptions,
    creatorType,
    typeFilter,
    typeOptions,
    users,
    filterColumn,
    currentPage,
  ]);

  //Queries
  const id = useSelector((state) => state.auth.shipper_id);
  //Balance GET
  const { getBalanceQuery } = useBalance({
    balanceParams: {
      shipper_id: id,
    },
    balanceProps: {
      enabled: !!id,
    },
  });

  const { getTransactions } = useBalance({
    transactionParams: {
      page: currentPage,
      limit: limit,
      transaction_type: typeFilter,
      creator_type: creatorType,
    },
    transactionProps: {
      enabled: !!id,
    },
  });
  return (
    <BalanceContext.Provider
      value={{
        setCurrentPage,
        setLimit,
        limit,
        creatorTypeOptions,
        isSimilar,
        open,
        setOpen,
        bodyData: getTransactions?.data?.transactions,
        currentPage,
        data: getTransactions,
      }}
    >
      <div className="p-4">
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <div className={styles.BalanceBlock}>
              <div className={styles.BalanceInner}>
                <h2 className={styles.BalanceTitle}>
                  {getBalanceQuery?.data?.shipper_balance}
                </h2>
                <p
                  onClick={() => setOpen(!open)}
                  className={styles.BalanceReplenish}
                >
                  + {t("replenish")}
                </p>
              </div>
              <span className={styles.PocketIcon}>
                <PocketIcon />
              </span>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className={styles.BalanceBlock}>
              <div className={styles.BalanceInner}>
                <h2 className={styles.BalanceTitle}>
                  {getBalanceQuery?.data?.shipper_debt}
                </h2>
                <p className={styles.BalanceReplenish}>{t("debt")}</p>
              </div>
              <span className={styles.PocketIcon}>
                <PocketIcon />
              </span>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className={styles.BalanceBlock}>
              <div className={styles.BalanceInner}>
                <h2 className={styles.BalanceTitle}>
                  {getBalanceQuery?.data?.shipper_connecting_price}
                </h2>
                <p className={styles.BalanceReplenish}>
                  {t("connecting_price")}
                </p>
              </div>
              <span className={styles.PocketIcon}>
                <PocketIcon />
              </span>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className={styles.LeftDaysBlock}>
              <div className={styles.LeftDaysInner}>
                <h2 className={styles.LeftDaysTitle}>
                  {getBalanceQuery?.data?.left_using_days}
                </h2>
                <p
                  onClick={() => setOpen(!open)}
                  className={styles.LeftDaysReplenish}
                >
                  {t("left_days")}
                </p>
              </div>
              <span className={styles.DateIcon}>
                <DateIcon />
              </span>
            </div>
          </Grid>
        </Grid>
        <BalanceTable />
        <BalanceModal />
      </div>
    </BalanceContext.Provider>
  );
};

export default Balance;
