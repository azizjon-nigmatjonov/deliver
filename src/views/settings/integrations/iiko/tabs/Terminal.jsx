import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getBranches } from "services";
import Tag from "components/Tag";
import { useHistory } from "react-router-dom";
import Header from "components/Header";
import Button from "components/Button";
import AddIcon from "@mui/icons-material/Add";
import { Update } from "@mui/icons-material";
import { iikoUpdateTerminals } from "services/v2/Iiko";
import Search from "components/Search";

export default function Terminal({ filters }) {
  const { t } = useTranslation();
  const history = useHistory();

  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, filters, limit, search]);

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

  const updateIikoTerminals = () => {
    iikoUpdateTerminals().then(() => {
      getItems(currentPage);
    });
  };

  const columns = [
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
      render: (record) => <>{record?.address}</>,
    },
    {
      title: t("status"),
      key: "iiko_terminal_id",
      render: (record) => (
        <Tag
          className="p-1"
          color={record?.iiko_terminal_id ? "primary" : "warning"}
          lightMode={true}
        >
          {record?.iiko_terminal_id ? t("available") : t("unavailable")}
        </Tag>
      ),
    },
  ];

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
          <div className="flex gap-4">
            <Button icon={Update} size="medium" onClick={updateIikoTerminals}>
              {t("update")}
            </Button>
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() =>
                history.push("/home/settings/integrations/iiko/terminal-create")
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
              items?.data?.map((item, index) => (
                <TableRow
                  key={item.id}
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
      </TableContainer>
      <LoaderComponent isLoader={loader} />
    </Card>
  );
}
