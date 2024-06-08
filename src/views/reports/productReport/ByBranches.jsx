import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import reportServices from "services/v2/reports";

function ByBranches({ filters, tabValue }) {
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);

  const getItems = useCallback(() => {
    setLoader(true);
    reportServices
      .products_by_branch({
        ...filters,
        branch_id: "",
        shipper_user_id: filters?.shipper_user_id?.value,
        page: currentPage,
        limit,
      })
      .then(setItems)
      .finally(() => setLoader(false));
  }, [currentPage, filters, limit]);

  useEffect(() => {
    if (tabValue === 1) {
      getItems();
    }
  }, [filters, currentPage, limit, getItems, tabValue]);

  const initialColumns = useMemo(
    () => [
      {
        title: t("general.count"),
        key: "general.count",
        dataIndex: "general.count",
        render: (record) => record?.total_products_count,
      },
      {
        title: t("total_amount"),
        key: "total_amount",
        dataIndex: "total_amount",
        render: (record) => record?.total_products_sum,
      },
    ],
    [t],
  );

  useEffect(() => {
    setColumns(initialColumns);
  }, [currentPage, limit, initialColumns]);

  return (
    <Card
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
              <TableCell rowSpan={2}>№</TableCell>
              <TableCell rowSpan={2}>{t("name")}</TableCell>
              {items?.branches?.map((branch) => (
                <TableCell
                  key={branch?.id}
                  colSpan={2}
                  style={{ textAlign: "center" }}
                >
                  {branch?.name}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {items?.branches?.map(() =>
                columns.map((elm) => (
                  <TableCell
                    key={elm.key}
                    style={{ textAlign: "center" }}
                    className="whitespace-nowrap"
                  >
                    {elm.title}
                  </TableCell>
                )),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              items?.reports?.map((item, index) => (
                <TableRow
                  key={item.product_id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                  <TableCell>{item?.product_name}</TableCell>
                  {items?.branches?.map((branch) =>
                    columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className="whitespace-nowrap"
                        style={{ textAlign: "center" }}
                      >
                        {col.render
                          ? item?.branches[branch?.id]
                            ? col.render(item?.branches[branch?.id])
                            : 0
                          : item[col.dataIndex]}
                      </TableCell>
                    )),
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loader} />
    </Card>
  );
}
export default ByBranches;
