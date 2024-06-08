import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import LoaderComponent from "components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SwitchColumns from "components/Filters/SwitchColumns";
import { getAggregatorsOrderReport } from "services";
import moment from "moment";
import { paymentTypeIconMake } from "views/orders/form/api";
import numberToPrice from "helpers/numberToPrice";

function AllAggregatorTable({ filters }) {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const currentPage = 1;
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    getItems({ ...filters });
  }, [filters]);

  const getItems = (params) => {
    setLoader(true);
    getAggregatorsOrderReport(params)
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.aggregator_order_reports,
        });
      })
      .finally(() => setLoader(false));
  };

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * 10 + index + 1}</>,
    },
    {
      title: t("order_id"),
      key: "order_id",
      dataIndex: "external_order_id",
      render: (record) => <>{numberToPrice(record?.external_order_id, "")}</>,
    },
    {
      title: t("aggregator"),
      key: "aggregator",
      dataIndex: "aggregator_name",
      render: (record) => <>{record?.aggregator_name}</>,
    },
    {
      title: t("time_date"),
      key: "time_date",
      dataIndex: "aggregator_name",
      render: (record) => <>{moment(record?.date).format("YYYY-MM-DD")}</>,
    },
    {
      title: t("time"),
      key: "time",
      dataIndex: "payment_type",
      render: (record) => <>{moment(record?.date).format("H:mm")}</>,
    },

    {
      title: t("operator"),
      key: "operator",
      dataIndex: "operator_name",
      render: (record) => <>{record?.operator_name}</>,
    },
    {
      title: t("branch"),
      key: "branch",
      dataIndex: "branch_name",
      render: (record) => <>{record?.branch_name}</>,
    },
    {
      title: t("summa"),
      key: "summa",
      dataIndex: "price",
      render: (record) => <>{numberToPrice(record?.price, "")}</>,
    },
    {
      title: t("payment_type"),
      key: "payment_type",
      dataIndex: "payment_type",
      render: (record) => (
        <div className="flex justify-center">
          <img
            className="object-cover"
            src={paymentTypeIconMake(record?.payment_type)}
            alt="record?.payment_type"
          />
        </div>
      ),
    },
    {
      title: t("status"),
      key: "status",
      dataIndex: "time",
      render: (record) => <>{record?.status}</>,
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
    <Card>
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table" className="sticky-table">
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
export default AllAggregatorTable;
