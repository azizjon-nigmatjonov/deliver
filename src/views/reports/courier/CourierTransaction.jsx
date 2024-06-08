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
import TextFilter from "components/Filters/TextFilter";
import { useTransactionReport } from "services/reports";

const CourierTransaction = ({ filters, request, setRequest }) => {
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();

  const { data: transactionReport, refetch } = useTransactionReport({
    params: {
      page: request.page,
      limit: request.limit,
      from_date: filters?.from_date,
      to_date: filters?.to_date,
      order_by: request.order_by,
      sort: request.sort,
    },
    props: {
      enabled: true,
      onSuccess: () => setLoader(false),
    },
  });
  console.log({ request, filters });
  useEffect(() => refetch(), [request, filters]);

  const columns = [
    {
      title: "№",
      key: "order-number",
      sorter: false,
      render: (_, index) => <>{(request.page - 1) * 10 + index + 1}</>,
    },
    {
      title: t("first.name"),
      key: "first_name",
      dataIndex: "first_name",
      render: (record) => <>{record.first_name}</>,
    },
    {
      title: t("last.name"),
      key: "last_name",
      dataIndex: "last_name",
      render: (record) => <>{record.last_name}</>,
    },
    {
      title: t("phone.number"),
      key: "phone",
      dataIndex: "phone",
      render: (record) => <>{record.phone}</>,
    },
    {
      title: t("earned"),
      key: "earned",
      dataIndex: "earned",
      onSort: (sort_type) =>
        setRequest((prev) => ({
          ...prev,
          sort: sort_type ?? "",
          order_by: sort_type ? "earned" : "",
        })),
      render: (record) => <>{record.earned}</>,
    },

    {
      title: t("paid"),
      key: "paid",
      dataIndex: "paid",
      onSort: (sort_type) =>
        setRequest((prev) => ({
          ...prev,
          sort: sort_type ?? "",
          order_by: sort_type ? "paid" : "",
        })),
      render: (record) => <>{record.paid}</>,
    },
  ];

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={transactionReport?.count}
          onChange={(page) =>
            setRequest((prev) => ({
              ...prev,
              page,
            }))
          }
          limit={request.limit}
          onChangeLimit={(limit) =>
            setRequest((prev) => ({
              ...prev,
              limit,
            }))
          }
        />
      }
    >
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell className="whitespace-nowrap " key={elm.key}>
                  <TextFilter className="m-5" sorter {...elm} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader && transactionReport?.couriers
              ? transactionReport?.couriers.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
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
};

export default CourierTransaction;
