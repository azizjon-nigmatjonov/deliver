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
import { deleteCourier, getCouriers } from "../../../services/courier";
import LoaderComponent from "../../../components/Loader";
import SwitchColumns from "../../../components/Filters/SwitchColumns";
import ActionMenu from "../../../components/ActionMenu";
import Card from "../../../components/Card";
import Filters from "components/Filters";
import StatusTag from "../../../components/Tag/StatusTag";
import Search from "components/Search";

export default function TableCourier() {
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const history = useHistory();
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [search, setSearch] = useState("");
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
                  history.push(`/home/personal/couriers/list/${record.id}`);
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
  }, [currentPage]);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, search, limit]);

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteCourier(deleteModal.id)
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
      key: "order-number",
      render: (record, index) => (
        <div>{(currentPage - 1) * limit + index + 1}</div>
      ),
    },
    {
      title: t("fullName"),
      key: "fullName",
      render: (record) => (
        <div>{`${record.first_name} ${record.last_name}`}</div>
      ),
    },
    {
      title: t("phone.number"),
      key: "phone",
      render: (record) => <div>{record.phone}</div>,
    },
    {
      title: t("courier.type"),
      key: "courier_type",
      render: (record) => record.courier_type.name,
    },
    {
      title: t("status"),
      key: "status",
      render: (record) => (
        <div>
          <StatusTag
            status={record.is_active}
            color={!record.is_active ? "#F2271C" : "#0452C8"}
          />
        </div>
      ),
    },
  ];

  const getItems = (page) => {
    setLoader(true);
    getCouriers({ limit: limit, page, search })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.couriers,
        });
      })
      .finally(() => setLoader(false));
  };

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      pageCount={limit}
      limit={limit}
      onChangeLimit={(limitNumber) => setLimit(limitNumber)}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
  );

  const extraFilter = (
    <div className="flex gap-4">
      {/* <Button
        icon={ExportIcon}
        color="zinc"
        iconClassName="text-blue-600"
        shape="outlined"
        className="bg-white"
        onClick={() => {
          console.log("clicked")
        }}
      >
        {t("import")}
      </Button>

      <Button
        icon={DownloadIcon}
        color="zinc"
        iconClassName="text-blue-600"
        shape="outlined"
        className="bg-white"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button> */}
    </div>
  );

  return (
    <div>
      <Filters extra={extraFilter}>
        <Search setSearch={(value) => setSearch(value)} />
      </Filters>
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
              {!loader &&
                items?.data?.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        onClick={() =>
                          history.push(
                            `/home/personal/couriers/list/${item.id}`,
                          )
                        }
                      >
                        {col.render ? col.render(item, index) : "----"}
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
    </div>
  );
}
