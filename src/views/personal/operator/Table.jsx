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
import Pagination from "components/Pagination";
import Modal from "components/Modal";
import { deleteOperator, getOperators } from "services/operator";
import Filters from "components/Filters";
import Card from "components/Card";
import ActionMenu from "components/ActionMenu";
import LoaderComponent from "components/Loader";
import SwitchColumns from "components/Filters/SwitchColumns";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Search from "components/Search";

export default function TableOperator() {
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
    getItems(currentPage);
  }, [currentPage, search, limit]);

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteOperator(deleteModal.id)
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
      title: t("first.name"),
      key: "first.name",
      render: (record) => <div>{record.name}</div>,
    },
    {
      title: t("phone.number"),
      key: "phone-number",
      render: (record) => <div>{record.phone}</div>,
    },
  ];

  const getItems = (page) => {
    setLoader(true);
    getOperators({ limit, page, search })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.shipper_users,
        });
      })
      .finally(() => setLoader(false));
  };

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
                  history.push(`/home/personal/operator/${record.id}`);
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
  }, [limit, currentPage]);

  const extraFilter = (
    <div className="flex gap-4">
      {/* <Button
        icon={ExportIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => {
          console.log("clicked");
        }}
      >
        {t("import")}
      </Button>

      <Button
        icon={DownloadIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button> */}
    </div>
  );

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
      pageCount={limit}
      onChangeLimit={(limitNumber) => setLimit(limitNumber)}
      limit={limit}
    />
  );

  return (
    <>
      <Filters extra={extraFilter}>
        <Search debounceTime={350} setSearch={(value) => setSearch(value)} />
      </Filters>

      <Card className="m-4" footer={pagination}>
        <TableContainer className="rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns?.map((elm) => (
                  <TableCell key={elm.key}>{elm.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loader &&
                items?.data?.map((item, index) => (
                  <TableRow
                    key={item.id}
                    onClick={() =>
                      history.push(`/home/personal/operator/${item.id}`)
                    }
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns?.map((col) => (
                      <TableCell key={col.key}>
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
    </>
  );
}
