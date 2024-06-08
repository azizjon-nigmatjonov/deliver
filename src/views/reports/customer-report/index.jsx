import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";
import AppsSharpIcon from "@mui/icons-material/AppsSharp";
import Button from "components/Button";
import { DownloadIcon, TypeDeliverIcon } from "constants/icons";
import FDropdown from "components/Filters/FDropdown";
import TimePicker from "components/TimePicker";
import TableCustomer from "./Table";
import { ExcelReport } from "services/excel";
import Search from "components/Search";
import customerService from "services/customer";

export default function Users() {
  const { t } = useTranslation();
  const [customerId, setCustomerId] = useState([]);
  const [filters, setFilters] = useState({
    from_date: moment().subtract(2, "day").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    from_time: moment("00:00:00", "H:mm:ss"),
    to_time: moment("23:59:59", "H:mm:ss"),
    customer_type_id: "",
    registration_source: "",
    search: "",
  });
  const sourceData = [
    { label: t("admin_panel"), value: "admin-panel" },
    { label: t("bot"), value: "bot" },
    { label: t("app"), value: "app" },
    { label: t("website"), value: "website" },
  ];
  const fetchData = async () => {
    customerService.getTypes({ limit: 100, page: 1 }).then((res) =>
      setCustomerId(
        res?.customer_types &&
          res?.customer_types?.map((customer_type) => ({
            label: customer_type?.name,
            value: customer_type?.id,
          })),
      ),
    );
  };

  useEffect(() => {
    fetchData();
  }, []);
  const downloadExcel = () => {
    ExcelReport.client_order_report({
      ...filters,
      from_time: moment(filters.from_time).format("H:mm:ss"),
      to_time: moment(filters.to_time).format("H:mm:ss"),
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
  return (
    <>
      <Header title={t("customer_report")} />
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
            placeholder={t("Искать клиента")}
          />
          <RangePicker
            hideTimePicker
            placeholder={t("order.period")}
            onChange={(e) => {
              e[0] === null
                ? setFilters((old) => ({
                    ...old,
                    from_date: moment().subtract(2, "day").format("YYYY-MM-DD"),
                    to_date: moment().format("YYYY-MM-DD"),
                  }))
                : setFilters((old) => ({
                    ...old,
                    from_date: moment(e[0]).format("YYYY-MM-DD"),
                    to_date: moment(e[1]).format("YYYY-MM-DD"),
                  }));
            }}
          />
          <TimePicker
            showSecond={true}
            showHour={true}
            style={{ width: 150 }}
            value={filters.from_time}
            placeholder={"00:00:00"}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                from_time: e,
              }));
            }}
          />
          <TimePicker
            showSecond={true}
            showHour={true}
            style={{ width: 150 }}
            value={filters.to_time}
            placeholder={"23:59:59"}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                to_time: e,
              }));
            }}
          />

          <FDropdown
            icon={<TypeDeliverIcon />}
            options={customerId}
            onClick={(val, close) => {
              setFilters((prev) => ({ ...prev, customer_type_id: val }));
              close();
            }}
            reset={() =>
              setFilters((prev) => ({ ...prev, customer_type_id: null }))
            }
            value={filters.customer_type_id}
            label={t("client.type")}
          />

          <FDropdown
            icon={<AppsSharpIcon style={{ fill: "#0e73f6" }} />}
            options={sourceData}
            onClick={(val, close) => {
              setFilters((prev) => ({ ...prev, registration_source: val }));
              close();
            }}
            reset={() =>
              setFilters((prev) => ({ ...prev, registration_source: null }))
            }
            value={filters.region_id}
            label={t("Источник")}
          />
        </div>
      </Filters>
      <TableCustomer filters={filters} />
    </>
  );
}
