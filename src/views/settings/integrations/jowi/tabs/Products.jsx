import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { deleteProduct } from "services";
import { getNonOriginProducts, jowiUpdateMenu } from "services/v2";
import Tag from "components/Tag";
import { useHistory } from "react-router-dom";
import Modal from "components/Modal";
import Header from "components/Header";
import AddIcon from "@mui/icons-material/Add";
import Button from "components/Button";
import { Update } from "@mui/icons-material";
import Search from "components/Search";

export default function JowiProducts({ filters }) {
  const { t } = useTranslation();
  const history = useHistory();

  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [columns, setColumns] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getItems = useCallback(() => {
    setLoader(true);
    getNonOriginProducts({
      crm_type: "jowi",
      limit,
      page: currentPage,
      ...filters,
      search,
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.products,
        });
      })
      .finally(() => setLoader(false));
  }, [currentPage, filters, limit, search]);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, filters, limit, search, getItems]);

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteProduct(deleteModal.id)
      .then((res) => {
        getItems(currentPage);
        setDeleteLoading(false);
        setDeleteModal(null);
      })
      .finally(() => setDeleteLoading(false));
  };

  const initialColumns = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
      },
      {
        title: t("meal_name"),
        key: "name",
        dataIndex: "name",
        render: (record) => <>{record.title?.ru}</>,
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
        render: (record) => <>{record.out_price}</>,
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
        render: ({ jowi_id }) => (
          <Tag
            className="p-1"
            color={jowi_id ? "primary" : "warning"}
            lightMode={true}
          >
            {jowi_id ? t("connected") : t("not.connected")}
          </Tag>
        ),
      },
    ],
    [currentPage, limit, t],
  );

  useEffect(() => {
    const _columns = [...initialColumns];
    setColumns(_columns);
  }, [limit, currentPage, initialColumns]);

  const updateJowiMenu = () => {
    jowiUpdateMenu().then(() => {
      getItems(currentPage);
    });
  };

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
        startAdornment={[<Search setSearch={(value) => setSearch(value)} />]}
        endAdornment={
          <div className="flex gap-4">
            <Button icon={Update} size="medium" onClick={updateJowiMenu}>
              {t("update")}
            </Button>
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() =>
                history.push("/home/settings/integrations/jowi/add-product")
              }
            >
              {t("add")}
            </Button>
          </div>
        }
      />
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              items.data &&
              items.data.length &&
              items.data.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} width="100">
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
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />
    </Card>
  );
}
