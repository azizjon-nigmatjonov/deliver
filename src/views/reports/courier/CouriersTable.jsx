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
import { getCourierReports } from "services/reports";
import numberToPrice from "helpers/numberToPrice";
import { useHistory } from "react-router-dom";
import SwitchColumns from "components/Filters/SwitchColumns";

function convertMinsToHrsMins(minutes) {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  return h + " ч. " + m + " мин.";
}

export default function CourierTable({ filters, tabValue }) {
  const history = useHistory();
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [couirersColumns, setCouriersColumns] = useState([]);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, filters, limit, tabValue]);

  const getItems = (page) => {
    setLoader(true);
    getCourierReports({ limit, page, ...filters })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.reports,
        });
      })
      .finally(() => setLoader(false));
  };

  const initialCouriersColumns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("first.name"),
      key: "name",
      dataIndex: "name",
      render: (record) => (
        <>
          {record?.courier?.first_name && record?.courier?.last_name
            ? `${record?.courier?.first_name} ${record?.courier?.last_name} `
            : "Итого"}
        </>
      ),
    },
    {
      title: t("orders.amount"),
      key: "delivery_count",
      dataIndex: "delivery_count",
      render: (record) => <>{record?.order_count}</>,
    },
    {
      title: t("sum.of.all.orders"),
      key: "sum-of-orders",
      dataIndex: "sum_of_all_orders",
      render: (record) => (
        <>
          {record?.total_price} {t("uzb.sum")}{" "}
        </>
      ),
    },
    {
      title: t("minimum.distance"),
      key: "minimum-distance",
      dataIndex: "minimum-distance",
      render: (record) => (
        <>
          {record?.min_distance} {t("km")}
        </>
      ),
    },
    {
      title: t("average"),
      key: "average",
      dataIndex: "average",
      render: (record) => (
        <>
          {record?.avg_distance} {t("km")}
        </>
      ),
    },
    {
      title: t("longest"),
      key: "longest",
      dataIndex: "longest",
      render: (record) => (
        <>
          {record?.max_distance} {t("km")}
        </>
      ),
    },
    {
      title: t("total.driving.distance.km"),
      key: "total-driving-distance",
      dataIndex: "total_driving_distance",
      render: (record) => (
        <>
          {record?.total_distance} {t("km")}
        </>
      ),
      // render: (record) => (
      //   <>{record.km && record.km != 0 ? record.km / 1000 : "0"} км</>
      // ),
    },
    {
      title: t("courier.category"),
      key: "courier-category",
      dataIndex: "courier_category",
      render: (record) => <>{record?.courier_type}</>,
    },
    {
      title: t("delivery.price"),
      key: "delivery-price",
      dataIndex: "delivery_price",
      render: (record) => (
        <>
          {record?.delivery_price} {t("uzb.sum")}
        </>
      ),
    },
    {
      title: t("total.delivery.time"),
      key: "total-delivery-time",
      dataIndex: "total_delivery_time",
      render: (record) => <>{record?.total_time}</>,
    },
    {
      title: t("long.delivery.time"),
      key: "long.delivery-time",
      dataIndex: "long_delivery_time",
      render: (record) => <>{record?.max_time}</>,
    },
    {
      title: t("average.delivery.time"),
      key: "average-delivery-time",
      dataIndex: "average_delivery_time",
      render: (record) => <>{record?.avg_time}</>,
    },
    {
      title: t("short.delivery.time"),
      key: "short-delivery-time",
      dataIndex: "short_delivery_time",
      render: (record) => <>{record?.min_time}</>,
    },
    {
      title: t("cancelled.orders"),
      key: "cancelled-orders",
      dataIndex: "canceled_orders_count",
      render: (record) => <>{record?.canceled_orders_count}</>,
    },
  ];

  useEffect(() => {
    let _columns = [
      ...initialCouriersColumns,
      {
        title: (
          <SwitchColumns
            columns={initialCouriersColumns}
            onChange={(val) =>
              setCouriersColumns((prev) => [...val, prev[prev.length - 1]])
            }
            iconClasses="flex justify-end mr-1"
          />
        ),
      },
    ];
    setCouriersColumns(_columns);
  }, [history, tabValue, t]);

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
              {couirersColumns.map((elm) => (
                <TableCell
                  key={elm.key}
                  className="whitespace-nowrap"
                  align="center"
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
                    onClick={() => history.push(`courier/${item.courier.id}`)}
                  >
                    {couirersColumns.map((col) => (
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
