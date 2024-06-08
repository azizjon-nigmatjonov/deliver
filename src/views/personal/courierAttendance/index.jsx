import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Pagination from "../../../components/Pagination";
import LoaderComponent from "../../../components/Loader";
import Card from "../../../components/Card";
import { useCourierAttendance } from "services/v2/courier-attendance";
import Filters from "components/Filters";
import moment from "moment";
import RangePicker from "components/DatePicker/RangePicker";
import Header from "components/Header";
import { useCouriers } from "services";
import Select from "components/Select";
import TimePicker from "components/TimePicker";

const CourierAttendance = () => {
  const { t } = useTranslation();

  const [loader, setLoader] = useState(true);
  const [request, setRequest] = useState({
    page: 1,
    limit: 10,
    start_date: moment().format("YYYY-MM-DD"),
    end_date: moment().add(1, "days").format("YYYY-MM-DD"),
    start_time: moment("00:00:00", "H:mm:ss"),
    end_time: moment("23:59:59", "H:mm:ss"),
    courier_id: "",
  });

  const { data: attendances, refetch } = useCourierAttendance({
    params: {
      page: request.page,
      limit: request.limit,
      from_date: `${request.start_date} ${moment(request.start_time).format(
        "H:mm:ss",
      )}`,
      to_date: `${request.end_date} ${moment(request.end_time).format(
        "H:mm:ss",
      )}`,
      courier_id: request.courier_id?.value,
    },
    props: {
      enabled: true,
      onSuccess: () => setLoader(false),
    },
  });

  const { data: couriers } = useCouriers({
    params: {
      limit: 100,
      page: 1,
    },
    props: {
      enabled: true,
      select: (data) => {
        const arr = data?.couriers.map((courier) => ({
          value: courier?.id,
          label: `${courier?.first_name} ${courier?.last_name}`,
        }));
        return [{ value: "", label: "Все" }, ...arr];
      },
    },
  });
  useEffect(() => refetch(), [request]);

  const timeDifference = (originalDateTime, targetTime) => {
    // Create new Date objects with the originalDateTime and targetTime
    if (originalDateTime !== "Invalid date" && targetTime !== "Invalid date") {
      const originalDateTimeObj = new Date(`0001-01-01 ${originalDateTime}`);
      const updatedDateTimeObj = new Date(originalDateTimeObj);
      updatedDateTimeObj.setHours(
        +targetTime.split(":")[0],
        +targetTime.split(":")[1],
      );

      // Calculate the time difference in milliseconds
      const timeDifference = updatedDateTimeObj - originalDateTimeObj;
      // console.log(new Date(`0001-01-01 ${originalDateTime}`));
      // Convert the time difference to hh:mm format
      const hours = Math.floor(Math.abs(timeDifference) / 3600000);
      const minutes = Math.floor((Math.abs(timeDifference) % 3600000) / 60000);
      const timeDifferenceFormatted = `${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      return (
        <div
          className={timeDifference <= 0 ? "text-green-600" : "text-red-600"}
        >
          {timeDifferenceFormatted}:00
        </div>
      );
    }
  };

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (
        <div>{(request.page - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("first.name"),
      key: "name",
      render: (record) => <div>{record.first_name}</div>,
    },
    {
      title: t("last.name"),
      key: "last_name",
      render: (record) => <div>{record.last_name}</div>,
    },
    {
      title: t("phone.number"),
      key: "phone_number",
      render: (record) => <div>{record.phone}</div>,
    },
    {
      title: t("start.work"),
      key: "start",
      columns: [
        {
          title: t("time"),
          key: "time",
          render: (record) => <div>{record.arrival_time}</div>,
        },
        {
          title: t("diff.with.graphics"),
          key: "difference",
          render: (record) => (
            <div>
              {timeDifference(
                record.start_time,
                moment(record.arrival_time).format("HH:mm"),
              )}
            </div>
          ),
        },
      ],
    },
    {
      title: t("end.work"),
      key: "end",
      columns: [
        {
          title: t("time"),
          key: "time",
          render: (record) => <div>{record.departure_time}</div>,
        },
        {
          title: t("diff.with.graphics"),
          key: "difference",
          render: (record) => (
            <div>
              {timeDifference(
                moment(record.departure_time).format("HH:mm"),
                record.end_time,
              )}
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <>
      <Header title={t("courier.attendance")} />
      <Filters>
        <div className="flex items-center gap-2">
          <Select
            width={200}
            value={request.courier_id}
            options={couriers}
            placeholder={t("choose.a.courier")}
            onChange={(courier_id) => {
              setRequest((prev) => ({
                ...prev,
                courier_id,
              }));
            }}
          />
          <RangePicker
            hideTimePicker
            placeholder={t("choose.period")}
            defaultValue={[moment(request.from_date), moment(request.to_date)]}
            onChange={(e) => {
              e[0] === null
                ? setRequest((prev) => ({
                    ...prev,
                    start_date: moment()
                      .subtract(5, "d")
                      .format("YYYY-MM-DD h:mm:ss"),
                    end_date: moment().format("YYYY-MM-DD"),
                  }))
                : setRequest((prev) => ({
                    ...prev,
                    start_date: moment(e[0]).format("YYYY-MM-DD"),
                    end_date: moment(e[1]).format("YYYY-MM-DD"),
                  }));
            }}
          />
          <TimePicker
            showSecond={true}
            showHour={true}
            style={{ width: 150 }}
            value={request.start_time}
            placeholder={"00:00:00"}
            onChange={(e) => {
              setRequest((prev) => ({
                ...prev,
                start_time: e,
              }));
            }}
          />
          <TimePicker
            showSecond={true}
            showHour={true}
            style={{ width: 150 }}
            value={request.end_time}
            placeholder={"23:59:59"}
            onChange={(e) => {
              setRequest((prev) => ({
                ...prev,
                end_time: e,
              }));
            }}
          />
        </div>
      </Filters>
      <Card
        className="m-4"
        footer={
          <Pagination
            title={t("general.count")}
            count={attendances?.courier_attendance_times?.length}
            onChange={(pageNumber) =>
              setRequest((prev) => ({
                ...prev,
                page: pageNumber,
              }))
            }
            limit={request.limit}
            onChangeLimit={(limitNumber) =>
              setRequest((prev) => ({
                ...prev,
                limit: limitNumber,
              }))
            }
          />
        }
      >
        <TableContainer className="rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns?.map((elm, ind) => (
                  <TableCell
                    colSpan={elm?.columns ? elm?.columns.length : 1}
                    rowSpan={elm?.columns ? 1 : 2}
                    key={elm?.key}
                    style={{ textAlign: "center" }}
                  >
                    {elm?.title}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {columns?.map(
                  (item, index) =>
                    item?.columns &&
                    item?.columns.map((element, ind) => (
                      <TableCell
                        key={item?.key + element?.key}
                        style={
                          ind === item?.columns.length - 1
                            ? { borderRight: "1px solid #e5e9eb" }
                            : {}
                        }
                      >
                        <div className="text-center">{element?.title}</div>
                      </TableCell>
                    )),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loader &&
                attendances?.courier_attendance_times.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns?.map((col) =>
                      col?.columns ? (
                        col?.columns?.map((element) => (
                          <TableCell key={col?.key + element?.key}>
                            <div key={element?.key}>
                              {element?.render
                                ? element?.render(item, index)
                                : item?.[col?.key]?.[element?.key]
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                            </div>
                          </TableCell>
                        ))
                      ) : (
                        <TableCell key={col?.key}>
                          {col?.render
                            ? col?.render(item, index)
                            : item?.[col?.key]}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <LoaderComponent isLoader={loader} />
      </Card>
    </>
  );
};

export default CourierAttendance;
