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
import { getOrders } from "services";
import { useParams } from "react-router-dom";
import Header from "components/Header";
import parseQuery from "helpers/parseQuery";
import {
  deliveryIcon,
  getSourceIcon,
  paymentTypeIconMake,
} from "views/orders/form/api";
import numberToPrice from "helpers/numberToPrice";

export default function AllInformation() {
  const [loader, setLoader] = useState(true);
  const { id } = useParams();
  const { start_date } = parseQuery();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, limit]);

  const getItems = (page) => {
    setLoader(true);

    getOrders({
      courier_id: id,
      status_ids: "e665273d-5415-4243-a329-aee410e39465",
      limit,
      page,
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.orders,
        });
      })
      .finally(() => setLoader(false));
  };

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("order.id"),
      key: "order-id",
      render: (record) => <>{record?.external_order_id}</>,
    },
    {
      title: t("timer"),
      key: "timer",
      render: (record) => <>{record?.delivery_amount}</>,
    },
    {
      title: t("client"),
      key: "client",
      render: (record) => (
        <div className="flex flex-col">
          <span>{record?.client_name}</span>{" "}
          <span>{record.client_phone_number}</span>
        </div>
      ),
    },
    {
      title: t("courier"),
      key: "courier",
      render: (record) => (
        <div className="flex flex-col">
          <span>
            {record?.courier.first_name} {record.courier.last_name}
          </span>
          <span>{record?.courier.phone}</span>
        </div>
      ),
    },
    {
      title: t("branch"),
      key: "branch",
      render: (record) => (
        <div className="flex flex-col">
          <span>{record?.steps[0].branch_name}</span>{" "}
          <span>{record.steps[0].phone_number}</span>
        </div>
      ),
    },
    {
      title: t("delivery.type"),
      key: "delivery-type",
      render: (record) => (
        <div className="flex justify-center">
          {deliveryIcon(record?.delivery_type)}
        </div>
      ),
    },
    {
      title: t("order.price"),
      key: "order-price",
      render: (record) => (
        <>
          <div className="flex justify-center align-middle flex-col">
            <div className="flex justify-center">
              <div
                style={
                  record.payment_type !== "cash" && record?.paid
                    ? {
                        width: 80,
                        height: 80,
                        backgroundColor: "#BBFBD0",
                        border: "1px solid #EEEEEE",
                        borderRadius: "50%",
                      }
                    : {
                        width: 72,
                        height: 72,
                        border: "1px solid #EEEEEE",
                        borderRadius: "50%",
                      }
                }
                className="flex justify-center"
              >
                <img
                  className="object-none"
                  src={paymentTypeIconMake(record.payment_type)}
                  alt={record.payment_type}
                />
              </div>
            </div>
            <div className="text-center">
              {record.order_amount
                ? numberToPrice(record.order_amount, "сум")
                : "----"}
            </div>
          </div>
        </>
      ),
    },
    {
      title: t("client.address"),
      key: "client-address",
      render: (record) => <>{record?.to_address}</>,
    },
    {
      title: t("source"),
      key: "source",
      render: (record) => (
        <div className="flex justify-center align-middle flex-col">
          <img
            className="object-none"
            src={getSourceIcon(record.source)}
            alt={record.payment_type}
          />
        </div>
      ),
    },
    {
      title: t("date.branch"),
      key: "date-branch",
      render: (record) => <>{record?.created_at}</>,
    },
  ];

  return (
    <>
      <Header title={`${t("reports.by.courier")} / ${t("all.information")}`} />
      <Card
        className="m-4"
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
        <LoaderComponent isLoader={loader} height={82} />
      </Card>
    </>
  );
}
