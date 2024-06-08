import React, { useMemo, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { FinanceContext } from "./context";
import moment from "moment";
import { useTheme } from "@mui/material";
import UI from "./UI";
import { useKitchen } from "services/v2/kitchen";
import { useSelector } from "react-redux";

const KitchenFinance = () => {
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(true);
  const [value, setValue] = useState(0);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const START_DATE = `${moment().format("YYYY-MM-DD")}`;
  const END_DATE = `${moment().add(1, "d").format("YYYY-MM-DD")}`;
  const [range, setRange] = useState({
    start_date: START_DATE,
    end_date: END_DATE,
  });
  const { t } = useTranslation();
  const theme = useTheme();
  const { branch_id } = useSelector((state) => state.auth);
  //HeadColumns
  const SumnCount = [
    {
      key: "sum",
      title: t("sum"),
    },
    {
      key: "count",
      title: t("amount_shortened"),
    },
  ];
  const orderHeadColumns = useMemo(() => {
    return [
      {
        title: " ",
        footer_title: t("total"),
        key: "payment_type",
        render: (value) => (
          <div style={{ textTransform: "capitalize" }}>
            {t(value?.payment_type)}
          </div>
        ),
      },
      {
        title: t("fair"),
        key: "delivery_orders",
        columns: SumnCount,
      },
      {
        title: t("self_pickup"),
        key: "self_pickup_orders",
        columns: SumnCount,
      },
      {
        title: t("aggregator"),
        key: "aggregator_orders",
        columns: SumnCount,
      },
      {
        title: t("canceled_orders"),
        key: "canceled_orders",
        columns: SumnCount,
      },
      {
        title: t("total"),
        key: "total_orders",
        columns: SumnCount,
      },
    ];
  }, [SumnCount]);
  const courierHeadColumns = useMemo(() => {
    return [
      {
        title: " ",
        footer_title: t("total"),
        key: "courier_name",
      },
      {
        title: t("cash"),
        key: "cash_orders",
        columns: SumnCount,
      },
      {
        title: "Payme",
        key: "payme_orders",
        columns: SumnCount,
      },
      {
        title: "Click",
        key: "click_orders",
        columns: SumnCount,
      },
      {
        title: "Apelsin",

        key: "canceled_orders",
        columns: SumnCount,
      },
      {
        title: t("transfer"),
        key: "transfer_orders",
        columns: SumnCount,
      },
      {
        title: t("canceled_orders"),
        key: "canceled_orders",
        columns: SumnCount,
      },
      {
        title: t("total"),
        key: "total_orders",
        columns: SumnCount,
      },
    ];
  }, [SumnCount]);

  //Requests_Query
  const { orderFinanceRepostQuery } = useKitchen({
    orderFinanceParams: {
      branch_id: branch_id,
      from_date: range?.start_date ? range?.start_date : START_DATE,
      to_date: range?.end_date ? range?.end_date : END_DATE,
    },
    orderFinanceProps: {
      enabled: value === 0,
    },
  });
  const { courierFinanceRepostQuery } = useKitchen({
    courierFinanceParams: {
      branch_id: branch_id,
      from_date: range?.start_date ? range?.start_date : START_DATE,
      to_date: range?.end_date ? range?.end_date : END_DATE,
      page: currentPage,
      limit: limit,
    },
    courierFinanceProps: {
      enabled: value === 1,
    },
  });
  console.log(orderFinanceRepostQuery);

  //Handlers
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => setValue(index);

  //UI props
  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  return (
    <FinanceContext.Provider
      value={{
        orderHeadColumns,
        courierHeadColumns,
        courierFinanceReportData: courierFinanceRepostQuery?.data,
        orderFinanceReportData: orderFinanceRepostQuery?.data,
        loader,
        setSearch,
        range,
        setRange,
        search,
        value,
        theme,
        setValue,
        a11yProps,
        handleChange,
        handleChangeIndex,
        tabLabel,
        limit,
        setLimit,
        setCurrentPage,
      }}
    >
      <div>
        <UI />
      </div>
    </FinanceContext.Provider>
  );
};

export default KitchenFinance;
