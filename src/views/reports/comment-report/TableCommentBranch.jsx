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
import { getBranchReviews } from "services/reports";

function TableCommentBranch({ tabValue, filters }) {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (tabValue === 0) {
      getItems();
    }
  }, [filters]);

  const getItems = (branchId) => {
    setLoader(true);
    getBranchReviews({
      start_date: filters.start_date,
      end_date: filters.end_date,
    })
      .then((res) => {
        setItems({
          branch_reports: res?.branch_reports,
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
      <TableContainer className=" comment_table rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            {!loader &&
            items.related_subject_report &&
            items.related_subject_report.length ? (
              <>
                <TableRow>
                  <TableCell rowSpan={2}>№</TableCell>
                  <TableCell rowSpan={2}>{t("branches")}</TableCell>
                  {items?.related_subject_report?.map((subject_report) => (
                    <TableCell colSpan={2} style={{ textAlign: "center" }}>
                      {t(subject_report?.subject_name)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {items?.related_subject_report?.map((subject_report) => (
                    <>
                      {subject_report.type_reports.map((type_report, index) => (
                        <TableCell style={{ textAlign: "center" }}>
                          {isLike[type_report.type]}{" "}
                          {`${type_report.count} / ${type_report.percent}%`}
                        </TableCell>
                      ))}
                    </>
                  ))}
                </TableRow>
              </>
            ) : (
              ""
            )}
          </TableHead>
          <TableBody>
            {!loader && items.branch_reports && items.branch_reports.length
              ? items.branch_reports.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    {item.related_subjects.map((elm) => (
                      <>
                        <TableCell
                          key={item?.id}
                          style={{ textAlign: "center" }}
                        >
                          {elm.type_reports[0].count} /{" "}
                          {elm.type_reports[0].percent} %
                        </TableCell>
                        <TableCell
                          key={item?.id}
                          style={{ textAlign: "center" }}
                        >
                          {elm.type_reports[1].count} /{" "}
                          {elm.type_reports[1].percent} %
                        </TableCell>
                      </>
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
export default TableCommentBranch;
