import { useReducer, useState } from "react";
import Header from "components/Header";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Button from "components/Button/Buttonv2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNotificationHistory } from "services/v2/notification";
import LoaderComponent from "components/Loader";
import Pagination from "components/Pagination";
import { useHistory } from "react-router-dom";
import moment from "moment";
import Filters from "components/Filters";
import RangePicker from "components/DatePicker/RangePicker";
import { AddRounded } from "@mui/icons-material";

const initialStates = {
  from_date: "2020-01-01",
  to_date: moment().add(1, "d").format("YYYY-MM-DD"),
};

const reducer = (state, action) => {
  switch (action.type) {
    case "DATE_TIME":
      return {
        ...state,
        from_date: moment(action.payload[0]).format("YYYY-MM-DD"),
        to_date: moment(action.payload[1]).format("YYYY-MM-DD"),
      };
    case "CLEAR":
      return initialStates;
    default:
      return state;
  }
};

const PostNotification = () => {
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { t } = useTranslation();
  const history = useHistory();

  const [state, dispatch] = useReducer(reducer, initialStates);

  const columns = [
    {
      title: "№",
      key: "number",
      render: (record, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: t("name"),
      key: "title",
      render: (record, index) => (
        <div
          style={{
            maxWidth: "300px",
            maxHeight: "80px",
            width: "100%",
            overflow: "auto",
            whiteSpace: "pre-line",
            wordWrap: "break-word",
          }}
        >
          {record.title}
        </div>
      ),
    },
    {
      title: t("Текст рассылки"),
      key: "content",
      render: (record, index) => (
        <div
          style={{
            maxWidth: "300px",
            maxHeight: "80px",
            width: "100%",
            overflow: "hidden",
            whiteSpace: "pre-line",
            wordWrap: "break-word",
          }}
        >
          {record.content}
        </div>
      ),
    },
    {
      title: t("number.of.receivers"),
      key: "sent_count",
      render: (record, index) => record.sent_count,
    },
    {
      title: t("filter"),
      key: "filter",
      columns: [
        {
          key: "r",
          title: "R",
          render: (record) => record.filter?.r,
        },
        {
          key: "f",
          title: "F",
          render: (record) => record.filter?.f,
        },
        {
          key: "m",
          title: "M",
          render: (record) => record.filter?.m,
        },
        {
          key: "from_monetary",
          title: "Средний чек",
          render: (record) =>
            record.filter?.from_monetary + "-" + record.filter?.to_monetary,
        },
        {
          key: "from_frequency",
          title: "Кол-во заказов",
          render: (record) =>
            record.filter?.from_frequency + "-" + record.filter?.to_frequency,
        },
        {
          key: "from_recency",
          title: "Дни с последнего заказа",
          render: (record) =>
            record.filter?.from_recency + "-" + record.filter?.to_recency,
        },
      ],
    },
    {
      title: t("date.scheduled"),
      key: "scheduled_at",
      render: (record) => (
        <div style={{ width: 130 }}>
          {moment(record.scheduled_at).format("DD.MM.YYYY  HH:mm:ss")}
        </div>
      ),
    },
    {
      title: t("date.branch"),
      key: "created_at",
      render: (record) => (
        <div style={{ width: "120px" }}>
          {moment(record.time).format("DD.MM.YYYY HH:mm:ss")}
        </div>
      ),
    },
  ];

  const { data, isLoading } = useNotificationHistory({
    params: {
      page: currentPage,
      limit,
      from_date: state.from_date,
      to_date: state.to_date,
    },
    props: { enabled: true },
  });

  return (
    <>
      <Header
        title={t("notification_to_apps")}
        endAdornment={
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() =>
              history.push("/home/marketing/notification-to-apps/create")
            }
          >
            {t("add")}
          </Button>
        }
      />
      <Filters>
        <RangePicker
          hideTimePicker
          disablefuture="true"
          placeholder={t("from.date.to.date")}
          onChange={(e) =>
            e[0]
              ? dispatch({ type: "DATE_TIME", payload: e })
              : dispatch({ type: "CLEAR" })
          }
        />
      </Filters>
      <Card
        className="m-4"
        // title={`${t("general.count")}: ${data?.count ? data?.count : 0}`}
        footer={
          <Pagination
            title={t("general.count")}
            count={data?.count}
            onChange={(val) => setCurrentPage(val)}
            pageCount={limit}
            onChangeLimit={(limitNumber) => setLimit(limitNumber)}
            limit={limit}
          />
        }
      >
        <TableContainer className="rounded-lg border border-lightgray-1">
          <Table aria-label="simple-table">
            <TableHead>
              <TableRow>
                {columns.map((elm) => (
                  <TableCell
                    colSpan={elm.columns ? elm.columns.length : 1}
                    rowSpan={elm.columns ? 1 : 2}
                    key={elm?.key}
                    style={{ textAlign: "center" }}
                  >
                    {elm.title}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {columns?.map((item) =>
                  item?.columns?.map((element, ind) => (
                    <TableCell
                      key={element?.key}
                      style={{
                        borderRight:
                          ind === item?.columns.length - 1
                            ? "1px solid #e5e9eb"
                            : "none",
                      }}
                    >
                      {element?.title}
                    </TableCell>
                  )),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading &&
                data?.notifications?.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) =>
                      col?.columns ? (
                        col?.columns?.map((element) => (
                          <TableCell key={element.key}>
                            {element?.render
                              ? element.render(item, index)
                              : "---"}
                          </TableCell>
                        ))
                      ) : (
                        <TableCell key={col.key}>
                          {col?.render ? col.render(item, index) : "---"}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <LoaderComponent isLoader={isLoading} />
      </Card>
    </>
  );
};

export default PostNotification;
