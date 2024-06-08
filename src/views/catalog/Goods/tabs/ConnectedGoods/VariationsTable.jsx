import { useState, useMemo, useEffect } from "react";
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
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import numberToPrice from "helpers/numberToPrice";
import StatusTag from "components/Tag/StatusTag";
import { useHistory } from "react-router-dom";

export default function VariationTable({
  items,
  isLoading,
  setDeleteModal,
  limit,
  setLimit,
  currentPage,
  setCurrentPage,
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const [columns, setColumns] = useState([]);

  const initialColumns = useMemo(() => {
    return [
      {
        title: "№",
        key: "order-number",
        render: (record, index) => (currentPage - 1) * limit + index + 1,
      },
      {
        title: t("product.image"),
        key: "product-image",
        render: (record) => (
          <img
            src={`${process.env.REACT_APP_MINIO_URL}/${record.image}`}
            alt={t("no.image")}
            width={"50"}
            height={"50"}
          />
        ),
      },
      {
        title: t("name"),
        key: "name",
        render: (record) => record.title.ru,
      },
      {
        title: t("vendor_code"),
        key: "vendor_code",
        render: (record) => record.code,
      },
      {
        title: t("price"),
        key: "price",
        render: (record) => numberToPrice(record.out_price),
      },
      // {
      //   title: t("description"),
      //   key: "description",
      //   render: (record) => record.description.ru,
      // },
      {
        title: t("status"),
        key: "status",
        render: (record) => (
          <StatusTag
            status={record.active}
            color={!record.active ? "#F2271C" : "#0E73F6"}
          />
        ),
      },
    ];
  }, [t, currentPage, limit]);

  useEffect(() => {
    var _columns = [
      ...initialColumns,
      {
        title: t("action"),
        key: t("actions"),
        render: (record, _, disable) => (
          <div className="flex gap-2 justify-center">
            <span
              className="cursor-pointer d-block border rounded-md p-2"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModal({ id: record.id });
              }}
            >
              <DeleteIcon color="error" />
            </span>
          </div>
        ),
      },
    ];
    setColumns(_columns);
  }, [initialColumns, t, setDeleteModal]);

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
            {!isLoading &&
              items.data?.length &&
              items.data.map((item, index) => (
                <TableRow
                  key={item.code}
                  onClick={() => {
                    history.push(`/home/catalog/goods/${item.id}`);
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      style={{
                        width: "100vw",
                      }}
                    >
                      {col.render
                        ? col.render(item, index, columns.length === 1)
                        : "----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={isLoading} />
    </Card>
  );
}
