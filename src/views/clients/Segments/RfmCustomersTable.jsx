import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LoaderComponent from "components/Loader";
import { useTranslation } from "react-i18next";

const RfmCustomersTable = ({ currentPage, limit, loader, customers }) => {
  const { t } = useTranslation();
  const rfmColumns = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (record, index) => (
          <div>{(currentPage - 1) * limit + index + 1}</div>
        ),
      },
      {
        title: t("client_name"),
        key: "first.name",
        render: (record) => <div>{record.name}</div>,
      },
      {
        title: t("middle.check"),
        key: "middle-check",
        render: (record) => <div>{record.avg_amount}</div>,
      },
      {
        title: t("total.sum"),
        key: "total-sum",
        render: (record) => <div>{record.total_sum}</div>,
      },
      {
        title: t("Дата последнего заказа"),
        key: "last-order-date",
        render: (record) => <div>{record.last_order_day}</div>,
      },
      {
        title: t("tg.bot"),
        key: "tg-bot",
        render: (record) => <div>{record.orders_count_from_bot}</div>,
      },
      {
        title: t("admin"),
        key: "admin",
        render: (record) => <div>{record.orders_count_from_admin}</div>,
      },
      {
        title: t("app"),
        key: "app",
        render: (record) => <div>{record.orders_count_from_app}</div>,
      },
      {
        title: t("site"),
        key: "site",
        render: (record) => <div>{record.orders_count_from_web}</div>,
      },
    ],
    [currentPage, limit, t],
  );
  return (
    <div>
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {rfmColumns?.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              customers?.data?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {rfmColumns?.map((col) => (
                    <TableCell key={col.key}>
                      {col?.render ? col?.render(item, index) : "-----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LoaderComponent isLoader={loader} height={56} />
    </div>
  );
};

export default RfmCustomersTable;
