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
import { getOperatorReviews } from "services/reports";

function TableCommentOperator({ tabValue, filters }) {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (tabValue === 1) {
      getItems();
    }
  }, [filters]);

  const getItems = () => {
    setLoader(true);
    getOperatorReviews({
      start_date: filters.start_date,
      end_date: filters.end_date,
    })
      .then((res) => {
        setItems({
          count: res?.count,
          operator_reports: res?.operator_reports,
          related_subject_report: res?.related_subject_report,
        });
      })
      .finally(() => setLoader(false));
  };
  const isLike = {
    like: "👍",
    dislike: "👎",
  };
  return (
    <Card>
      <TableContainer
        style={{ maxHeight: "70vh" }}
        className=" rounded-lg border border-lightgray-1"
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {!loader &&
                items.operator_reports &&
                items.operator_reports.length && (
                  <>
                    <TableCell
                      className="whitespace-nowrap"
                      style={{ textAlign: "center" }}
                    >
                      №
                    </TableCell>
                    <TableCell
                      className="whitespace-nowrap"
                      style={{ textAlign: "center" }}
                    >
                      {t("fio")}
                    </TableCell>
                    {items.related_subject_report?.map((elm) => {
                      return elm.type_reports?.map((type_report) => (
                        <TableCell
                          className="whitespace-nowrap"
                          style={{ textAlign: "center" }}
                        >
                          {isLike[type_report.type] +
                            " " +
                            type_report.count +
                            " / " +
                            type_report.percent +
                            " " +
                            "%"}
                        </TableCell>
                      ));
                    })}
                  </>
                )}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader && items.operator_reports && items.operator_reports.length
              ? items.operator_reports?.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {" "}
                    <TableCell>{index + 1}</TableCell>
                    <TableCell
                      style={{ textAlign: "center", width: "20%" }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </TableCell>
                    {item.related_subjects[0].type_reports?.map(
                      (type_reports) => (
                        <>
                          <TableCell
                            style={{ textAlign: "center", width: "40%" }}
                            // className="whitespace-nowrap"
                          >
                            {type_reports.count +
                              " " +
                              "/" +
                              " " +
                              type_reports.percent +
                              " " +
                              "%"}
                          </TableCell>
                        </>
                      ),
                    )}
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
export default TableCommentOperator;
