import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import LoaderComponent from "components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getAllReports } from "services/reports";
import moment from "moment";
import SwitchColumns from "components/Filters/SwitchColumns";
import numberToPrice from "helpers/numberToPrice";

export default function ByDateTable({ filters }) {
  const [loader, setLoader] = useState(true);
  const [allReportsData, setAllReportData] = useState([]);
  const { t } = useTranslation();
  const [columns, setColumns] = useState([]);
  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{index + 1}</>,
    },
    {
      title: t("date"),
      key: "date",
      dataIndex: "date",
      render: (record) => (
        <>
          {record?.date?.toString()?.includes("/")
            ? "Итого"
            : moment(record?.date).format("DD.MM.YYYY")}
        </>
      ),
    },
    {
      title: t("fair"),
      key: "fair",
      dataIndex: "fair",
      render: (record) => <>{record?.delivery}</>,
    },
    {
      title: t("total_price"),
      key: "total_price",
      dataIndex: "total_price",
      render: (record) => <>{numberToPrice(record?.total_price, "")}</>,
    },
    {
      title: t("by_product_price"),
      key: "by_product_price",
      dataIndex: "by_product_price",
      render: (record) => <>{numberToPrice(record?.product_price, "")}</>,
    },
    {
      title: t("delivery_amount"),
      key: "delivery_amount",
      dataIndex: "delivery_amount",
      render: (record) => <>{numberToPrice(record?.total_delivery, "")}</>,
    },
    {
      title: t("pickup_amount"),
      key: "pickup_amount",
      dataIndex: "pickup_amount",
      render: (record) => <>{numberToPrice(record?.total_self_pickup, "")}</>,
    },
    {
      title: t("aggregator_amount"),
      key: "aggregator_amount",
      dataIndex: "aggregator_amount",
      render: (record) => <>{numberToPrice(record?.total_aggregator, "")}</>,
    },
    {
      title: t("self_pickup"),
      key: "self_pickup",
      dataIndex: "self_pickup",
      render: (record) => <>{record?.self_pickup}</>,
    },
    {
      title: t("aggregators"),
      key: "aggregators",
      dataIndex: "aggregators",
      render: (record) => <>{record?.aggregators}</>,
    },
    {
      title: t("free_delivery"),
      key: "free_delivery",
      dataIndex: "free_delivery",
      render: (record) => <>{record?.free_delivery}</>,
    },
    {
      title: t("canceled_orders"),
      key: "canceled_orders",
      dataIndex: "canceled_orders",
      render: (record) => <>{record?.canceled_orders}</>,
    },
    {
      title: t("repeat_orders"),
      key: "reissued_order_count",
      dataIndex: "reissued_order_count",
      render: (record) => <>{record?.reissued_order_count}</>,
    },
    {
      title: t("given_cashback"),
      key: "given_cashback",
      dataIndex: "given_cashback",
      render: (record) => <>{record?.given_cashback}</>,
    },
    {
      title: t("canceled_but_sold"),
      key: "canceled_but_sold",
      dataIndex: "canceled_but_sold",
      render: (record) => <>{record?.canceled_but_sold}</>,
    },
  ];

  const fetchData = (page) => {
    setLoader(true);
    getAllReports({
      ...filters,
      to_time: "",
      sort_by: "",
      sort_type: "",
      limit: 10,
      page,
    })
      .then((res) => setAllReportData(res))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);
  useEffect(() => {
    const _columns = [
      ...initialColumns,
      {
        title: (
          <SwitchColumns
            columns={initialColumns}
            onChange={(val) =>
              setColumns((prev) => [...val, prev[prev.length - 1]])
            }
            iconClasses="flex justify-end mr-1"
          />
        ),
      },
    ];
    setColumns(_columns);
  }, []);
  return (
    <Card>
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table" className="sticky-table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell
                  style={{ textAlign: "center" }}
                  key={elm.key}
                  className="whitespace-nowrap"
                >
                  {elm.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader && allReportsData.reports && allReportsData.reports.length
              ? allReportsData.reports.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell
                        style={{ textAlign: "center" }}
                        key={col.key}
                        className="whitespace-nowrap"
                      >
                        {col.render
                          ? col.render(item, index)
                          : item[col.dataIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loader} />
    </Card>
  );
}
