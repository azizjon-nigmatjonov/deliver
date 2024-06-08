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
import { Input } from "alisa-ui";

const Links = ({ formik, socialLinks }) => {
  const { t } = useTranslation();
  const { values, handleChange } = formik;
  return (
    <Card title={t("link")} className="h-full">
      <TableContainer className="border border-lightgray-1">
        <Table aria-label="simple-table">
          <TableHead>
            <TableRow>
              <TableCell>{t("sources")}</TableCell>
              {socialLinks?.map((row) => (
                <TableCell sx={{ textAlign: "center" }} key={row}>{t(row)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {values?.sources?.map(
              (source, i) =>
                source.source !== "admin_panel" && (
                  <TableRow key={source.source}>
                    <TableCell>{t(source.source)}</TableCell>
                    {source?.links?.map((link, idx) => (
                      <TableCell sx={{ textAlign: "center" }} key={link.label}>
                        <Input
                          size="large"
                          id={`sources[${i}].links[${idx}].value`}
                          value={link.value}
                          onChange={handleChange}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default Links;
