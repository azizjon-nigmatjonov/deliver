import React, { useEffect, useMemo, useState } from "react";
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
import { useHistory } from "react-router-dom";
import Modal from "components/Modal";
import Header from "components/Header";
import Button from "components/Button";
import Search from "components/Search";
import { getAllCrmBranches, posterUpdateBranches } from "services/v2/poster";
import { Update } from "@mui/icons-material";

const Branches = () => {
  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [columns, setColumns] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const history = useHistory();

  const initialColumns = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
      },
      {
        title: t("name"),
        key: "name",
        dataIndex: "name",
        render: (record) => <>{record.branch_name}</>,
      },
      {
        title: t("created_at"),
        key: "created_at",
        dataIndex: "created_at",
        render: (record) => <>{record.created_at}</>,
      },
    ],
    [currentPage, limit, t],
  );

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, limit, search]);

  const getItems = (page) => {
    setLoader(true);
    getAllCrmBranches({ limit, page, search, type: "poster" })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.branches,
        });
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    const _columns = [...initialColumns];
    setColumns(_columns);
  }, [limit, currentPage, initialColumns]);

  const updatePosterBranches = () => {
    posterUpdateBranches({ type: "poster" }).then(() => {
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
        endAdornment={[
          <div className="flex gap-5">
            <Button icon={Update} size="medium" onClick={updatePosterBranches}>
              {t("update")}
            </Button>
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() =>
                history.push("/home/settings/integrations/poster/create-branch")
              }
            >
              {t("add")}
            </Button>
          </div>,
        ]}
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
                  onClick={() => {
                    history.push(
                      `/home/settings/integrations/poster/create-branch/${item.branch_id}`,
                    );
                  }}
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
        loading={false}
      />
    </Card>
  );
};

export default Branches;
