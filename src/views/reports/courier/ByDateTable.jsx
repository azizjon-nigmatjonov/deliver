import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { getCourierOrderReports } from "services/reports";
import SwitchColumns from "components/Filters/SwitchColumns";

export default function ByDateTable({ filters, tabValue, couriers }) {
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateColumns, setDateColumns] = useState([]);

  let courier_id =
    filters?.branch_id === null ? couriers[0]?.value : filters?.branch_id;

  const getItems = useCallback(() => {
    setLoader(true);

    if (courier_id) {
      getCourierOrderReports({
        ...filters,
        courier_id: courier_id,
      })
        .then((res) => {
          setItems({
            count: res?.count,
            data: res?.reports,
          });
        })
        .finally(() => setLoader(false));
    }
  }, [courier_id, filters]);

  useEffect(() => {
    if (tabValue === 1) {
      getItems();
    }
  }, [currentPage, filters, limit, tabValue, couriers, getItems]);

  const initialDateColumns = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
      },
      {
        title: t("date"),
        key: "date",
        render: (record) => <>{record?.date}</>,
      },
      {
        title: t("delivery"),
        key: "delivery",
        render: (record) => <>{record?.order_count}</>,
      },
      {
        title: t("delivery_amount"),
        key: "sum-of-delivery",
        render: (record) => (
          <>
            {record?.orders_price} {t("uzb.sum")}
          </>
        ),
      },
      {
        title: t("total.km"),
        key: "total-km",
        dataIndex: "total_km",
        render: (record) => (
          <>
            {record?.total_distance} {t("km")}
          </>
        ),
      },
      {
        title: t("avg.distance"),
        key: "avg-distance",
        render: (record) => (
          <>
            {record?.avg_distance} {t("km")}
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
        title: t("average.delivery.time"),
        key: "average-delivery-time",
        dataIndex: "avg_delivery_time",
        render: (record) => <>{record?.avg_time}</>,
      },
      {
        title: t("started.time"),
        key: "total-driving-distance",
        dataIndex: "total_driving_distance",
        render: (record) => <>{record?.attendance_time}</>,
        // render: (record) => (
        //   <>{record.km && record.km != 0 ? record.km / 1000 : "0"} км</>
        // ),
      },
    ],
    [currentPage, t],
  );

  useEffect(() => {
    let _columns = [
      ...initialDateColumns,
      {
        title: (
          <SwitchColumns
            columns={initialDateColumns}
            onChange={(val) =>
              setDateColumns((prev) => [...val, prev[prev.length - 1]])
            }
            iconClasses="flex justify-end mr-1"
          />
        ),
      },
    ];
    setDateColumns(_columns);
  }, [tabValue, initialDateColumns]);

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
              {dateColumns.map((elm) => (
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
                  >
                    {dateColumns.map((col) => (
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
