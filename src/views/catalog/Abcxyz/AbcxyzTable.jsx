import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LoaderComponent from "components/Loader";
import { useTranslation } from "react-i18next";

const ABCXYZTable = ({ currentPage, limit, loader, data }) => {
  const { t } = useTranslation();

  const abcxyzCols = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (record, index) => (
          <div>{(currentPage - 1) * limit + index + 1}</div>
        ),
      },
      {
        title: t("name"),
        key: "name",
        render: (record) => <div>{record.name}</div>,
      },
      {
        title: t("price"),
        key: "product_price",
        render: (record) => <div>{record.product_price}</div>,
      },
      {
        title: t("saled.count"),
        key: "sold_price",
        render: (record) => <div>{record.sold_price}</div>,
      },
      {
        title: "Доля от общей суммы",
        key: "sold_percent",
        render: (record) => <div>{record.sold_percent}%</div>,
      },
      {
        title: "Количество проданных",
        key: "sold_quantity",
        render: (record) => <div>{record.sold_quantity}</div>,
      },
      {
        title: "Доля от общего количества",
        key: "sold_quantity_percent",
        render: (record) => <div>{record.sold_quantity_percent}%</div>,
      },
    ],
    [t, currentPage, limit],
  );
  return (
    <div>
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {abcxyzCols?.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              data?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {abcxyzCols?.map((col) => (
                    <TableCell key={col.key}>
                      {col?.render ? col?.render(item, index) : "-----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LoaderComponent isLoader={loader} height={56} />
    </div>
  );
};

export default ABCXYZTable;
