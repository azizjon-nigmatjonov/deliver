import React, { useContext } from "react";
import Pagination from "components/Pagination";
import Card from "components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { BalanceContext } from "./context";

const BalanceTable = () => {
  const { t } = useTranslation();
  const { setCurrentPage, setLimit, limit, isSimilar, bodyData, data } =
    useContext(BalanceContext);
  return (
    <Card
      className="mt-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={data?.data?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
          limit={limit}
        />
      }
    >
      <TableContainer className="rounded-md border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {isSimilar()?.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bodyData?.map((item, index) => (
              <TableRow
                key={item.id}
                className={index % 2 === 0 ? "bg-lightgray-5" : ""}
              >
                {isSimilar()?.map((col) => (
                  <TableCell key={col.key}>
                    {col?.render ? col?.render(item, index) : "-----"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default BalanceTable;
