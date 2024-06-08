import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getProfileReport } from "services/reports";
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
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";
import numberToPrice from "helpers/numberToPrice";

const Statistics = () => {
  const { shipper_user_id } = useSelector((state) => state.auth);
  const [reports, setReports] = useState([]);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    start_date: moment().format("YYYY-MM-DD"),
    end_date: moment().add(1, "days").format("YYYY-MM-DD"),
  });

  useEffect(() => {
    getProfileReport(shipper_user_id, {
      start_date: String(filters?.start_date) + " 05:00:00",
      end_date: String(filters?.end_date) + " 05:00:00",
    })
      .then((res) => setReports(res?.report))
      .catch((error) => console.log(error));
  }, [filters, shipper_user_id]);

  return (
    <div className="flex flex-wrap">
      <Card className="m-4 grid w-1/2">
        <div className="w-2/4 mb-4">
          <RangePicker
            hideTimePicker
            placeholder={t("order.period")}
            onChange={(e) => {
              [0] === null
                ? setFilters((old) => ({
                    ...old,
                    start_date: undefined,
                    end_date: undefined,
                  }))
                : setFilters((old) => ({
                    ...old,
                    start_date: moment(e[0]).format("YYYY-MM-DD"),
                    end_date: moment(e[1]).format("YYYY-MM-DD"),
                  }));
            }}
          />
        </div>
        <TableContainer className="border border-lightgray-1">
          <Table aria-label="simple-table">
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell className="w-2/3">Названия</TableCell>
                <TableCell>Кол-во</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>{t("admin")}</TableCell>
                <TableCell>{reports.admin_panel_orders_count || 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2</TableCell>
                <TableCell> {t("bot")} </TableCell>
                <TableCell>{reports.bot_orders_count || 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3</TableCell>
                <TableCell> {t("website")} </TableCell>
                <TableCell>{reports.website_orders_count || 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4</TableCell>
                <TableCell> {t("app")} </TableCell>
                <TableCell>{reports.app_orders_count || 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5</TableCell>
                <TableCell> {t("total.orders")} </TableCell>
                <TableCell>{reports.total_orders_count || 0}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Card className="m-4 grid- w-1/3">
        <br />
        <br />
        <TableContainer className="border border-lightgray-1">
          <Table aria-label="simple-table">
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell className="w-2/3">Названия</TableCell>
                <TableCell>Сумма</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell> {t("cash")} </TableCell>
                <TableCell className="whitespace-nowrap">
                  {numberToPrice(reports.total_sum_cash || 0)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2</TableCell>
                <TableCell> Click </TableCell>
                <TableCell className="whitespace-nowrap">
                  {numberToPrice(reports.total_sum_click || 0)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3</TableCell>
                <TableCell> Payme </TableCell>
                <TableCell className="whitespace-nowrap">
                  {numberToPrice(reports.total_sum_payme || 0)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4</TableCell>
                <TableCell> {t("delivery")} </TableCell>
                <TableCell className="whitespace-nowrap">
                  {numberToPrice(reports.total_sum_delivery || 0)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5</TableCell>
                <TableCell> {t("total.sum")} </TableCell>
                <TableCell className="whitespace-nowrap">
                  {numberToPrice(reports.total_sum || 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};

export default Statistics;
