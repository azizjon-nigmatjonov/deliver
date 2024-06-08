import React, { useCallback, useEffect, useState } from "react";
import Modal from "components/Modal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "components/Pagination";
import { useTranslation } from "react-i18next";
import { getUserRoles, deleteUserRole } from "services";
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

export default function UserRolesTable({ userTypeId }) {
  const { t } = useTranslation();
  const history = useHistory();
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const getItems = useCallback(
    (page) => {
      setLoader(true);
      getUserRoles({ limit, page, user_type_id: userTypeId })
        .then((res) => {
          setItems({
            count: res?.count,
            data: res?.user_roles,
          });
        })
        .finally(() => setLoader(false));
    },
    [limit, userTypeId],
  );

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, userTypeId, limit, getItems]);

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteUserRole(deleteModal.id)
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
      title: t("name"),
      key: "name",
      render: (record) => record.name,
    },
    {
      title: "",
      key: "actions",
      render: (record) => (
        <ActionMenu
          id={record.id}
          actions={[
            {
              title: t("edit"),
              color: "primary",
              icon: <EditIcon />,
              action: () =>
                history.push(`/home/settings/user-roles/${record.id}`),
            },
            {
              title: t("delete"),
              color: "error",
              icon: <DeleteIcon />,
              action: () => setDeleteModal({ id: record.id }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Card
      className="m-4"
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
            {!loader &&
              items?.data?.map((elm, index) => (
                <TableRow
                  key={elm.id}
                  onClick={() =>
                    history.push(`/home/settings/user-roles/${elm.id}`)
                  }
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(elm, index) : "----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loader} />

      <Modal
        open={Boolean(deleteModal)}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />
    </Card>
  );
}
