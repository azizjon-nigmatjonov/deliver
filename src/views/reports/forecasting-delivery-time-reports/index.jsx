import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import moment from "moment";
import Button from "components/Button";
import { DownloadIcon } from "constants/icons";
import FDropdown from "components/Filters/FDropdown";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Card from "components/Card";
import TabPanel from "components/Tab/TabPanel";
import { useHistory } from "react-router-dom";
import parseQuery from "helpers/parseQuery";
import DatePicker from "components/DatePicker";
import { getBranches } from "services/branch";
import { ExcelReport } from "services/excel";
import TableDayReports from "./TableDayReport";
import TableAllReports from "./TableAllReports";

function DeliveryTimeReports() {
  const history = useHistory();
  const { tab } = parseQuery();
  const [tabValue, setTabValue] = useState(+tab || 0);
  const { t } = useTranslation();
  const [branches, setBranches] = useState([]);

  const [filters, setFilters] = useState({
    date: moment().format("YYYY-MM-DD"),
    branch_id: null,
  });
  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    history.push({
      pathname: "/home/reports/forecasting",
      search: `tab=${newValue}`,
    });
  };
  useEffect(() => {
    getBranches({ limit: 50, page: 1 }).then((res) =>
      setBranches(
        res?.branches
          ? res?.branches?.map((item) => ({ label: item.name, value: item.id }))
          : [],
      ),
    );
  }, []);
  const downloadExcel = () => {
    if (tabValue === 0) {
      ExcelReport.courier_predict_report({
        date: filters?.date,
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
    } else if (tabValue === 1) {
      ExcelReport.product_predicted_report({
        date: filters?.date,
        branch_id: filters?.branch_id,
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
    }
  };
  return (
    <>
      <Header title={t("forecasting")} />
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
        <div className="flex gap-4 items-center product_report">
          <DatePicker
            className="w-full"
            hideTimePicker
            placeholder={t("enter.date")}
            inputDateClear
            hideTimeBlock
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                date: moment(e).format("YYYY-MM-DD"),
              }))
            }
          />
          <FDropdown
            className={!tabValue && "hidden"}
            value={filters.branch_id}
            options={branches}
            onClick={(e, close) => {
              setFilters({ ...filters, branch_id: e });
              close();
            }}
            reset={() => setFilters({ ...filters, branch_id: null })}
            label={t("branches")}
          />
        </div>
      </Filters>
      <Card
        filters={
          <StyledTabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="primary"
            centered={false}
            aria-label="full width tabs example"
          >
            <StyledTab
              label={tabLabel(t("прогнозирование по заказам"))}
              {...a11yProps(0)}
            />
            <StyledTab
              label={tabLabel(t("прогнозирование по продуктам"))}
              {...a11yProps(1)}
            />
          </StyledTabs>
        }
        className="m-4"
      >
        <TabPanel value={tabValue} index={0}>
          <TableDayReports tabValue={tabValue} filters={filters} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <TableAllReports tabValue={tabValue} filters={filters} />
        </TabPanel>
      </Card>
    </>
  );
}

export default DeliveryTimeReports;
