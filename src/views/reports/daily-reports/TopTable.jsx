import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const TopTable = ({ tableData }) => {
  const { t } = useTranslation();
  return (
    <TableContainer className="rounded-lg border border-lightgray-1 mb-8">
      <Table aria-label="simple-table">
        <TableHead>
          <TableRow>
            <TableCell className="w-1/4" style={{textAlign:'center'}}>{t("order.type")}</TableCell>
            <TableCell className="w-1/4" style={{textAlign:'center'}}>Кол-во заказов</TableCell>
            <TableCell className="w-1/4" style={{textAlign:'center'}}>{t("sum")}</TableCell>
            <TableCell className="w-1/4" style={{textAlign:'center'}}>Сумма с учётом доставки</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{textAlign:'center'}}>{t("delivery")}</TableCell>
            <TableCell style={{textAlign:'center'}}>{tableData?.all_delivery?.all_orders_count}</TableCell>
            <TableCell style={{textAlign:'center'}}>{tableData?.all_delivery?.all_orders_amount}</TableCell>
            <TableCell style={{textAlign:'center'}}>
              {tableData?.all_delivery?.all_orders_amount_with_delivery_price}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{textAlign:'center'}}>{t("pickup")}</TableCell>
            <TableCell style={{textAlign:'center'}}>
              {tableData?.all_self_pickup?.all_orders_count}
            </TableCell>
            <TableCell style={{textAlign:'center'}}>
              {tableData?.all_self_pickup?.all_orders_amount}
            </TableCell>
            <TableCell style={{textAlign:'center'}}>
              {
                tableData?.all_self_pickup
                  ?.all_orders_amount_with_delivery_price
              }
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{textAlign:'center'}}>{t("aggregator")}</TableCell>
            <TableCell style={{textAlign:'center'}}>{tableData?.all_aggregator?.all_orders_count}</TableCell>
            <TableCell style={{textAlign:'center'}}>
              {tableData?.all_aggregator?.all_orders_amount}
            </TableCell>
            <TableCell style={{textAlign:'center'}}>
              {tableData?.all_aggregator?.all_orders_amount_with_delivery_price}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{textAlign:'center'}}>{t("total")}</TableCell>
            <TableCell style={{textAlign:'center'}}>{tableData?.all_reports?.orders_count}</TableCell>
            <TableCell style={{textAlign:'center'}}>{tableData?.all_reports?.orders_price}</TableCell>
            <TableCell style={{textAlign:'center'}}>
              {tableData?.all_reports?.orders_price_with_delivery_price}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TopTable;
