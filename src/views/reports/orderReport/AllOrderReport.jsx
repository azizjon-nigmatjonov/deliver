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
import { getProductReportWithTime } from "services/reports";
import numberToPrice from "helpers/numberToPrice";
import SwitchColumns from "components/Filters/SwitchColumns";
import { getSourceIcon, paymentTypeIconMake } from "views/orders/form/api";

function AllOrderReport({ tabValue, filters }) {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (tabValue === 1) {
      getItems();
    }
  }, [filters, currentPage, limit]);

  const getItems = () => {
    setLoader(true);
    getProductReportWithTime({
      limit,
      page: currentPage,
      start_date: filters?.from_date,
      end_date: filters?.to_date,
      source: filters?.source,
      payment_type: filters?.payment_type,
      delivery_type: filters?.type_deliver,
      aggregator_id: filters?.aggregators,
      courier_id: filters?.courier_id,
      branch_ids: filters?.branch_id,
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
      render: (record) => <>{numberToPrice(record?.external_order_id, "")}</>,
    },
    {
      title: t("operator"),
      key: "operator",
      dataIndex: "operator",
      render: (record) => <>{record?.operator_name}</>,
    },
    {
      title: t("branch"),
      key: "branch",
      dataIndex: "branch",
      render: (record) => <>{record?.branch_name}</>,
    },
    {
      title: t("delivery.type"),
      key: "delivery.type",
      dataIndex: "delivery.type",
      render: (record) => <>{t(`${record?.delivery_type}`)}</>,
    },
    {
      title: t("courier"),
      key: "courier",
      dataIndex: "courier",
      render: (record) => <>{record?.courier_name}</>,
    },
    {
      title: t("source"),
      key: "source",
      dataIndex: "source",
      render: (record) => (
        <div className="flex justify-center">
          <img src={getSourceIcon(record?.source)} alt="source_icon" />
        </div>
      ),
    },
    {
      title: t("payment_type"),
      key: "payment_type",
      dataIndex: "payment_type",
      render: (record) => (
        <div className="flex justify-center">
          <img
            src={paymentTypeIconMake(record?.payment_type)}
            alt={record?.payment_type}
          />
        </div>
      ),
    },
    {
      title: t("order.price"),
      key: "order.price",
      dataIndex: "order.price",
      render: (record) => <>{record.order_amount}</>,
    },
    {
      title: t("delivery.price"),
      key: "delivery_price",
      dataIndex: "delivery_price",
      render: (record) => <>{record.delivery_price}</>,
    },
    {
      title: t("new_order"),
      key: "new_report",
      dataIndex: "new_report",
      render: (record) => <>{record?.created_at}</>,
    },
    {
      title: t("checked_out_time"),
      key: "checked_out_time",
      dataIndex: "checked_out_time",
      render: (record) => <>{record?.operator_accepted_time}</>,
    },
    {
      title: t("designed_timer"),
      key: "designed_timer",
      dataIndex: "designed_timer",
      render: (record) => <>{record?.operator_accepted_time_amount}</>,
    },
    {
      title: t("kitchen_accepted"),
      key: "kitchen_accepted",
      dataIndex: "kitchen_accepted",
      render: (record) => <>{record?.vendor_accepted_time_amount}</>,
    },
    {
      title: t("kitchen_adopted_timer"),
      key: "kitchen_adopted_timer",
      dataIndex: "kitchen_adopted_timer",
      render: (record) => <>{record?.vendor_ready_time_amount}</>,
    },
    {
      title: t("kitchen_prepared_time"),
      key: "kitchen_prepared_time",
      dataIndex: "kitchen_prepared_time",
      render: (record) => <>{record?.vendor_ready_time}</>,
    },
    {
      title: t("kitchen_prepared_timer"),
      key: "kitchen_prepared_time",
      dataIndex: "kitchen_prepared_time",
      render: (record) => <>{record?.vendor_ready_time_amount}</>,
    },
    {
      title: t("courier_took_time"),
      key: "courier_took_time",
      dataIndex: "courier_took_time",
      render: (record) => <>{record?.courier_accepted_time}</>,
    },
    {
      title: t("courier_took_timer"),
      key: "courier_took_timer",
      dataIndex: "courier_took_timer",
      render: (record) => <>{record?.courier_accepted_time_amount}</>,
    },
    {
      title: t("courier_took_the_time"),
      key: "courier_took_the_time",
      dataIndex: "courier_took_the_time",
      render: (record) => <>{record?.courier_picked_time}</>,
    },
    {
      title: t("courier_took_the_timer"),
      key: "courier_took_the_timer",
      dataIndex: "courier_took_the_timer",
      render: (record) => <>{record?.courier_picked_time_amount}</>,
    },
    {
      title: t("courier_delivered_time"),
      key: "courier_delivered_time",
      dataIndex: "courier_delivered_time",
      render: (record) => <>{record?.courier_delivered_time}</>,
    },
    {
      title: t("courier_delivered_timer"),
      key: "courier_delivered_timer",
      dataIndex: "courier_delivered_timer",
      render: (record) => <>{record?.courier_delivered_time_amount}</>,
    },
    {
      title: t("total_time"),
      key: "total_time",
      dataIndex: "total_time",
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
export default AllOrderReport;
