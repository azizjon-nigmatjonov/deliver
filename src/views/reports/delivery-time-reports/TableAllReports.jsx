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
import { getTimeReport } from "services/reports";

function TableAllReports({ filters, tabValue }) {
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const getItems = () => {
    setLoader(true);
    getTimeReport({
      start_date: filters.start_date + " " + "05:00:00",
      end_date: filters.end_date + " " + "05:00:00",
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.reports,
        });
      })
      .finally(() => setLoader(false))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    setLoader(false);
    if (tabValue === 1) {
      getItems();
    }
  }, [filters]);

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{index + 1}</>,
    },
    {
      title: t("name"),
      key: "name",
      dataIndex: "name",
      render: (record) => <>{record?.branch_name}</>,
    },
    {
      title: t("Менее 30 минут"),
      key: "От 10 до 11",
      dataIndex: "general.count",
      render: (record) => <>{record?.under_30}</>,
    },
    {
      title: t("От 30 до 40 минут"),
      key: "От 12 до 13",
      dataIndex: "total_amount",
      render: (record) => <>{record?.range_30_40}</>,
    },
    {
      title: t("От 40 до 60 минут"),
      key: "От 11 до 12",
      dataIndex: "total_amount",
      render: (record) => <>{record?.range_40_60}</>,
    },

    {
      title: t("Более 60 минут"),
      key: "От 13 до 14",
      dataIndex: "total_amount",
      render: (record) => <>{record?.over_60}</>,
    },
  ];
  return (
    <Card>
      <TableContainer
        style={{ maxHeight: "70vh" }}
        className="rounded-lg border border-lightgray-1"
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
export default TableAllReports;
