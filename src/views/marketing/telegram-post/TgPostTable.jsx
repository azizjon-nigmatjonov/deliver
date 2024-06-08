import { useCallback, useState } from "react";
import Card from "components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { getTelegramContent } from "services/telegram";
import LoaderComponent from "components/Loader";
import Pagination from "components/Pagination";
import moment from "moment";

const TgPostTable = ({ search, state, contentType }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [content, setContent] = useState({});
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();

  const getPosts = useCallback(() => {
    setLoader(true);
    getTelegramContent({
      limit,
      search,
      page: currentPage,
      from_date: state.from_date,
      to_date: state.to_date,
      content_type: contentType?.value,
    })
      .then((res) => {
        setContent({
          count: res?.count,
          posts: res?.telegram_posts,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoader(false));
  }, [currentPage, limit, contentType, state, search]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const columns = [
    {
      title: "№",
      key: "number",
      render: (_, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: t("text"),
      key: "text",
      render: (record) => (
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
          {record.message}
        </div>
      ),
    },
    {
      title: t("content"),
      key: "content",
      render: (record) => (
        <img src={`${record.file_url}`} alt="content" height="50" width="50" />
      ),
    },
    {
      title: t("content.type"),
      key: "type",
      render: (record) => t(record.content_type),
    },
    {
      title: t("number.of.receivers"),
      key: "success_amount",
      render: (record) => record.success_amount,
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
          {moment(record.scheduled_at).format("DD.MM.YYYY HH:mm:ss")}
        </div>
      ),
    },
    {
      title: t("date.branch"),
      key: "created_at",
      render: (record) => (
        <div style={{ width: 130 }}>
          {moment(record.created_at).format("DD.MM.YYYY HH:mm:ss")}
        </div>
      ),
    },
  ];

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={content?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
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
              {columns?.map(
                (item) =>
                  item?.columns &&
                  item?.columns.map((element, ind) => (
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
            {!loader &&
              content?.posts?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) =>
                    col.columns ? (
                      col?.columns?.map((element) => (
                        <TableCell key={element?.key}>
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
      <LoaderComponent isLoader={loader} />
    </Card>
  );
};

export default TgPostTable;
