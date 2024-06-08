import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import Card from "components/Card";
import ActionMenu from "components/ActionMenu";
import Filters from "components/Filters";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "components/Modal";
import StatusTag from "components/Tag/StatusTag";
import Widgets from "components/Widgets";
import PeopleIcon from "@mui/icons-material/People";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SwitchColumns from "components/Filters/SwitchColumns";
import Search from "components/Search";
import Button from "components/Button";
import { DownloadIcon } from "constants/icons";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import LaunchIcon from "@mui/icons-material/Launch";
import { postClientsImport } from "services/v2/clients";
import customerService from "services/customer";

export default function ApplicationTable() {
  const { t } = useTranslation();
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const history = useHistory();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [columns, setColumns] = useState([]);

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }));
  };

  const getItems = useCallback(
    (page) => {
      setLoader(true);
      clearItems();
      customerService
        .getList({ limit, page, search })
        .then((res) => {
          setItems(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setLoader(false));
    },
    [search, limit],
  );

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    customerService
      .delete(deleteModal)
      .then(() => {
        getItems(currentPage);
        setDeleteLoading(false);
        setDeleteModal(null);
      })
      .finally(() => setDeleteLoading(false));
  };

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, search, getItems]);

  const initialColumns = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
      },
      {
        title: t("client_name"),
        key: "first.name",
        render: (record) => <>{record.name}</>,
      },
      {
        title: t("count.orders"),
        key: "order-count",
        render: (record) => <>{record.orders_amount}</>,
      },
      {
        title: t("phone.number"),
        key: "phone-number",
        render: (record) => <>{record.phone}</>,
      },
      {
        title: t("status"),
        key: "status",
        render: (record) => (
          <StatusTag
            status={!record?.is_blocked}
            color={record.is_blocked ? "#F2271C" : "#0E73F6"}
          />
        ),
      },
    ],
    [currentPage, limit, t],
  );

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
                  history.push(`/home/clients/${record.id}`);
                },
              },
              {
                icon: <DeleteIcon />,
                color: "error",
                title: t("delete"),
                action: () => {
                  setDeleteModal(record?.id);
                },
              },
            ]}
          />
        ),
      },
    ];
    setColumns(_columns);
  }, [limit, currentPage, history, initialColumns, t]);

  const computedWidgetsData = useMemo(
    () => [
      {
        icon: PeopleIcon,
        number: +items.count || 0,
        title: t("clients"),
        key: "clients",
      },
      {
        icon: GroupAddIcon,
        number: +items.active_count || 0,
        title: t("active.clients"),
        key: "active.clients",
      },
      {
        icon: ShoppingCartIcon,
        number: +items.today_ordered_count || 0,
        title: t("today.ordered"),
        key: "today.ordered",
      },
      {
        icon: BorderColorIcon,
        number: +items.today_registered_count || 0,
        title: t("today.registered"),
        key: "today.registered",
      },
    ],
    [items, t],
  );

  const uploadFile = () => {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xlsm,.xltx,.xltm,.xls";
    document.body.appendChild(fileInput);
    fileInput.click();
    fileInput.addEventListener("change", (e) => {
      const fd = new FormData();

      fd.append("file", fileInput.files[0], "excel_file");
      postClientsImport(fd)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    });
    fileInput.remove();
  };

  return (
    <div>
      <Filters
        extra={
          <ActionMenu
            id="download"
            actions={[
              {
                icon: <FolderOutlinedIcon />,
                color: "#9AAFCD",
                title: t("upload"),
                action: () => uploadFile(),
              },
              {
                icon: <LaunchIcon />,
                color: "#9AAFCD",
                title: t("go_to_template"),
                action: () => {
                  window.open(
                    "https://docs.google.com/spreadsheets/d/1e4HIb-QoxHMj0HVa-zSVh8yAM4xr3wMxgzjGvaLKuAA/edit#gid=0",
                    "_blank",
                  );
                },
              },
            ]}
          >
            <Button
              icon={DownloadIcon}
              iconClassName="text-blue-600"
              color="zinc"
              shape="outlined"
              size="medium"
            >
              {t("import")}
            </Button>
          </ActionMenu>
        }
      >
        <Search setSearch={(value) => setSearch(value)} />
      </Filters>
      <div className="px-4 pt-4">
        <Widgets data={computedWidgetsData} />
      </div>

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
                {columns?.map((elm) => (
                  <TableCell key={elm.key}>{elm.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loader &&
                items?.customers?.map((item, index) => (
                  <TableRow
                    key={item.id}
                    onClick={() => history.push(`/home/clients/${item?.id}`)}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns?.map((col) => (
                      <TableCell key={col.key}>
                        {col?.render ? col?.render(item, index) : "-----"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <LoaderComponent isLoader={loader} />
        {/* <Pagination title={t("general.count")} count={items?.count}
                    onChange={pageNumber => setCurrentPage(pageNumber)} /> */}
        <Modal
          open={Boolean(deleteModal)}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDeleteItem}
          loading={deleteLoading}
        />
      </Card>
    </div>
  );
}
