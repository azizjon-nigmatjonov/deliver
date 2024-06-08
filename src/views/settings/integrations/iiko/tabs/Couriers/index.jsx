import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Update, Add } from "@mui/icons-material";
import Button from "components/Button";
import Card from "components/Card";
import LoaderComponent from "components/Loader";
import Pagination from "components/Pagination";
import Search from "components/Search";
import Tag from "components/Tag";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { getCouriers } from "services";
import { updateCrmCouriers } from "services/v2/crm";

export default function Couriers() {
  const { t } = useTranslation();
  const history = useHistory();
  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({
    count: "",
    data: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const getItems = useCallback(
    (page) => {
      setLoader(true);
      getCouriers({
        limit,
        page: currentPage,
        search,
      })
        .then((res) => {
          setItems({
            count: res?.count,
            data: res?.couriers,
          });
        })
        .finally(() => setLoader(false));
    },
    [currentPage, limit, search],
  );

  useEffect(() => {
    getItems();
  }, [currentPage, limit, search, getItems]);

  const updateIikoMenu = () => {
    updateCrmCouriers().then(() => getItems());
  };

  const tableColumns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("full_name"),
      key: "full_name",
      dataIndex: "full_name",
      render: (record) => (
        <>
          {record?.first_name} {record?.last_name}
        </>
      ),
    },
    {
      title: t("status"),
      key: "is_active",
      render: ({ iiko_id }) => (
        <Tag
          className="p-1"
          color={iiko_id ? "primary" : "warning"}
          lightMode={true}
        >
          {iiko_id ? t("connected") : t("not.connected")}
        </Tag>
      ),
    },
  ];

  return (
    <Card
      className="m-4"
      title={t("couriers")}
      extra={
        <div className="flex gap-5">
          <Search setSearch={(value) => setSearch(value)} />

          <Button icon={Update} size="medium" onClick={updateIikoMenu}>
            {t("update")}
          </Button>

          <Button
            icon={Add}
            size="medium"
            onClick={() =>
              history.push("/home/settings/integrations/iiko/courier-connect")
            }
          >
            {t("add")}
          </Button>
        </div>
      }
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
              {tableColumns.map((elm) => (
                <TableCell key={elm.key + elm.title}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              items?.data?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {tableColumns.map((col) => (
                    <TableCell key={col?.key}>
                      {col?.render
                        ? col?.render(item, index)
                        : item[col?.dataIndex]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loader} />
    </Card>
  );
}
