import React, { useState } from "react";
import Header from "components/Header";
import { useTranslation } from "react-i18next";
import Filters from "components/Filters";
import Button from "components/Button";
import { DownloadIcon } from "constants/icons";
import moment from "moment";
import Card from "components/Card";
import DailyReportTable from "./DailyReportTable";
import RangePicker from "components/DatePicker/RangePicker";
import { useEffect } from "react";
import { getOrderDailyExcelReport } from "services/v2/excel";
import reportServices from "services/v2/reports";

const DailyReport = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    from_date: moment().format("YYYY-MM-DD"),
    to_date: moment().add(1, "days").format("YYYY-MM-DD"),
    page: 1,
    limit: 200,
  });
  const [tableData, setTableData] = useState({});
  useEffect(() => {
    reportServices
      .order_daily_report(filters)
      .then(setTableData)
      .catch((err) => console.log(err));
  }, [filters]);

  const downloadExcel = () => {
    getOrderDailyExcelReport({
      from_date: filters.from_date,
      to_date: filters.to_date,
    })
      .then((res) => downloadURI(res?.url, res?.file_name))
      .catch((err) => console.log(err));
  };

  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.setAttribute("download", name);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div>
      <Header title={t("daily.report")} />
      <Filters
        className="mb-0"
        extra={
          <Button
            icon={DownloadIcon}
            iconClassName="text-blue-600"
            color="zinc"
            shape="outlined"
            size="medium"
            onClick={downloadExcel}
          >
            {t("download")}
          </Button>
        }
      >
        <RangePicker
          hideTimePicker
          placeholder={t("order.period")}
          onChange={(e) => {
            [0] === null
              ? setFilters((prev) => ({
                  ...prev,
                  from_date: undefined,
                  to_date: undefined,
                }))
              : setFilters((prev) => ({
                  ...prev,
                  from_date: moment(e[0]).format("YYYY-MM-DD"),
                  to_date: moment(e[1]).format("YYYY-MM-DD"),
                }));
          }}
        />
      </Filters>
      <Card className="m-4">
        <DailyReportTable
          tableData={tableData}
          page={filters?.page}
          limit={filters?.limit}
        />
      </Card>
    </div>
  );
};

export default DailyReport;
