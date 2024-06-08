import React from "react";
import { useTranslation } from "react-i18next";
import TopTable from "./TopTable";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const DailyReportTable = ({ tableData, page, limit }) => {
  const { t } = useTranslation();

  const columns = React.useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (record, index) => <div>{(page - 1) * 10 + index + 1}</div>,
      },
      {
        title: t("branches"),
        key: "branches",
        render: (record) => <>{record.branch_name}</>,
      },
      {
        title: t("delivery"),
        key: "delivery",
        columns: [
          {
            title: t("admin_panel"),
            key: "admin_panel",
            render: (record) => (
              <>{record?.delivered_orders?.admin_orders_count}</>
            ),
          },
          {
            title: t("bot"),
            key: "bot",
            render: (record) => (
              <>{record?.delivered_orders?.bot_orders_count}</>
            ),
          },
          {
            title: t("app"),
            key: "app",
            render: (record) => (
              <>{record?.delivered_orders?.app_orders_count}</>
            ),
          },
          {
            title: t("website"),
            key: "website",
            render: (record) => (
              <>{record?.delivered_orders?.web_orders_count}</>
            ),
          },
          {
            title: t("all_amount"),
            key: "all_amount",
            render: (record) => (
              <>{record?.delivered_orders?.all_orders_count}</>
            ),
          },
          {
            title: t("order.sum"),
            key: "order_sum",
            render: (record) => (
              <>{record?.delivered_orders?.all_orders_amount}</>
            ),
          },
          {
            title: t("delivery_amount"),
            key: "delivery_amount",
            render: (record) => (
              <>{record?.delivered_orders?.all_orders_delivery_price}</>
            ),
          },
          {
            title: t("total.sum"),
            key: "total_amount",
            render: (record) => (
              <>
                {
                  record?.delivered_orders
                    ?.all_orders_amount_with_delivery_price
                }
              </>
            ),
          },
          {
            title: t("average.check"),
            key: "average_check",
            render: (record) => (
              <>{record?.delivered_orders?.all_orders_average_amount}</>
            ),
          },
        ],
      },
      {
        title: t("self_pickup"),
        key: "self_pickup_orders",
        columns: [
          {
            title: t("admin_panel"),
            key: "admin_panel",
            render: (record) => (
              <>{record?.self_pickup_orders?.admin_orders_count}</>
            ),
          },
          {
            title: t("bot"),
            key: "bot",
            render: (record) => (
              <>{record?.self_pickup_orders?.bot_orders_count}</>
            ),
          },
          {
            title: t("app"),
            key: "app",
            render: (record) => (
              <>{record?.self_pickup_orders?.app_orders_count}</>
            ),
          },
          {
            title: t("website"),
            key: "website",
            render: (record) => (
              <>{record?.self_pickup_orders?.web_orders_count}</>
            ),
          },
          {
            title: t("all_amount"),
            key: "all_amount",
            render: (record) => (
              <>{record?.self_pickup_orders?.all_orders_count}</>
            ),
          },
          {
            title: t("order.sum"),
            key: "order_sum",
            render: (record) => (
              <>{record?.self_pickup_orders?.all_orders_amount}</>
            ),
          },
          {
            title: t("average.check"),
            key: "average_check",
            render: (record) => (
              <>{record?.self_pickup_orders?.all_orders_average_amount}</>
            ),
          },
        ],
      },
      {
        title: t("aggregator"),
        key: "aggregated_orders",
        columns: [
          {
            title: t("all_amount"),
            key: "all_amount",
            render: (record) => (
              <>{record?.aggregated_orders?.all_orders_count}</>
            ),
          },
          {
            title: t("order.sum"),
            key: "order_sum",
            render: (record) => (
              <>{record?.aggregated_orders?.all_orders_amount}</>
            ),
          },
          {
            title: t("average.check"),
            key: "average_check",
            render: (record) => (
              <>{record?.aggregated_orders?.all_orders_average_amount}</>
            ),
          },
        ],
      },
      {
        title: t("total"),
        key: "total",
        columns: [
          {
            title: t("amount"),
            key: "amount",
            render: (record) => <>{record?.branch_all_orders_count}</>,
          },
          {
            title: t("sum"),
            key: "sum",
            render: (record) => <>{record?.branch_all_orders_amount}</>,
          },
        ],
      },
    ],
    [t, page],
  );

  const {
    all_aggregator: aggregator,
    all_delivery: delivery,
    all_self_pickup: pickup,
    all_reports: reports,
  } = tableData;

  return (
    <>
      <TopTable tableData={tableData} />

      <TableContainer className="rounded-lg border border-lightgray-1 text-center">
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
                (item) =>
                  item?.columns &&
                  item?.columns.map((element) => (
                    <TableCell
                      key={item?.key + element?.key}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {element?.title}
                    </TableCell>
                  )),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData?.branches_report?.map((item, index) => (
              <TableRow
                key={item.id}
                className={index % 2 === 0 ? "bg-lightgray-5" : ""}
              >
                {columns?.map((col) =>
                  col?.columns ? (
                    col?.columns?.map((element) => (
                      <TableCell
                        key={col?.key + element?.key}
                        style={{ textAlign: "center" }}
                      >
                        {element?.render
                          ? element?.render(item, index)
                          : item?.[col?.key]?.[element?.key]
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                      </TableCell>
                    ))
                  ) : (
                    <TableCell key={col?.key} style={{ textAlign: "center" }}>
                      {col?.render
                        ? col?.render(item, index)
                        : item?.[col?.key]}
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))}
            <TableRow>
              <TableCell textAlign="center"></TableCell>
              <TableCell style={{ textAlign: "center" }}>Итого</TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {delivery?.admin_orders_count}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {delivery?.bot_orders_count}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {delivery?.app_orders_count}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {delivery?.web_orders_count}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {delivery?.all_orders_count}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {delivery?.all_orders_amount}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {delivery?.all_orders_delivery_price}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {delivery?.all_orders_amount_with_delivery_price}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {delivery?.all_orders_average_amount}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {pickup?.admin_orders_count}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {pickup?.bot_orders_count}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {pickup?.app_orders_count}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {pickup?.web_orders_count}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {pickup?.all_orders_count}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {pickup?.all_orders_amount}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {pickup?.all_orders_average_amount}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {aggregator?.all_orders_count}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {aggregator?.all_orders_amount}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {aggregator?.all_orders_average_amount}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {reports?.orders_count}
              </TableCell>
              <TableCell style={{ textAlign: "center" }} colSpan={2}>
                {reports?.orders_price_with_delivery_price}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DailyReportTable;
