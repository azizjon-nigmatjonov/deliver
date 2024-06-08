import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getProductReportWithDelayed } from "services/reports";
import SwitchColumns from "components/Filters/SwitchColumns";
import { paymentTypeIconMake } from "views/orders/form/api";

function DeliveryChargeReport({ tabValue, filters }) {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (tabValue === 3) {
      getItems();
    }
  }, [filters, limit, currentPage]);

  const getItems = () => {
    setLoader(true);
    getProductReportWithDelayed({
      start_date: filters?.custom_from_date,
      end_date: filters?.to_date,
      page: currentPage,
      limit,
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.reports,
        });
      })
      .finally(() => setLoader(false));
  };

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("order_id"),
      key: "order_id",
      dataIndex: "order_id",
      render: (record) => <>{record?.external_order_id}</>,
    },
    {
      title: t("branch"),
      key: "branch",
      dataIndex: "branch",
      render: (record) => <>{record?.branch_name}</>,
    },
    {
      title: t("courier"),
      key: "courier",
      dataIndex: "courier",
      render: (record) => <>{record?.courier_name}</>,
    },
    {
      title: t("payment_type"),
      key: "payment_type",
      dataIndex: "payment_type",
      render: (record) => (
        <>
          <img
            src={paymentTypeIconMake(record?.payment_type)}
            alt={record?.payment_type}
          />
        </>
      ),
    },

    {
      title: t("order.price"),
      key: "order.price",
      dataIndex: "order.price",
      render: (record) => <>{record?.order_amount}</>,
    },
    {
      title: t("amount_received"),
      key: "amount_received",
      dataIndex: "amount_received",
      render: (record) => <>{record?.is_courier_get_paid ? "Да" : "Нет"}</>,
    },
    {
      title: t("cause"),
      key: "cause",
      dataIndex: "cause",
      render: (record) => <>{record?.delayed_reason}</>,
    },
    {
      title: t("time"),
      key: "time",
      dataIndex: "time",
      render: (record) => <>{record?.total_time}</>,
    },
  ];
  useEffect(() => {
    const _columns = [
      ...initialColumns,
      {
        title: (
          <SwitchColumns
            columns={initialColumns}
            onChange={(val) => {
              setColumns((prev) => [...val, prev[prev.length - 1]]);
            }}
            sortable={false}
            iconClasses="flex justify-end mr-1"
          />
        ),
      },
    ];
    setColumns(_columns);
  }, [currentPage, limit]);
  return (
    <Card
      // className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          limit={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
        />
      }
    >
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell
                  key={elm.key}
                  style={{ textAlign: "center" }}
                  className="whitespace-nowrap"
                >
                  {elm.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader && items.data && items.data.length
              ? items.data.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        style={{ textAlign: "center" }}
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
export default DeliveryChargeReport;
