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
import { getStatusTimerReport } from "services/reports";
import { formatTimer } from "utils/formatTimer";

function AllReport({ filters }) {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  const getItems = () => {
    setLoader(true);
    getStatusTimerReport({ ...filters })
      .then((res) => {
        setItems(res?.report);
      })
      .finally(() => setLoader(false));
  };
  useEffect(() => {
    getItems();
  }, [filters]);
  function secondsToTime(secs) {
    secs = Math.round(secs);
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  }
  return (
    <Card>
      <TableContainer className="rounded-lg border border-lightgray-1">
        {!loader && (
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "50%" }}>
                  Среднее время завершения заказа (общее время)
                </TableCell>
                <TableCell style={{ width: "50%" }}>
                  <span>{secondsToTime(items?.courier_picking_avg).h} ч </span>
                  <span>{secondsToTime(items?.courier_picking_avg).m} м </span>
                  <span>
                    {secondsToTime(items?.courier_picking_avg).s} сек{" "}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ width: "50%" }}>
                  Среднее время приёма (филиал)
                </TableCell>
                <TableCell style={{ width: "50%" }}>
                  <span>{secondsToTime(items?.delivering_time_avg).h} ч </span>
                  <span>{secondsToTime(items?.delivering_time_avg).m} м </span>
                  <span>
                    {secondsToTime(items?.delivering_time_avg).s} сек{" "}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ width: "50%" }}>
                  Среднее время приготовление (филиал)
                </TableCell>
                <TableCell style={{ width: "50%" }}>
                  <span>
                    {secondsToTime(items?.operator_accepting_avg).h} ч{" "}
                  </span>
                  <span>
                    {secondsToTime(items?.operator_accepting_avg).m} м{" "}
                  </span>
                  <span>
                    {secondsToTime(items?.operator_accepting_avg).s} сек{" "}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ width: "50%" }}>
                  Среднее время приёма (курьер)
                </TableCell>
                <TableCell style={{ width: "50%" }}>
                  <span>{secondsToTime(items?.total_time_avg).h} ч </span>
                  <span>{secondsToTime(items?.total_time_avg).m} м </span>
                  <span>{secondsToTime(items?.total_time_avg).s} сек </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ width: "50%" }}>
                  Среднее время доставки заказа (курьер)
                </TableCell>
                <TableCell style={{ width: "50%" }}>
                  <span>{secondsToTime(items?.vendor_preparing_avg).h} ч </span>
                  <span>{secondsToTime(items?.vendor_preparing_avg).m} м </span>
                  <span>
                    {secondsToTime(items?.vendor_preparing_avg).s} сек{" "}
                  </span>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        )}
      </TableContainer>

      <LoaderComponent isLoader={loader} />
    </Card>
  );
}
export default AllReport;
