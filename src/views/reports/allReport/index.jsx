import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";
import Button from "components/Button";
import { DownloadIcon } from "constants/icons";
import Card from "components/Card";
import ByDateTable from "./ByDateTable";
import { ExcelReport } from "services/excel";

export default function AllReports() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    from_date: moment().subtract(5, "d").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    search: "",
  });
  const downloadExcel = () => {
    ExcelReport.all_operator({
      from_date: filters?.from_date,
      to_date: filters?.to_date,
    }).then((res) => downloadURI(res?.url, res?.file_name));
    function downloadURI(uri, name) {
      var link = document.createElement("a");
      link.setAttribute("download", name);
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };
  return (
    <>
      <Header title={t("all_report")} />
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
        <div className="flex gap-4 items-center">
          <RangePicker
            hideTimePicker
            placeholder={t("order.period")}
            onChange={(e) => {
              e[0] === null
                ? setFilters((old) => ({
                    ...old,
                    from_date: moment().subtract(5, "d").format("YYYY-MM-DD"),
                    to_date: moment().format("YYYY-MM-DD"),
                  }))
                : setFilters((old) => ({
                    ...old,
                    from_date: moment(e[0]).format("YYYY-MM-DD"),
                    to_date: moment(e[1]).format("YYYY-MM-DD"),
                  }));
            }}
          />
        </div>
      </Filters>
      <Card className="m-4">
        <ByDateTable filters={filters} setFilters={setFilters} />
      </Card>
    </>
  );
}
