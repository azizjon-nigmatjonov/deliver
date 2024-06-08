import React, { useEffect } from "react";
import {
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import SwitchColumns from "components/Filters/SwitchColumns";
import ActionMenu from "components/ActionMenu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const DiscountsTable = ({
  columns,
  setColumns,
  limit,
  currentPage,
  loader,
  discounts,
  deleteDiscount,
  setAddDiscountModalStatus,
  setData,
}) => {
  const { t } = useTranslation();
  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: t("name"),
      key: "name",
      render: (record) => record.name,
    },
    {
      title: t("sum"),
      key: "sum",
      render: (record) => record.price,
    },
  ];

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
                  setAddDiscountModalStatus(true);
                  setData({
                    price: record.price,
                    rkeeper: {
                      label: record.name,
                      value: record.rkeeper_code,
                    },
                  });
                },
              },
              {
                icon: <DeleteIcon />,
                color: "error",
                title: t("delete"),
                action: () => {
                  deleteDiscount(record.id);
                },
              },
            ]}
          />
        ),
      },
    ];
    setColumns(_columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, currentPage]);

  return (
    <TableContainer className="rounded-md border border-lightgray-1">
      <Table aria-label="simple table">
        <TableHead>
          <TableRow className="whitespace-nowrap">
            {columns.map((elm) => (
              <TableCell key={elm.key} className="whitespace-nowrap">
                {elm.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!loader &&
            discounts?.data.map((elm, index) => (
              <TableRow
                key={elm.id}
                onClick={() => {
                  setAddDiscountModalStatus(true);
                  setData({
                    price: elm.price,
                    rkeeper: {
                      label: elm.name,
                      value: elm.rkeeper_code,
                    },
                  });
                }}
                className={index % 2 === 0 ? "bg-lightgray-5" : ""}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(elm, index) : "----"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DiscountsTable;
