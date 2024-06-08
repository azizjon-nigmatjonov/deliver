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
import { getBranchesReport } from "services/reports";
import numberToPrice from "helpers/numberToPrice";
import { useHistory } from "react-router-dom";
import SwitchColumns from "components/Filters/SwitchColumns";
import moment from "moment";

function BranchOrderReport({ filters, tabValue }) {
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (tabValue === 0) {
      getItems();
    }
  }, [filters]);

  const getItems = () => {
    setLoader(true);
    getBranchesReport({
      ...filters,
      from_time:
        filters.from_time !== null
          ? moment(filters.from_time).format("HH:mm:ss")
          : "",
      to_time:
        filters.to_time !== null
          ? moment(filters.to_time).format("HH:mm:ss")
          : "",
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.reports,
        });
      })
      .finally(() => setLoader(false));
  };

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{index + 1}</>,
    },
    {
      title: t("name"),
      key: "name",
      dataIndex: "name",
      render: (record) => <>{record?.branch_name || "Итого"}</>,
    },
    {
      title: t("admin"),
      key: "admin",
      dataIndex: "admin",
      render: (record) => <>{record?.admin_panel_orders_count}</>,
    },
    {
      title: t("admin_average_bill"),
      key: "admin_average_bill",
      dataIndex: "admin_average_bill",
      render: (record) => (
        <>{numberToPrice(Math.round(record?.admin_average_sum), "")}</>
      ),
    },
    {
      title: t("bot"),
      key: "bot",
      dataIndex: "bot",
      render: (record) => <>{record?.bot_orders_count}</>,
    },
    {
      title: t("bot_average_check"),
      key: "bot_average_check",
      dataIndex: "bot_average_check",
      render: (record) => <>{Math.round(record.bot_average_sum)}</>,
    },
    {
      title: t("app"),
      key: "app",
      dataIndex: "app",
      render: (record) => <>{record?.app_orders_count}</>,
    },
    {
      title: t("app_average_check"),
      key: "app_average_check",
      dataIndex: "app_average_check",
      render: (record) => (
        <>{numberToPrice(Math.round(record?.app_average_sum), "")}</>
      ),
    },
    {
      title: t("orders_site"),
      key: "orders_site",
      dataIndex: "orders_site",
      render: (record) => <>{record?.website_orders_count}</>,
    },
    {
      title: t("common_order"),
      key: "common_order",
      dataIndex: "common_order",
      render: (record) => <>{record?.total_orders_count}</>,
    },
    {
      title: t("total.sum"),
      key: "total.sum",
      dataIndex: "total.sum",
      render: (record) => <>{numberToPrice(record?.total_sum, "")}</>,
    },
    {
      title: t("fair"),
      key: "fair",
      dataIndex: "fair",
      render: (record) => <>{numberToPrice(record?.total_delivery_sum, "")}</>,
    },
    {
      title: t("total_amount_pickup"),
      key: "total_amount_pickup",
      dataIndex: "total_amount_pickup",
      render: (record) => (
        <>{numberToPrice(record?.total_self_pick_up_sum, "")}</>
      ),
    },
    {
      title: t("free_delivery"),
      key: "free_delivery",
      dataIndex: "free_delivery",
      render: (record) => <>{record?.free_delivery}</>,
    },
    {
      title: t("total_cash"),
      key: "total_cash",
      dataIndex: "total_cash",
      render: (record) => <>{numberToPrice(record?.cash_sum, "")}</>,
    },
    {
      title: t("total_shipping_cash"),
      key: "total_shipping_cash",
      dataIndex: "total_shipping_cash",
      render: (record) => <>{numberToPrice(record?.total_delivery_sum, "")}</>,
    },
    {
      title: t("total_sum_payme"),
      key: "total_sum_payme",
      dataIndex: "total_sum_payme",
      render: (record) => <>{numberToPrice(record?.payme_sum, "")}</>,
    },
    {
      title: t("total_shipping_payme"),
      key: "total_shipping_payme",
      dataIndex: "total_shipping_cash",
      render: (record) => <>{numberToPrice(record?.payme_delivery_sum, "")}</>,
    },
    {
      title: t("total_transfer_amount"),
      key: "total_transfer_amount",
      dataIndex: "total_transfer_amount",
      render: (record) => <>{record?.transfer_sum}</>,
    },
    {
      title: t("total_transfer_amount_deliver"),
      key: "total_transfer_amount_deliver",
      dataIndex: "total_transfer_amount_deliver",
      render: (record) => <>{record?.transfer_delivery_sum}</>,
    },
    {
      title: t("click"),
      key: "click",
      dataIndex: "click",
      render: (record) => <>{record?.click_sum}</>,
    },
    {
      title: t("total_amount_deliver_click"),
      key: "total_amount_deliver_click",
      dataIndex: "total_amount_deliver_click",
      render: (record) => <>{record?.click_delivery_sum}</>,
    },
    {
      title: t("cashbacks_given"),
      key: "cashbacks_given",
      dataIndex: "cashbacks_given",
      render: (record) => <>{record?.given_cash_back}</>,
    },
    {
      title: t("middle.check"),
      key: "middle.check",
      dataIndex: "cashbacks_given",
      render: (record) => (
        <>{numberToPrice(Math.round(record?.average_sum), "")}</>
      ),
    },
  ];
  useEffect(() => {
    const _columns = [
      ...initialColumns,
      {
        title: (
          <SwitchColumns
            columns={initialColumns}
            onChange={(val) => {
              setColumns((prev) => [...val, prev[prev.length - 1]]);
            }}
            sortable={false}
            iconClasses="flex justify-end mr-1"
          />
        ),
      },
    ];
    setColumns(_columns);
  }, []);
  return (
    <Card>
      <TableContainer className="rounded-lg border border-lightgray-1">
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
                    onClick={() => history.push(`courier/${item.courier.id}`)}
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
export default BranchOrderReport;
