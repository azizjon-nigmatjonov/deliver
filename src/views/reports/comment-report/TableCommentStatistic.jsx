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
import { getReviews } from "services/reports";

function TableCommentStatistic({ tabValue, filters }) {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (tabValue === 3) {
      getItems();
    }
  }, [filters]);

  const getItems = () => {
    setLoader(true);
    getReviews({ ...filters })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.reports,
        });
      })
      .finally(() => setLoader(false));
  };

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{index + 1}</>,
    },
    {
      title: t("type"),
      key: "type",
    },
    {
      title: "👍",
      key: "branch",
    },
    {
      title: "👎",
      key: "branch",
    },
  ];

  return (
    <Card
    // className="m-4"
    >
      <TableContainer className="comment_table rounded-lg border border-lightgray-1">
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
                    <TableCell>{index + 1}</TableCell>
                    <TableCell style={{ textAlign: "center", width: "29%" }}>
                      {t(item.subject_name)}
                    </TableCell>
                    {item.type_reports.map((type_report) => (
                      <TableCell style={{ textAlign: "center", width: "29%" }}>
                        {type_report.count + "/" + type_report.percent + "%"}
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
export default TableCommentStatistic;
