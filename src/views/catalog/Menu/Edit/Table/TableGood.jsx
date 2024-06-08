import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMenuProducts } from "services/v2";
import { useParams } from "react-router-dom";
import ModalStop from "../Modal/Stop";
import ModalAdd from "../Modal/Add";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Pagination from "components/Pagination";
import Search from "components/Search";
import Button from "components/Button";
import AddIcon from "@mui/icons-material/Add";
import Card from "components/Card";
import DeleteIcon from "@mui/icons-material/Delete";
import StopIcon from "@mui/icons-material/Stop";
import ActiveIcon from "@mui/icons-material/NotificationsActive";
import SwitchColumns from "components/Filters/SwitchColumns";
import ActionMenu from "components/ActionMenu";
import numberToPrice from "helpers/numberToPrice";
import { menuTimerDiff } from "helpers/menuTimerDiff";
import { activateMenuProduct, deleteMenuProduct } from "services/v2";
import LoaderComponent from "components/Loader";

const TableGood = () => {
  const [limit, setLimit] = useState(10);
  const [items, setItems] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [loader, setLoader] = useState(false);
  const [product, setProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [goodOpenModal, setGoodOpenModal] = useState(false);
  const [stopProductModal, setStopProductModal] = useState(false);
  const [columns, setColumns] = useState([]);

  const { t } = useTranslation();
  const { id } = useParams();

  const handleStopModal = useCallback((record) => {
    setProduct({
      product_id: record?.id,
      menu_id: record?.menu_id,
    });
    setStopProductModal(true);
  }, []);

  const fetchData = useCallback(() => {
    setLoader(true);
    getMenuProducts({
      menu_id: id,
      limit,
      page: currentPage,
      search: searchQ,
    }).then((res) => {
      setItems({ count: res?.count, data: res?.menu_products });
      setLoader(false);
    });
  }, [currentPage, id, limit, searchQ]);

  const onDelete = useCallback(
    (elm) => {
      deleteMenuProduct(elm?.id, { menu_id: elm?.menu_id }).finally(() =>
        fetchData(),
      );
    },
    [fetchData],
  );
  const onActive = useCallback(
    (elm) => {
      activateMenuProduct(elm?.id, { menu_id: elm?.menu_id }).finally(() =>
        fetchData(),
      );
    },
    [fetchData],
  );
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
        render: (record) => record?.title?.ru,
      },
      {
        title: t("price"),
        key: "price",
        render: (record) => <>{numberToPrice(record?.price, "сум", ",")}</>,
      },
      {
        title: "Доступность",
        key: "availability",
        render: (record) => menuTimerDiff(record, t),
      },
    ],
    [currentPage, limit, t],
  );

  useEffect(() => {
    fetchData();
  }, [id, limit, currentPage, searchQ, fetchData]);

  useEffect(() => {
    const _columns = [
      ...initialColumns,
      {
        title: (
          <SwitchColumns
            columns={initialColumns}
            onChange={(val) =>
              setColumns((prev) => [...val, prev[prev.length - 1]])
            }
            iconClasses="flex justify-end mr-1"
          />
        ),
        key: t("actions"),
        render: (record) => (
            <ActionMenu
              id={record.id}
              actions={[
                {
                  icon: <ActiveIcon />,
                  color: "primary",
                  title: t("Активировать"),
                  action: () => {
                    onActive(record);
                  },
                },
                {
                  icon: <StopIcon />,
                  color: "warning",
                  title: t("stop.product"),
                  action: () => handleStopModal(record),
                },

                {
                  icon: <DeleteIcon />,
                  color: "error",
                  title: t("delete"),
                  action: () => onDelete(record),
                },
              ]}
            />
        ),
      },
    ];
    setColumns(_columns);
  }, [handleStopModal, initialColumns, onActive, onDelete, t]);

  return (
    <>
      <Card
        className="m-4"
        title={<Search setSearch={(val) => setSearchQ(val)} />}
        footer={
          <Pagination
            count={items?.count}
            limit={limit}
            pageCount={limit}
            onChange={(pageCount) => setCurrentPage(pageCount)}
            onChangeLimit={(limit) => setLimit(limit)}
          />
        }
        extra={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => setGoodOpenModal(true)}
          >
            {t("add")}
          </Button>
        }
      >
        <TableContainer className="rounded-md border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns?.map((col) => (
                  <TableCell className="whitespace-nowrap" key={col.key}>
                    {col.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loader &&
                items?.data?.map((elm, index) => (
                  <TableRow key={elm.id}>
                    {columns.map((col) => (
                      <TableCell
                        className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                        key={col.key}
                      >
                        {col.render ? col.render(elm, index) : "--"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <LoaderComponent isLoader={loader} />
      </Card>
      <ModalAdd
        fetchData={fetchData}
        goodOpenModal={goodOpenModal}
        setGoodOpenModal={setGoodOpenModal}
      />
      <ModalStop
        open={stopProductModal}
        product={product}
        fetchData={fetchData}
        onClose={() => setStopProductModal(false)}
      />
    </>
  );
};

export default TableGood;
