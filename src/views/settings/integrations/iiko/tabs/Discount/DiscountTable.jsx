import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Pagination from "components/Pagination";
import AddIcon from "@mui/icons-material/Add";
import LoaderComponent from "components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Tag from "components/Tag";
import Header from "components/Header";
import Button from "components/Button";
import { Update, Edit } from "@mui/icons-material";
import Search from "components/Search";
import ActionMenu from "components/ActionMenu";
import { getCRMDiscounts, getIntegrationDiscounts } from "services/v2";
import DiscountCreate from "./DiscountCreate";

export default function DiscountsTable() {
  const { t } = useTranslation();

  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [columns, setColumns] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [ID, setID] = useState("");

  const updateIikoBranches = () => {
    getCRMDiscounts("iiko", { page: currentPage, limit }).then(getItems);
  };

  const getItems = useCallback(() => {
    setLoader(true);
    getIntegrationDiscounts({ limit, page: currentPage, search })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.discounts,
        });
      })
      .finally(() => setLoader(false));
  }, [limit, search, currentPage]);

  useEffect(() => {
    getItems();
  }, [currentPage, limit, getItems]);

  const initialColumns = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
      },
      {
        title: t("name"),
        key: "name",
        render: (record) => <>{record.system_discount_name?.ru}</>,
      },
      {
        title: t("status"),
        key: "iiko_id",
        render: (record) => (
          <Tag
            className="p-1"
            color={
              record.discount_data?.iiko_discount_id ? "primary" : "warning"
            }
            lightMode={true}
          >
            {record.discount_data?.iiko_discount_id
              ? t("connected")
              : t("not.connected")}
          </Tag>
        ),
      },
    ],
    [currentPage, limit, t],
  );

  useEffect(() => {
    const _columns = [
      ...initialColumns,
      {
        title: "",
        key: "actions",
        render: (record) => (
          <ActionMenu
            id={record.system_discount_id}
            actions={[
              {
                icon: <Edit />,
                color: "primary",
                title: t("edit"),
                action: () => {
                  setID(record.system_discount_id);
                  setOpen(true);
                },
              },
              // {
              //   icon: <Update />,
              //   color: "primary",
              //   title: t("update"),
              //   action: () => {
              //     record?.iiko_id &&
              //       record?.iiko_terminal_id &&
              //       putStopList.mutate({
              //         crm_type: "iiko",
              //         organization_id: record.iiko_id,
              //       });
              //   },
              // },
            ]}
          />
        ),
      },
    ];
    setColumns(_columns);
  }, [initialColumns, t, setOpen, setID]);

  return (
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
      <Header
        startAdornment={<Search setSearch={(value) => setSearch(value)} />}
        endAdornment={
          <div className="flex gap-5">
            <Button icon={Update} size="medium" onClick={updateIikoBranches}>
              {t("update")}
            </Button>
            <Button icon={AddIcon} size="medium" onClick={() => setOpen(true)}>
              {t("add")}
            </Button>
          </div>
        }
      />
      <TableContainer className="relative rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns?.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              items?.data?.map((item, index) => (
                <TableRow
                  key={item.system_discount_id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns?.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(item, index) : item[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LoaderComponent isLoader={loader} />

      <DiscountCreate
        systemDiscountID={ID}
        setSystemID={setID}
        open={open}
        refetch={getItems}
        onClose={() => {
          setOpen(false);
          setID("");
        }}
      />
    </Card>
  );
}
