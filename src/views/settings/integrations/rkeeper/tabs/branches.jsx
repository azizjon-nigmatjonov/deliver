import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Button from "components/Button";
import Card from "components/Card";
import Header from "components/Header";
import LoaderComponent from "components/Loader";
import Modal from "components/Modal";
import Pagination from "components/Pagination";
import Search from "components/Search";
import Tag from "components/Tag";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { deleteBranch } from "services";
import { getRKeeperBranchCredentials } from "services/v2/rkeeper_credentials";

const Branches = ({ filters }) => {
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

  const getItems = () => {
    setLoader(true);
    getRKeeperBranchCredentials({
      limit,
      page: currentPage,
      ...filters,
      search,
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.branches,
        });
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    getItems();
  }, [currentPage, filters, limit, search]);

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteBranch(deleteModal.id)
      .then((res) => {
        getItems();
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
      key: "branch_name",
      dataIndex: "branch_name",
      render: (record) => record.branch_name,
    },
    {
      title: t("URL"),
      key: "rkeeper_url",
      dataIndex: "rkeeper_url",
      render: (record) => <>{record.rkeeper_url}</>,
    },
    {
      title: t("status"),
      key: "iiko_id",
      render: ({ rkeeper_url }) => (
        <Tag
          className="p-1"
          color={rkeeper_url?.length ? "primary" : "warning"}
          lightMode={true}
        >
          {rkeeper_url?.length ? t("available") : t("unavailable")}
        </Tag>
      ),
    },
  ];

  useEffect(() => {
    const _columns = [...initialColumns];
    setColumns(_columns);
  }, [limit, currentPage]);

  // useEffect(() => {
  //   const _columns = [
  //     ...initialColumns,
  //     {
  //       title: (
  //         <SwitchColumns
  //           columns={initialColumns}
  //           onChange={(val) =>
  //             setColumns((prev) => [...val, prev[prev.length - 1]])
  //           }
  //         />
  //       ),
  //       key: "actions",
  //       render: (record, index) => (
  //         // <div>test</div>
  //         <ActionMenu
  //           id={record.id}
  //           actions={[
  //             {
  //               icon: <EditIcon />,
  //               color: "primary",
  //               title: t("change"),
  //               action: () => {
  //                 console.log("tesstt");
  //               },
  //             },
  //             {
  //               icon: <DeleteIcon />,
  //               color: "error",
  //               title: t("delete"),
  //               action: () => {
  //                 console.log("test");
  //               },
  //             },
  //           ]}
  //         />
  //       ),
  //     },
  //   ];
  //   setColumns(_columns);
  // }, [limit, currentPage]);

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
        startAdornment={<Search setSearch={(value) => setSearch(value)} />}
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() =>
              history.push("/home/settings/integrations/rkeeper/create-branch")
            }
          >
            {t("add")}
          </Button>
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
              items?.data?.map((item, index) => (
                <TableRow
                  key={item.branch_id}
                  onClick={() => {
                    history.push(
                      `/home/settings/integrations/rkeeper/create-branch/${item.branch_id}`,
                    );
                  }}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} width="100">
                      {col.render ? col.render(item, index) : "---"}
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
};

export default Branches;
