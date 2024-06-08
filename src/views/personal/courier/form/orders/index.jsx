import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import SwitchColumns from "components/Filters/SwitchColumns";
import ActionMenu from "components/ActionMenu";
import Card from "components/Card";
import Filters from "components/Filters";
import Tag from "components/Tag";
import { statusTag } from "../../../../orders/statuses";
import TextFilter from "components/Filters/TextFilter";
import { getOrders } from "services";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import { currentStatuses, historyStatuses } from "constants/statuses";
import orderTimer from "helpers/orderTimer";

export default function OrderCourier({ courier_id }) {
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);
  const [selectedTab, setSelectedTab] = useState("current");

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, selectedTab]);

  const checkColumn = (tab) => {
    switch (tab) {
      case "current":
        return [
          {
            title: (
              <SwitchColumns
                columns={initialColumns}
                onChange={(val) =>
                  setColumns((prev) => [...val, prev[prev.length - 1]])
                }
              />
            ),
            key: t("actions"),
            render: (record) => (
              <ActionMenu
                id={record.id}
                actions={[
                  {
                    icon: <EditIcon />,
                    color: "primary",
                    title: t("change"),
                    action: () => {
                      // history.push(`/home/courier/${record.id}`)
                      console.log("clicked");
                    },
                  },
                  {
                    icon: <DeleteIcon />,
                    color: "error",
                    title: t("delete"),
                    action: () => {
                      console.log("clicked");
                      // setDeleteModal({ id: record.id })
                    },
                  },
                ]}
              />
            ),
          },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    const _columns = [...initialColumns, ...checkColumn(selectedTab)];
    setColumns(_columns);
  }, [selectedTab]);

  const statusName = () => {
    switch (selectedTab) {
      case "current":
        return currentStatuses?.ids;
      case "history":
        return historyStatuses?.ids;
      default:
        break;
    }
  };

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => <div>{currentPage - 1 + index + 1}</div>,
    },
    {
      title: t("client.name"),
      key: "name",
      render: (record) => (
        <div className="cursor-pointer">
          {record.client_name}
          <div className="text-info cursor-pointer">
            {record.client_phone_number}
          </div>
        </div>
      ),
    },
    {
      title: t("order_id"),
      key: "order_id",
      sorter: true,
      render: (record) => <div>{record.external_order_id}</div>,
    },
    {
      title: t("timer"),
      key: "timer",
      sorter: true,
      render: (record) => (
        <div className="w-36">
          <Tag color="primary" size="large" shape="subtle">
            <span className="text-green-600">
              {/* {calcTimer(record.created_at)} */}
              {orderTimer(
                record.created_at,
                record?.finished_at?.length
                  ? record.finished_at
                  : record?.status_notes?.find(
                      (status_note) =>
                        status_note?.status_id ===
                        "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1",
                    )?.created_at,
                record.future_time,
                record.status_id,
              )}
            </span>
          </Tag>
          <div className="text-center text-xs mt-2">
            {statusTag(record.status_id, t)}
          </div>
        </div>
      ),
    },
    {
      title: t("courier"),
      key: "courier",
      filterOptions: [
        { label: t("delivery"), value: "delivery" },
        { label: t("self_pickup"), value: "self-pickup" },
      ],
      onFilter: (val) => {
        console.log(val);
      },
      render: (record) => (
        <div>
          {record.courier.first_name
            ? `${record.courier.first_name} ${record.courier.last_name}`
            : "----"}
        </div>
      ),
    },
    {
      title: t("restaurant"),
      key: "restaurant",
      filterOptions: [
        { label: t("delivery"), value: "delivery" },
        { label: t("self_pickup"), value: "self-pickup" },
      ],
      onFilter: (val) => {
        console.log(val);
      },
      render: (record) => <div>{record.name ? record.name : "----"}</div>,
    },
    {
      title: t("branch"),
      key: "branch",
      render: (record) => (
        <div>
          {record.steps[0].branch_name}
          <div className="text-info cursor-pointer">
            {record.steps[0].phone_number}
          </div>
        </div>
      ),
    },
    {
      title: t("delivery.type"),
      key: "delivery.type",
      filterOptions: [
        { label: t("delivery"), value: "delivery" },
        { label: t("self_pickup"), value: "self-pickup" },
      ],
      onFilter: (val) => {
        console.log(val);
      },
      render: (record) => (
        <Tag color="warning" size="large" shape="subtle">
          {record.delivery_type}
        </Tag>
      ),
    },
    {
      title: t("price"),
      key: "price",
      sorter: true,
      render: (record) => (
        <div className="font-medium">
          {record.order_amount
            ? new Intl.NumberFormat().format(record.order_amount)
            : "----"}
        </div>
      ),
    },
    {
      title: t("client.address"),
      key: "client.address",
      render: (record) => (
        <div className="truncate w-44">
          <Tooltip title={record.to_address} placement="top">
            <span>{record.to_address}</span>
          </Tooltip>
        </div>
      ),
    },
  ];

  const getItems = (page) => {
    setLoader(true);
    getOrders({ limit: 10, page, status_ids: statusName(), courier_id })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.orders,
        });
      })
      .finally(() => setLoader(false));
  };

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => {
        setCurrentPage(pageNumber);
      }}
    />
  );

  return (
    <div>
      <Card className="m-4" footer={pagination}>
        <Filters style={{ backgroundColor: "transparent", borderTop: "none" }}>
          <StyledTabs
            value={selectedTab}
            onChange={(_, value) => {
              setSelectedTab(value);
            }}
            indicatorColor="primary"
            textColor="primary"
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab label={t("current.orders")} value="current" />
            <StyledTab label={t("history.orders")} value="history" />
          </StyledTabs>
        </Filters>
        <TableContainer className="mt-4 rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((elm) => (
                  <TableCell key={elm.key}>
                    <TextFilter {...elm} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.data &&
                items.data.length &&
                items.data.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render
                          ? col.render(item, index)
                          : item[col.dataIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <LoaderComponent isLoader={loader} />
        {/*<Modal*/}
        {/*  open={deleteModal}*/}
        {/*  onClose={() => setDeleteModal(null)}*/}
        {/*  onConfirm={handleDeleteItem}*/}
        {/*  loading={deleteLoading}*/}
        {/*/>*/}
      </Card>
    </div>
  );
}
