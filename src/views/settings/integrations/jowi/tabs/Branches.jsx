import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Pagination from "components/Pagination";
import AddIcon from "@mui/icons-material/Add";
import LoaderComponent from "components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getBranches, deleteBranch } from "services";
import Tag from "components/Tag";
import { useHistory } from "react-router-dom";
import Modal from "components/Modal";
import Header from "components/Header";
import Button from "components/Button";
import Search from "components/Search";
import { jowiUpdateBranches, useIiko } from "services/v2";
import ActionMenu from "components/ActionMenu";
import { Update } from "@mui/icons-material";

export default function JowiBranches({ filters }) {
  const { t } = useTranslation();
  const history = useHistory();

  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [columns, setColumns] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, filters, limit, search]);

  const { putStopList } = useIiko({
    props: {
      onSuccess: (data) => {
        console.log(data);
      },
    },
  });
  const getItems = (page) => {
    setLoader(true);
    getBranches({ limit, page, ...filters, search })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.branches,
        });
      })
      .finally(() => setLoader(false));
  };

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteBranch(deleteModal.id)
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
      render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("name"),
      key: "name",
      dataIndex: "name",
    },
    {
      title: t("navigation"),
      key: "address",
      dataIndex: "address",
      render: (record) => <>{record.address}</>,
    },
    {
      title: t("status"),
      key: "is_active",
      render: (record) => (
        <Tag
          className="p-1"
          color={record.jowi_id ? "primary" : "warning"}
          lightMode={true}
        >
          {record.jowi_id ? t("connected") : t("not.connected")}
        </Tag>
      ),
    },
    {
      title: " ",
      key: "actions",
      render: (record) => (
        <ActionMenu
          id={record.id}
          actions={[
            {
              icon: <Update />,
              color: "primary",
              title: t("update"),
              action: () => {
                record?.jowi_id &&
                  putStopList.mutate({
                    crm_type: "jowi",
                    branch_id: record.id,
                  });
              },
            },
          ]}
        />
      ),
    },
  ];

  useEffect(() => {
    const _columns = [...initialColumns];
    setColumns(_columns);
  }, [limit, currentPage]);

  const updateJowiBranches = () => {
    jowiUpdateBranches().then(() => {
      getItems(currentPage);
    });
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
      <Header
        startAdornment={[<Search setSearch={(value) => setSearch(value)} />]}
        endAdornment={
          <div className="flex gap-5">
            <Button icon={Update} size="medium" onClick={updateJowiBranches}>
              {t("update")}
            </Button>
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() =>
                history.push("/home/settings/integrations/jowi/branch-create")
              }
            >
              {t("add")}
            </Button>
          </div>
        }
      />
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
              items.data &&
              items.data.length &&
              items.data.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} width="100px">
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
