import React, { useCallback, useEffect, useState } from "react";
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
import { getBranchOrderTimeReport } from "services/reports";
import moment from "moment";

function BranchOrderTimeReport({ filters, tabValue }) {
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [columns, setColumns] = useState([]);
  const getItems = useCallback(() => {
    setLoader(true);
    getBranchOrderTimeReport({
      ...filters,
      from_date: filters?.from_date,
      to_date: filters?.to_date,
      from_time:
        filters.from_time !== null
          ? moment(filters.from_time).format("HH:mm:ss")
          : "",
      to_time:
        filters.to_time !== null
          ? moment(filters.to_time).format("HH:mm:ss")
          : "",
      branch_id: filters?.branch_id,
      delivery_type: filters.delivery_type,
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.reports,
        });
      })
      .finally(() => setLoader(false));
  }, [filters]);
  useEffect(() => {
    if (tabValue === 1) {
      getItems();
    }
  }, [filters, tabValue]);

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{index + 1}</>,
    },
    {
      title: t("branch"),
      key: "branch",
      dataIndex: "branch",
      render: (record) => <>{record?.branch_name || "Итого"}</>,
    },
    {
      title: t("common"),
      key: "common",
      dataIndex: "common",
      render: (record) => <>{record?.total_count}</>,
    },
    {
      title: "Менее 30 минут",
      key: "under_30",
      dataIndex: "under_30",
      render: (record) => record?.under_30,
    },
    {
      title: t("menn_qty_35"),
      key: "menn_qty_35",
      dataIndex: "menn_qty_35",
      render: (record) => <>{record?.under_35}</>,
    },
    {
      title: t("more_than_qty_35"),
      key: "more_than_qty_35",
      dataIndex: "more_than_qty_35",
      render: (record) => <>{record?.range_35_60}</>,
    },
    {
      title: t("more_common_35"),
      key: "more_common_35",
      dataIndex: "more_common_35",
      render: (record) => <>{record?.percent_range_35_60}</>,
    },
    {
      title: t("menn_common_35"),
      key: "menn_common_35",
      dataIndex: "menn_common_35",
      render: (record) => <>{record?.percent_under_35}</>,
    },
    {
      title: "30-40 минут",
      key: "range_30_40",
      dataIndex: "range_30_40",
      render: (record) => record?.range_30_40,
    },
    {
      title: "40-50 минут",
      key: "range_40_50",
      dataIndex: "range_40_50",
      render: (record) => record?.range_40_50,
    },
    {
      title: "50-60 минут",
      key: "range_50_60",
      dataIndex: "range_50_60",
      render: (record) => record?.range_50_60,
    },
    {
      title: "Более 60 минут",
      key: "percent_over_60",
      dataIndex: "percent_over_60",
      render: (record) => record?.percent_over_60,
    },
    {
      title: t("more_than_qty_60"),
      key: "more_than_qty_60",
      dataIndex: "more_than_qty_60",
      render: (record) => <>{record?.over_60}</>,
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
                        className="whitespace-nowrap"
                        style={{ textAlign: "center" }}
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
export default BranchOrderTimeReport;
