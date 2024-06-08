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

const Payments = ({ formik, payments }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = formik;

  return (
    <Card title={t("payments")}>
      <TableContainer className="border border-lightgray-1">
        <Table aria-label="simple-table">
          <TableHead>
            <TableRow>
              <TableCell>{t("sources")}</TableCell>
              {payments?.map((row) => (
                <TableCell sx={{ textAlign: "center" }} key={row}>
                  {t(row)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {values?.sources?.map((source, i) => (
              <TableRow key={source.source}>
                <TableCell>{t(source.source)}</TableCell>
                {source?.payment_types?.map((type, idx) => (
                  <TableCell sx={{ textAlign: "center" }} key={type.value}>
                    <Checkbox
                      id={`sources[${i}].payment_types[${idx}].is_used`}
                      checked={type?.is_used || false}
                      color="primary"
                      onClick={({ target: { checked } }) =>
                        setFieldValue(
                          `sources[${i}].payment_types[${idx}].is_used`,
                          checked,
                        )
                      }
                    />
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

export default Payments;
