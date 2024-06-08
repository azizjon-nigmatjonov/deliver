import React, { useCallback, useEffect, useMemo, useState } from "react";
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

import { deletePromo } from "../../../services/promotion";
import { getPromos } from "../../../services/promotion";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
//components
import Pagination from "components/Pagination";
import Modal from "components/Modal";
import Filters from "components/Filters";
import Card from "components/Card";
import ActionMenu from "components/ActionMenu";
import LoaderComponent from "components/Loader";
import SwitchColumns from "components/Filters/SwitchColumns";
import StatusTag from "../../../components/Tag/StatusTag";
import moment from "moment";
import Search from "components/Search";

export default function StockTable() {
  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [search, setSearch] = useState("");
  const [columns, setColumns] = useState([]);

  const { t } = useTranslation();
  const history = useHistory();

  const initialColumns = useMemo(
    () => [
      {
        title: "№",
        key: "promo-number",
        render: (record, index) => <>{(currentPage - 1) * 10 + index + 1}</>,
      },
      {
        title: t("name"),
        key: "title",
        render: (record) => <>{record.title.ru}</>,
      },
      {
        title: t("start.stock"),
        key: "start_time",
        dataIndex: "start_time",
        render: (record) => (
          <>
            {record.start_time &&
              moment.unix(record.start_time).format("DD.MM.YYYY")}
          </>
        ),
      },
      {
        title: t("finish.stock"),
        key: "end_time",
        dataIndex: "end_time",
        render: (record) => (
          <>
            {record.end_time &&
              moment.unix(record.end_time).format("DD.MM.YYYY")}
          </>
        ),
      },
      {
        title: t("status"),
        key: "status",
        render: (record) => (
          <StatusTag
            status={record.is_active}
            color={!record.is_active ? "#F2271C" : "#0E73F6"}
          />
        ),
      },
    ],
    [currentPage, t],
  );

  const getItems = useCallback(
    (page) => {
      setLoader(true);
      getPromos({ limit: 10, page, search })
        .then((res) => {
          setItems({
            count: res?.count,
            data: res?.promos,
          });
        })
        .finally(() => setLoader(false));
    },
    [search],
  );

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, search, getItems]);

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
            id={record.id}
            actions={[
              {
                icon: <EditIcon />,
                color: "primary",
                title: t("change"),
                action: () => {
                  history.push(`/home/marketing/stocks/${record.id}`);
                },
              },
              {
                icon: <DeleteIcon />,
                color: "error",
                title: t("delete"),
                action: () => {
                  setDeleteModal({ id: record.id });
                },
              },
            ]}
          />
        ),
      },
    ];
    setColumns(_columns);
  }, [history, initialColumns, t]);

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deletePromo(deleteModal.id)
      .then((res) => {
        getItems(currentPage);
        setDeleteLoading(false);
        setDeleteModal(null);
      })
      .finally(() => setDeleteLoading(false));
  };

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
  );

  return (
    <>
      <Filters>
        <Search setSearch={(value) => setSearch(value)} />
      </Filters>
      <Card className="m-4" footer={pagination}>
        <TableContainer className="rounded-lg border border-lightgray-1">
          {!loader ? (
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {columns.map((elm) => (
                    <TableCell key={elm.key}>{elm.title}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {items?.data?.map((item, index) => (
                  <TableRow
                    key={item.id}
                    onClick={() => {
                      history.push(`/home/marketing/stocks/${item.id}`);
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
                ))}
              </TableBody>
            </Table>
          ) : (
            <LoaderComponent isLoader={loader} />
          )}
        </TableContainer>
        <Modal
          open={Boolean(deleteModal)}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDeleteItem}
          loading={deleteLoading}
        />
      </Card>
    </>
  );
}
