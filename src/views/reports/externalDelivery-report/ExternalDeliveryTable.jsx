import React from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FlagSelect } from "components/FlagSelect";
import { FilterFlagIcon } from "constants/icons";

const ExternalDeliveryTable = ({ filters, setFilters, data }) => {
  const { t } = useTranslation();
  const columns = [
    {
      title: (
        <div className="w-full flex items-center justify-between">
          <p>{t("name")}</p>
          <FlagSelect
            icon={<FilterFlagIcon />}
            options={[
              { value: "", label: t("all") },
              { value: "yandex", label: t("yandex") },
            ]}
            setValue={(external_type) => {
              setFilters((prev) => ({
                ...prev,
                external_type,
              }));
            }}
          />
        </div>
      ),
      key: "external_type",
      render: (record) => <>{record.external_type}</>,
    },
    {
      title: t("order.id"),
      key: "order_external_id",
      render: (record) => <>{record.order_external_id}</>,
    },
    {
      title: t("order.sum"),
      key: "order_amount",
      render: (record) => <>{record.order_amount}</>,
    },
    {
      title: t("delivery_amount"),
      key: "order_delivery_price",
      render: (record) => <>{record.order_delivery_price}</>,
    },
    {
      title: t("yandex.sum"),
      key: "order_yandex_price",
      render: (record) => <>{record.order_yandex_price}</>,
    },
    {
      title: (
        <div className="w-full flex items-center justify-between">
          <FlagSelect
            icon={<FilterFlagIcon />}
            options={[
              { value: "", label: t("all") },
              { value: "server_cancelled", label: t("server.declined") },
              { value: "finished", label: t("finished") },
              { value: "operator_cancelled", label: t("operator.declined") },
            ]}
            setValue={(status) => {
              setFilters((prev) => ({
                ...prev,
                status,
              }));
            }}
          />
          <p>{t("status")}</p>
        </div>
      ),
      key: "order_status",
      render: (record) => <>{t(record.order_status)}</>,
    },
  ];

  return (
    <TableContainer
      className="rounded-lg border border-lightgray-1"
      style={{ minHeight: data && data.length > 5 ? "auto" : "400px" }}
    >
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
          {data && data.length
            ? data.map((item, index) => (
                <TableRow
                  key={item.product_id}
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
  );
};

export default ExternalDeliveryTable;
