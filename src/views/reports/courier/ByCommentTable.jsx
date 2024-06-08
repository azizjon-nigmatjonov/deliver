import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getCourierReviewReports } from "services/reports";
import { useHistory } from "react-router-dom";
import SwitchColumns from "components/Filters/SwitchColumns";

export default function ByCommentTable({ filters, tabValue }) {
  const history = useHistory();

  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, filters, limit]);

  const getItems = (page) => {
    setLoader(true);
    getCourierReviewReports({
      limit,
      page,
      start_date: filters.from_date,
      end_date: filters.to_date,
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.courier_review_reports,
        });
      })
      .finally(() => setLoader(false));
  };

  const initialCommentColumns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("first.name"),
      key: "name",
      dataIndex: "name",
      render: (record) => (
        <>
          {record?.first_name} {record?.last_name}
        </>
      ),
    },
    {
      title: t("orders.amount"),
      key: "delivery_count",
      dataIndex: "delivery_count",
      render: (record) => <>{record?.delivery_amount}</>,
    },
    {
      title: t("reviews.amount"),
      key: "reviews-amount",
      dataIndex: "reviews_amount",
      render: (record) => <>{record?.likes_amount + record?.dislikes_amount}</>,
    },
    {
      title: t("likes.amount"),
      key: "likes-amount",
      dataIndex: "likes_amount",
      render: (record) => <>{record?.likes_amount}</>,
    },
    {
      title: t("dislikes.amount"),
      key: "dislikes-amount",
      dataIndex: "dislikes_amount",
      render: (record) => <>{record?.dislikes_amount}</>,
    },
    {
      title: t("likes.of.courier"),
      key: "likes.of.courier",
      dataIndex: "likes.of.courier",
      render: (record) =>
        `
          ${record?.likes_amount}/${record?.like_percent}%
        `,
    },
    {
      title: t("dislikes.of.courier"),
      key: "dislikes.of.courier",
      dataIndex: "dislikes.of.courier",
      render: (record) => (
        <>
          {record?.dislikes_amount}/{record?.dislike_percent}%
        </>
      ),
    },
  ];

  useEffect(() => {
    let _columns = [
      ...initialCommentColumns,
      {
        title: (
          <SwitchColumns
            columns={initialCommentColumns}
            onChange={(val) =>
              setColumns((prev) => [...val, prev[prev.length - 1]])
            }
            iconClasses="flex justify-end mr-1"
          />
        ),
      },
    ];
    setColumns(_columns);
  }, [history, tabValue, t]);

  return (
    <Card
      // className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          limit={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
        />
      }
    >
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key} className="whitespace-nowrap">
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
