import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "components/Pagination";
import Modal from "components/Modal";
import Card from "components/Card";
import ActionMenu from "components/ActionMenu";
import LoaderComponent from "components/Loader";
import SwitchColumns from "components/Filters/SwitchColumns";
import { deleteApelsinInfo, getApelsinInfo } from "services/apelsin";

export default function ApelsinTable({ search }) {
  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [columns, setColumns] = useState([]);

  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    getItems();
  }, [currentPage, limit, search]);

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
          />
        ),
        key: t("actions"),
        render: (record) => (
          <ActionMenu
            id={record.branch_id}
            actions={[
              {
                icon: <EditIcon />,
                color: "primary",
                title: t("change"),
                action: () => {
                  history.push(`apelsin/${record.branch_id}`);
                },
              },
              {
                icon: <DeleteIcon />,
                color: "error",
                title: t("delete"),
                action: () => {
                  setDeleteModal({ id: record.branch_id });
                },
              },
            ]}
          />
        ),
      },
    ];
    setColumns(_columns);
  }, [currentPage, limit]);

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteApelsinInfo(deleteModal.id)
      .then((res) => {
        getItems(currentPage);
        setDeleteLoading(false);
        setDeleteModal(null);
      })
      .finally(() => setDeleteLoading(false));
  };

  const initialColumns = [
    {
      title: "№",
      key: "promo-number",
      render: (_, index) => <div>{(currentPage - 1) * limit + index + 1}</div>,
    },
    {
      title: t("name.branch"),
      key: "branch_name",
      render: (record) => <div>{record.branch_name}</div>,
    },
    {
      title: t("id.cash"),
      key: "cash_id",
      render: (record) => <div>{record.cash_id}</div>,
    },
    {
      title: t("id.service"),
      key: "service_id",
      render: (record) => <div>{record.service_id}</div>,
    },
    {
      title: t("date.branch"),
      key: "created_at",
      render: (record) => <div>{record.created_at}</div>,
    },
  ];


  const getItems = (page) => {
    setLoader(true);
    getApelsinInfo({ limit, page: currentPage, search })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.apelsin_infos,
        });
      })
      .finally(() => setLoader(false));
  };

  const pagination = (
    <Pagination
      title={t("general.count")}
      limit={limit}
      count={items?.count}
      pageCount={limit}
      onChangeLimit={(limit) => setLimit(limit)}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
  );

  return (
    <>
      <Card className="m-4" footer={pagination}>
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
              {!loader && items.data && items.data.length
                ? items.data.map((item, index) => (
                    <TableRow
                      key={item.id}
                      onClick={() => {
                        history.push(`apelsin/${item.branch_id}`);
                      }}
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
                  ))
                : null}
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
    </>
  );
}
