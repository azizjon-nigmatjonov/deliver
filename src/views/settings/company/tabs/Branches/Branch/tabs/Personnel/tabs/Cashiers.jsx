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
import { branchUsers, deleteBranchUser } from "services";
import { useParams } from "react-router-dom";

export default function Cashiers({ tabValue }) {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();

  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    // if (tabValue === 2) {
    getItems(currentPage);
    // }
  }, [currentPage, limit]);

  const getItems = (page) => {
    setLoader(true);
    branchUsers({ limit, page, branch_id: tabValue === 2 ? params.id : "" })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.branch_users,
        });
      })
      .finally(() => setLoader(false));
  };

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteBranchUser(deleteModal.id)
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
      title: t("fio"),
      key: "name",
      render: (record) => record.name,
    },
    {
      title: t("phone.number"),
      key: "created_at2",
      render: (record) => <>{record.phone}</>,
    },
    {
      title: t("position"),
      key: "created_at3",
      render: (record) => <>{record.position}</>,
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
      footerStyle={{ paddingRight: "0", paddingLeft: "0" }}
      bodyStyle={{ paddingRight: "0", paddingLeft: "0" }}
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
                  onClick={() =>
                    history.push(
                      `/home/settings/company/branches/${params.id}/cashiers/${elm.id}`,
                    )
                  }
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
      {/* <Pagination title={t("general.count")} count={items?.count} onChange={pageNumber => setCurrentPage(pageNumber)} /> */}

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />
    </Card>
  );
}
