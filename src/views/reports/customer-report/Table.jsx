import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../../components/Card";
import Pagination from "../../../components/Pagination";
import LoaderComponent from "../../../components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getClientOrderReport } from "../../../services/reports";
import TextFilter from "components/Filters/TextFilter";
import moment from "moment";
import { getSourceIcon } from "views/orders/form/api";

export default function TableCustomer({ filters }) {
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortFilter, setSortFilter] = useState({
    sort_by: null,
    sort_type: null,
  });

  const getItems = (page) => {
    setLoader(true);
    getClientOrderReport({
      ...filters,
      limit,
      page,
      from_time: moment(filters.from_time).format("H:mm:ss"),
      to_time: moment(filters.to_time).format("H:mm:ss"),
      sort_by: sortFilter.sort_by,
      sort_type: sortFilter.sort_type,
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.reports,
        });
      })
      .finally(() => setLoader(false));
  };
  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, filters, limit, sortFilter]);
  const columns = [
    {
      title: "№",
      key: "order-number",
      sorter: false,
      render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("first.name"),
      key: "client_name",
      dataIndex: "client_name",
      onSort: (sort_type) =>
        setSortFilter((prev) => ({
          ...prev,
          sort_type,
          sort_by: "client_name",
        })),
      render: (record) => <>{record.client_name}</>,
    },
    {
      title: t("phone.number"),
      key: "clinet_phone",
      dataIndex: "clinet_phone",
      onSort: (sort_type) =>
        setSortFilter((prev) => ({
          ...prev,
          sort_type,
          sort_by: "clinet_phone",
        })),
      render: (record) => <>{record.clinet_phone}</>,
    },
    {
      title: t("Чек (Средний)"),
      key: "avg_sum",
      dataIndex: "avg_sum",
      onSort: (sort_type) =>
        setSortFilter((prev) => ({
          ...prev,
          sort_type,
          sort_by: "avg_sum",
        })),
      render: (record) => <>{record.avg_sum}</>,
    },
    {
      title: t("Чек(Самый большой)"),
      key: "max_sum",
      dataIndex: "max_sum",
      onSort: (sort_type) =>
        setSortFilter((prev) => ({ ...prev, sort_type, sort_by: "max_sum" })),
      render: (record) => <>{record.max_sum}</>,
    },

    {
      title: t("Чек(Самый маленький)"),
      key: "order_count",
      dataIndex: "min_sum",
      onSort: (sort_type) =>
        setSortFilter((prev) => ({ ...prev, sort_type, sort_by: "min_sum" })),
      render: (record) => <>{record.min_sum}</>,
    },
    {
      title: t("Количество заказов"),
      key: "order_count",
      dataIndex: "order_count",
      onSort: (sort_type) =>
        setSortFilter((prev) => ({
          ...prev,
          sort_type,
          sort_by: "order_count",
        })),
      render: (record) => <>{record.order_count}</>,
    },

    {
      title: t("Итого сумма заказов"),
      key: "order_count",
      dataIndex: "order_count",
      onSort: (sort_type) =>
        setSortFilter((prev) => ({
          ...prev,
          sort_type,
          sort_by: "total_sum ",
        })),
      render: (record) => <>{record.total_sum}</>,
    },
    {
      title: t("Дата рождения"),
      key: "created_at",
      dataIndex: "created_at",
      onSort: (sort_type) =>
        setSortFilter((prev) => ({
          ...prev,
          sort_type,
          sort_by: "order_count ",
        })),
      render: (record) =>
        record.date_of_birth ? record.date_of_birth : "----",
    },
    {
      title: t("Дата регистрации"),
      key: "created_at",
      dataIndex: "created_at",
      onSort: (sort_type) =>
        setSortFilter((prev) => ({
          ...prev,
          sort_type,
          sort_by: "created_at",
        })),
      render: (record) => <>{record.created_at}</>,
    },
    {
      title: t("Источник регистрации"),
      key: "platform",
      dataIndex: "platform",
      onSort: (sort_type) =>
        setSortFilter((prev) => ({
          ...prev,
          sort_type,
          sort_by: "platform",
        })),
      render: (record) => (
        <div className="flex justify-center">
          <img src={getSourceIcon(record.platform)} alt={record.platform} />
        </div>
      ),
    },
    {
      title: t("client.type"),
      key: "client_type",
      dataIndex: "client_type",
      onSort: (sort_type) =>
        setSortFilter((prev) => ({
          ...prev,
          sort_type,
          sort_by: "client_type",
        })),
      render: (record) => <>{record.client_type}</>,
    },
  ];

  return (
    <Card
      className="m-4"
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
                <TableCell className="whitespace-nowrap" key={elm.key}>
                  {" "}
                  <TextFilter sorter {...elm} />
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
                      <TableCell style={{ textAlign: "center" }} key={col.key}>
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
