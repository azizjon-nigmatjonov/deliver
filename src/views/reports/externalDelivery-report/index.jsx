import RangePicker from "components/DatePicker/RangePicker";
import Filters from "components/Filters";
import Header from "components/Header";
import Search from "components/Search";
import Button from "components/Button";
import Card from "components/Card";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DownloadIcon } from "constants/icons";
import { ExcelReport } from "services/excel";
import ExternalDeliveryTable from "./ExternalDeliveryTable";
import { useExternalDeliveryReport } from "services/v2/external_delivery_report";
import Pagination from "components/Pagination";

const ExternalDelivery = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    from_date: moment().subtract(2, "day").format("YYYY-MM-DD H:mm:ss"),
    to_date: moment().format("YYYY-MM-DD H:mm:ss"),
    page: 1,
    limit: 10,
    external_type: "",
    status: "",
    search: "",
  });

  const downloadExcel = () => {
    ExcelReport.external_delivery_report({
      search: filters.search,
      external_type: filters.external_type,
      status: filters.status?.value,
      from_date: moment(filters.from_date).format("YYYY-MM-DD H:mm:ss"),
      to_date: moment(filters.to_date).format("YYYY-MM-DD H:mm:ss"),
    })
      .then((res) => downloadURI(res?.url, res?.file_name))
      .catch((e) => console.log("excel", e));
    function downloadURI(uri, name) {
      var link = document.createElement("a");
      link.setAttribute("download", name);
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const { data, refetch } = useExternalDeliveryReport({
    params: {
      from_date: filters.from_date,
      to_date: filters.to_date,
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      external_type: filters.external_type,
      status: filters.status,
    },
    props: {
      enabled: true,
    },
  });

  useEffect(() => refetch(), [filters]);

  return (
    <div>
      <Header title={t("external.delivery.report")} />
      <Filters
        className="mb-0 overflow-auto"
        extra={
          <Button
            className="ml-3"
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
        <div className="flex gap-4">
          <Search
            setSearch={(value) => setFilters({ ...filters, search: value })}
            width={250}
            placeholder={t("search")}
          />
          <RangePicker
            hideTimePicker
            placeholder={t("reports.period")}
            onChange={(e) => {
              e[0] === null
                ? setFilters((old) => ({
                    ...old,
                    from_date: moment()
                      .subtract(2, "day")
                      .format("YYYY-MM-DD H:mm:ss"),
                    to_date: moment().format("YYYY-MM-DD H:mm:ss"),
                  }))
                : setFilters((old) => ({
                    ...old,
                    from_date: moment(e[0]).format("YYYY-MM-DD H:mm:ss"),
                    to_date: moment(e[1]).format("YYYY-MM-DD H:mm:ss"),
                  }));
            }}
          />
        </div>
      </Filters>
      <Card
        className="m-4"
        footer={
          <Pagination
            title={t("general.count")}
            count={data?.count}
            onChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            limit={filters.limit}
            onChangeLimit={(limit) =>
              setFilters((prev) => ({ ...prev, limit }))
            }
          />
        }
      >
        <ExternalDeliveryTable
          data={data?.Reports}
          filters={filters}
          setFilters={setFilters}
        />
      </Card>
    </div>
  );
};

export default ExternalDelivery;
