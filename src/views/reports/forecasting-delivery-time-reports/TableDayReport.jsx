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
import { getCourierPredictReport } from "services/reports";
import { useHistory } from "react-router-dom";
import SwitchColumns from "components/Filters/SwitchColumns";

function TableDayReports({ tabValue, filters }) {
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [columns, setColumns] = useState([]);

  const getItems = () => {
    setLoader(true);
    getCourierPredictReport({
      date: filters.date,
    })
      .then((res) => {
        setItems({
          data: res?.reports,
        });
      })
      .finally(() => setLoader(false));
  };

  const initialColumns = [
    {
      title: t("name"),
      key: "name",
      dataIndex: "name",
      render: (record) => <>{record?.branch_name}</>,
    },
    {
      title: t("От 10 до 11"),
      key: "От 10 до 11",
      dataIndex: "general.count",
      render: (record) => <>{record?.from10to11}</>,
    },
    {
      title: t("От 11 до 12"),
      key: "От 11 до 12",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from11to12}</>,
    },
    {
      title: t("От 12 до 13"),
      key: "От 12 до 13",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from12to13}</>,
    },
    {
      title: t("От 13 до 14"),
      key: "От 13 до 14",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from13to14}</>,
    },
    {
      title: t("От 14 до 15"),
      key: "От 14 до 15",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from14to15}</>,
    },
    {
      title: t("От 15 до 16"),
      key: "От 15 до 16",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from15to16}</>,
    },
    {
      title: t("От 16 до 17"),
      key: "От 16 до 17",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from16to17}</>,
    },
    {
      title: t("От 17 до 18"),
      key: "От 17 до 18",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from17to18}</>,
    },
    {
      title: t("От 18 до 19"),
      key: "От 18 до 19",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from18to19}</>,
    },
    {
      title: t("От 19 до 20"),
      key: "От 19 до 20",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from19to20}</>,
    },
    {
      title: t("От 20 до 21"),
      key: "От 20 до 21",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from20to21}</>,
    },
    {
      title: t("От 21 до 22"),
      key: "От 21 до 22",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from21to22}</>,
    },
    {
      title: t("От 22 до 23"),
      key: "От 22 до 23",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from22to23}</>,
    },
    {
      title: t("От 23 до 00"),
      key: "От 23 до 00",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from23to00}</>,
    },
    {
      title: t("От  00 до 01"),
      key: "От 00 до 01",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from00to01}</>,
    },
    {
      title: t("От 01 до 02"),
      key: "От 01 до 02",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from01to02}</>,
    },
    {
      title: t("От 02 до 03"),
      key: "От 26 02 03",
      dataIndex: "total_amount",
      render: (record) => <>{record?.from02to03}</>,
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
  useEffect(() => {
    if (tabValue === 0 && filters?.date !== "Invalid date") {
      getItems();
    }
  }, [filters]);
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
                    onClick={() => history.push(`courier/${item.courier.id}`)}
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
export default TableDayReports;
