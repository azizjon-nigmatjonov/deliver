import React, { useEffect, useState } from "react";
import Modal from "components/Modal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "components/Pagination";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import LoaderComponent from "components/Loader";
import Card from "components/Card";
import ActionMenu from "components/ActionMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getProducts, deleteProduct } from "services";

export default function CompanyBranches() {
  const { t } = useTranslation();
  const history = useHistory();

  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, limit]);

  const getItems = (page) => {
    setLoader(true);
    getProducts({ limit, page })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.products,
        });
      })
      .finally(() => setLoader(false));
  };

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

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: t("category_name"),
      key: "name",
      render: (record) => record.name,
    },
    {
      title: t("description"),
      key: "created_at",
      render: (record) => <>{record.description}</>,
    },
    {
      title: "",
      key: "actions",
      render: (record) => (
        <div className="flex gap-2">
          <ActionMenu
            id={record.id}
            actions={[
              {
                title: t("edit"),
                color: "primary",
                icon: <EditIcon />,
                action: () =>
                  history.push(`/home/settings/aggregator/${record.id}`),
              },
              {
                title: t("delete"),
                color: "error",
                icon: <DeleteIcon />,
                action: () => setDeleteModal({ id: record.id }),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <Card
      className=""
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
          limit={limit}
        />
      }
      bodyStyle={{ paddingRight: "0", paddingLeft: "0" }}
      footerStyle={{ paddingRight: "0", paddingLeft: "0" }}
    >
      <TableContainer className="rounded-md border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader && items.data && items.data.length ? (
              items.data.map((elm, index) => (
                <TableRow
                  key={elm.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(elm, index) : "----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <></>
            )}
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
