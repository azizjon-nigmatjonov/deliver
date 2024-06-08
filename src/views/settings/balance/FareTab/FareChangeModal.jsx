import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

const FareChangeModal = ({ data, prevName, newName }) => {
  return (
    <div className="mb-5">
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                Старый тариф: <span className="font-semibold">{prevName}</span>
              </TableCell>
              <TableCell>
                Новый тариф: <span className="font-semibold">{newName}</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell width="100">
                Остаток фиксированной суммы:{" "}
                <span className="font-semibold">
                  {data?.rested_money_of_currently_fare}
                </span>
              </TableCell>
              <TableCell width="100">
                Cредний дневной расход:{" "}
                <span className="font-semibold">
                  {data?.approximately_daily_fee}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell width="100">
                Фиксированная сумма:
                <span className="font-semibold">
                  {data?.currently_fare_debt}
                </span>
              </TableCell>
              <TableCell width="100">
                Фиксированная сумма:
                <span className="font-semibold">{data?.next_fare_amount}</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell width="100">
                Сумма за сегодняшний день:{" "}
                <span className="font-semibold">{data?.today_orders_fee}</span>
              </TableCell>
              <TableCell width="100"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <p className="text-right mt-4">
        Ваш баланс:{" "}
        <span className="font-semibold">{data?.currently_balance}</span>
      </p>
      <p className="text-right mt-1">
        Итого:{" "}
        <span className="font-semibold">
          {data?.required_amount_for_change_fare}
        </span>
      </p>
    </div>
  );
};

export default FareChangeModal;
