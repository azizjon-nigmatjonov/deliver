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

import Pagination from "../../../components/Pagination";
import Modal from "../../../components/Modal";
import {
  deleteCourierType,
  getCourierTypes,
} from "../../../services/courierType";
import LoaderComponent from "../../../components/Loader";
import SwitchColumns from "../../../components/Filters/SwitchColumns";
import Card from "../../../components/Card";
import ActionMenu from "../../../components/ActionMenu";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";

export default function CourierTypeTable({ search }) {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [columns, setColumns] = useState([]);
  const [limit, setLimit] = useState(10);

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
        key: "actions",
        render: (record) => (
          <ActionMenu
            id={record.id}
            actions={[
              {
                icon: <EditIcon />,
                color: "primary",
                title: t("change"),
                action: () => {
                  history.push(
                    `/home/personal/couriers/courier-type/${record.id}`,
                  );
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
  }, [limit]);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, search, limit]);

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteCourierType(deleteModal.id)
      .then((res) => {
        getItems(currentPage);
        setDeleteLoading(false);
        setDeleteModal(null);
      })
      .finally(() => setDeleteLoading(false))
      .catch((e) => {
        if (e?.data?.Error === "you can't delete, courier uses this type!") {
          dispatch(
            showAlert(
              "Нельзя удалить тип курьера, когда существует курьер с таким типом",
              "error",
            ),
          );
        } else {
          dispatch(showAlert(e?.data?.Error, "error"));
        }
      });
  };

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (
        <div>{(currentPage - 1) * limit + index + 1}</div>
      ),
    },
    {
      title: t("first.name"),
      key: "fullName",
      dataIndex: "name",
    },
    {
      title: t("distance.from"),
      key: "distance_from",
      dataIndex: "distance_from",
    },
    {
      title: t("distance.to"),
      key: "distance_to",
      dataIndex: "distance_to",
    },
  ];

  const getItems = (page) => {
    setLoader(true);
    getCourierTypes({ limit, page, search })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.courier_type,
        });
      })
      .finally(() => setLoader(false));
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
              items?.data?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  onClick={() =>
                    history.push(
                      `/home/personal/couriers/courier-type/${item.id}`,
                    )
                  }
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
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />
    </Card>
  );
}
