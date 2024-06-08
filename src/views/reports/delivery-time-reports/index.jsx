import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import moment from "moment";
import Button from "components/Button";
import { DownloadIcon } from "constants/icons";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Card from "components/Card";
import TabPanel from "components/Tab/TabPanel";
import { useHistory } from "react-router-dom";
import parseQuery from "helpers/parseQuery";
import DatePicker from "components/DatePicker";
import { ExcelReport } from "services/excel";
import TableDayReports from "./TableDayReport";
import TableAllReports from "./TableAllReports";
import RangePicker from "components/DatePicker/RangePicker";

function DeliveryTimeReports() {
  const history = useHistory();
  const { tab } = parseQuery();
  const [tabValue, setTabValue] = useState(+tab || 0);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    start_date: moment().format("YYYY-MM-DD"),
    end_date: moment().add(1, "day").format("YYYY-MM-DD"),
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
      pathname: "/home/reports/delivery_time_reports",
      search: `tab=${newValue}`,
    });
  };
  const downloadExcel = () => {
    ExcelReport.time_report_excel({
      start_date: filters.start_date + " " + "05:00:00",
      end_date: filters.end_date + " " + "05:00:00",
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
      <Header title={t("delivery_time_reports")} />
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
          {!tabValue ? (
            <DatePicker
              className="w-full"
              hideTimePicker
              placeholder={t("enter.date")}
              hideTimeBlock
              onChange={(e) => {
                e === null
                  ? setFilters({
                      start_date: moment().format("YYYY-MM-DD"),
                      end_date: moment().add(1, "day").format("YYYY-MM-DD"),
                    })
                  : setFilters({
                      start_date: moment(e).format("YYYY-MM-DD"),
                      end_date: moment(e).add(1, "days").format("YYYY-MM-DD"),
                    });
              }}
            />
          ) : (
            <RangePicker
              hideTimePicker
              placeholder={t("order.period")}
              onChange={(e) => {
                e[0] === null
                  ? setFilters((old) => ({
                      ...old,
                      start_date: moment().format("YYYY-MM-DD"),
                      end_date: moment().add(1, "day").format("YYYY-MM-DD"),
                    }))
                  : setFilters((old) => ({
                      ...old,
                      start_date: moment(e[0]).format("YYYY-MM-DD"),
                      end_date: moment(e[1]).format("YYYY-MM-DD"),
                    }));
              }}
            />
          )}
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
            <StyledTab label={tabLabel(t("day_report"))} {...a11yProps(0)} />
            <StyledTab label={tabLabel(t("all_reports"))} {...a11yProps(1)} />
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
