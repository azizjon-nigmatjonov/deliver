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
import numberToPrice from "helpers/numberToPrice";
import SwitchColumns from "components/Filters/SwitchColumns";
import { getOrders } from "services";
import orderTimer from "helpers/orderTimer";

function AllReport({ tabValue, dateValue }) {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    if (tabValue === 0) {
      getItems();
    }
  }, [dateValue, limit, currentPage]);

  const getItems = (branchId) => {
    setLoader(true);
    getOrders({
      start_date: dateValue?.custom_start_date,
      end_date: dateValue?.custom_end_date,
      status_id: "e665273d-5415-4243-a329-aee410e39465",
      limit: limit,
      page: currentPage,
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.orders,
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
      title: t("name.branch"),
      key: "name.branch",
      dataIndex: "name.branch",
      render: (record) => <>{record?.steps[0].branch_name}</>,
    },
    {
      title: t("general_time"),
      key: "general_time",
      dataIndex: "general_time",
      render: (record) => (
        <>
          {orderTimer(
            record?.created_at || undefined,
            record?.finished_at || undefined,
            record?.future_time || undefined,
          )}
        </>
      ),
    },
    {
      title: t("operator.accepted"),
      key: "operator.accepted",
      dataIndex: "operator.accepted",
      render: (record) => (
        <>
          {orderTimer(
            record?.finished_at?.length
              ? record.finished_at
              : record?.status_notes?.find(
                  (status_note) =>
                    status_note?.status_id ===
                    "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1",
                )?.created_at,
            record.future_time,
            record.status_id,
          )}
        </>
      ),
    },
    {
      title: t("branch.accepted"),
      key: "branch.accepted",
      dataIndex: "branch.accepted",
      render: (record) => (
        <>
          {record?.operator_accepted_at?.length
            ? orderTimer(
                record.operator_accepted_at,
                record?.finished_at?.length
                  ? record.finished_at
                  : record?.status_notes?.find(
                      (status_note) =>
                        status_note?.status_id ===
                        "1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3",
                    )?.created_at,
                record.future_time,
                record.status_id,
              )
            : "---:--:---"}
        </>
      ),
    },

    {
      title: t("branch.prepared"),
      key: "branch.prepared",
      dataIndex: "branch.prepared",
      render: (record) => (
        <>
          {record?.operator_accepted_at?.length
            ? orderTimer(
                record.operator_accepted_at,
                record?.finished_at?.length
                  ? record.finished_at?.length
                  : record?.status_notes?.find(
                      (status_note) =>
                        status_note?.status_id ===
                        "b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd",
                    )?.created_at,
                record.future_time,
                record.status_id,
              )
            : "---:--:---"}
        </>
      ),
    },
    {
      title: t("courier.onTheWay"),
      key: "courier.onTheWay",
      dataIndex: "courier.onTheWay",
      render: (record) => (
        <>
          {record?.operator_accepted_at?.length
            ? orderTimer(
                record.operator_accepted_at,
                record?.finished_at?.length
                  ? record.finished_at
                  : record?.status_notes?.find(
                      (status_note) =>
                        status_note?.status_id ===
                        "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1",
                    )?.created_at,
                record.future_time,
                record.status_id,
              )
            : "---:--:---"}
        </>
      ),
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
export default AllReport;
