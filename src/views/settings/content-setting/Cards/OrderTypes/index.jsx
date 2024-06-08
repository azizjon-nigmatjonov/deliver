import React from "react";
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
import Checkbox from "components/Checkbox/Checkbox";

const OrderTypes = ({ formik, orderTypes }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = formik;

  return (
    <Card title={t("order.type")}>
      <TableContainer className="border border-lightgray-1">
        <Table aria-label="simple-table">
          <TableHead>
            <TableRow>
              <TableCell>{t("sources")}</TableCell>
              {orderTypes?.map((row) => (
                <TableCell sx={{ textAlign: "center" }} key={row}>{t(row)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {values?.sources?.map((source, i) => (
              <TableRow key={source.source}>
                <TableCell>{t(source.source)}</TableCell>
                {source?.order_types?.map(
                  (delivery_type, idx) =>
                    delivery_type?.value !== "hall" && (
                      <TableCell sx={{ textAlign: "center" }} key={delivery_type?.value}>
                        <Checkbox
                          checked={delivery_type?.is_used}
                          color="primary"
                          onClick={({ target: { checked } }) =>
                            setFieldValue(
                              `sources[${i}].order_types[${idx}].is_used`,
                              checked,
                            )
                          }
                        />
                      </TableCell>
                    ),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default OrderTypes;
