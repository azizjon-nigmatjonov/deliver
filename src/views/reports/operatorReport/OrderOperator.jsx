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
import { getOperatorReport } from "services/reports";
import numberToPrice from "helpers/numberToPrice";
import { useHistory } from "react-router-dom";
import { formatTimer } from "utils/formatTimer";
import { formatNumber } from "utils/formatNumber";
import SwitchColumns from "components/Filters/SwitchColumns";

function OrderOperator({ filters }) {
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    getItems({ limit });
  }, [filters]);

  const getItems = () => {
    setLoader(true);
    getOperatorReport({
      start_date: filters?.from_date + " " + "5:00:00",
      end_date: filters?.to_date + " " + "5:00:00",
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
      title: t("first.name"),
      key: "first.name",
      dataIndex: "first.name",
      render: (record) => <>{record?.name}</>,
    },
    {
      title: t("count.orders"),
      key: "count.orders",
      dataIndex: "count.orders",
      render: (record) => <>{record?.total_orders_count}</>,
    },
    {
      title: t("total.sum"),
      key: "total.sum",
      dataIndex: "total.sum",
      render: (record) => <>{numberToPrice(record?.total_sum, "")}</>,
    },
    {
      title: t("order_processing_time"),
      key: "order_processing_time",
      dataIndex: "order_processing_time",
      render: (record) => <>{formatTimer(record?.avg_order_time, t)}</>,
    },
    {
      title: t("average_total_order"),
      key: "average_total_order",
      dataIndex: "average_total_order",
      render: (record) => (
        <>{formatNumber(record?.total_sum / record?.total_orders_count)}</>
      ),
    },
    {
      title: t("delivery_qty"),
      key: "delivery_qty",
      dataIndex: "delivery_qty",
      render: (record) => <>{record?.total_count_delivery}</>,
    },
    {
      title: t("delivery_amount"),
      key: "delivery_amount",
      dataIndex: "delivery_amount",
      render: (record) => <>{numberToPrice(record?.total_sum_delivery, "")}</>,
    },
    {
      title: t("average_receipt_delivery"),
      key: "average_receipt_delivery",
      dataIndex: "average_receipt_delivery",
      render: (record) => (
        <>
          {formatNumber(
            record?.total_sum_delivery / record?.total_count_delivery,
          )}
        </>
      ),
    },
    {
      title: t("pickup_quantity"),
      key: "pickup_quantity",
      dataIndex: "pickup_quantity",
      render: (record) => (
        <>{record?.total_orders_count - record?.total_count_delivery}</>
      ),
    },
    {
      title: t("pickup_amount"),
      key: "pickup_amount",
      dataIndex: "pickup_amount",
      render: (record) => (
        <>{numberToPrice(record?.total_sum - record?.total_sum_delivery)}</>
      ),
    },
    {
      title: t("average_pickup_receipt"),
      key: "average_pickup_receipt",
      dataIndex: "average_pickup_receipt",
      render: (record) => (
        <>
          {formatNumber(
            (record?.total_sum - record?.total_sum_delivery) /
              (record?.total_orders_count - record?.total_count_delivery),
          )}
        </>
      ),
    },
    {
      title: t("admin"),
      key: "admin",
      dataIndex: "admin",
      render: (record) => <>{record?.admin_panel_orders_count}</>,
    },
    {
      title: t("app"),
      key: "app",
      dataIndex: "app",
      render: (record) => <>{record?.app_orders_count}</>,
    },
    {
      title: t("telegram_bot"),
      key: "telegram_bot",
      dataIndex: "telegram_bot",
      render: (record) => <>{record?.bot_orders_count}</>,
    },
    {
      title: t("website"),
      key: "website",
      dataIndex: "website",
      render: (record) => <>{record?.website_orders_count}</>,
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
  }, []);
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
                <TableCell key={elm.key} className="whitespace-nowrap">
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
                    onClick={() => history.push(`courier/${item.courier.id}`)}
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
export default OrderOperator;
