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
import { useHistory } from "react-router-dom";
import reportServices from "services/v2/reports";

function ByProducts({ tabValue, filters }) {
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);

  const getItems = useCallback(() => {
    setLoader(true);
    reportServices
      .products({
        ...filters,
        branch_id: filters?.branch_id?.value,
        shipper_user_id: "",
        limit,
        page: currentPage,
      })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.reports,
        });
      })
      .finally(() => setLoader(false));
  }, [currentPage, filters, limit]);

  useEffect(() => {
    if (tabValue === 0) {
      getItems();
    }
  }, [filters, currentPage, limit, tabValue, getItems]);

  const initialColumns = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (_, index) => (
          <div style={{ width: "40px" }}>
            {(currentPage - 1) * limit + index + 1}
          </div>
        ),
      },
      {
        title: t("name"),
        key: "name",
        dataIndex: "name",
        render: (record) => <>{record?.product_name}</>,
      },
      {
        title: t("general.count"),
        key: "general.count",
        dataIndex: "general.count",
        render: (record) => <>{record?.total_products_count}</>,
      },
      {
        title: t("total_amount"),
        key: "total_amount",
        dataIndex: "total_amount",
        render: (record) => <>{record?.total_sum}</>,
      },
    ],
    [currentPage, t],
  );

  useEffect(() => {
    setColumns(initialColumns);
  }, [limit, currentPage, initialColumns]);

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
              {columns.map((elm) => (
                <TableCell
                  key={elm.key}
                  style={{ textAlign: "center" }}
                  className="whitespace-nowrap"
                >
                  {elm.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader && items.data && items.data.length
              ? items.data.map((item, index) => (
                  <TableRow
                    key={item.product_id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    onClick={() => history.push(`courier/${item.courier.id}`)}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        style={{ textAlign: "center" }}
                        className="whitespace-nowrap"
                      >
                        {col.render
                          ? col.render(item, index)
                          : item[col.dataIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loader} />
    </Card>
  );
}
export default ByProducts;
