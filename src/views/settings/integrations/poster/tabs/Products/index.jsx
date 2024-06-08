import React, { useCallback, useEffect, useState } from "react";
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
import Tag from "components/Tag";
import { useHistory } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Button from "components/Button";
import { Update } from "@mui/icons-material";
import Search from "components/Search";
import { getNonOriginProducts } from "services/v2";
import { posterUpdateMenu } from "services/v2/poster";

const Products = () => {
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
  const columns_product = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("meal_name"),
      key: "name",
      dataIndex: "title",
      render: (record) => <>{record?.title?.ru}</>,
    },
    {
      title: t("tied_product"),
      key: "tied_product",
      dataIndex: "tied_product",
      render: (record) => <>{record?.crm_name}</>,
    },
    {
      title: t("price"),
      key: "price",
      dataIndex: "price",
      render: (record) => <>{record?.out_price}</>,
    },
    {
      title: t("type"),
      key: "type",
      dataIndex: "type",
      render: (record) => <>{t(record?.type)}</>,
    },
    {
      title: t("status"),
      key: "is_active",
      render: ({ poster_id }) => (
        <Tag
          className="p-1"
          color={poster_id ? "primary" : "warning"}
          lightMode={true}
        >
          {poster_id ? t("connected") : t("not.connected")}
        </Tag>
      ),
    },
  ];

  const getItems = useCallback(() => {
    setLoader(true);
    getNonOriginProducts({
      crm_type: "poster",
      limit,
      page: currentPage,
      search,
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.products,
        });
      })
      .finally(() => setLoader(false));
  }, [currentPage, limit, search]);

  useEffect(() => {
    getItems();
  }, [getItems, currentPage, limit, search]);

  const updateJowiMenu = () => {
    posterUpdateMenu({ type: "poster" }).then(() => {
      getItems(currentPage);
    });
  };

  return (
    <Card
      className="m-4"
      title={t("product")}
      extra={
        <div className="flex gap-5">
          <Search setSearch={(value) => setSearch(value)} />
          <Button icon={Update} size="medium" onClick={updateJowiMenu}>
            {t("update")}
          </Button>
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() =>
              history.push("/home/settings/integrations/poster/create-product")
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
              {columns_product.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
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
                  {columns_product.map((col) => (
                    <TableCell key={col?.key} width="100">
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
};

export default Products;
