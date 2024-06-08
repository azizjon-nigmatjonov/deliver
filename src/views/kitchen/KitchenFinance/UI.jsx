import Header from "components/Header";
import { useTranslation } from "react-i18next";
import RangePicker from "components/DatePicker/RangePicker";
import Search from "components/Search";
import Filters from "components/Filters";
import CTable from "./Table";
import Card from "components/Card";
import Pagination from "components/Pagination";
import { useContext } from "react";
import { FinanceContext } from "./context";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import moment from "moment";

const UI = () => {
  const { t } = useTranslation();
  const {
    orderHeadColumns,
    courierHeadColumns,
    courierFinanceReportData,
    orderFinanceReportData,
    setSearch,
    value,
    setRange,
    range,
    theme,
    a11yProps,
    handleChange,
    handleChangeIndex,
    tabLabel,
    setLimit,
    limit,
    setCurrentPage,
  } = useContext(FinanceContext);
  console.log("courierFinanceReportData", courierFinanceReportData);
  return (
    <>
      <Header title={t("finance")} />
      <Filters>
        <div className="flex gap-4 items-center">
          <Search setSearch={(value) => setSearch(value)} width={250} />
          <RangePicker
            value={range}
            hideTimePicker
            placeholder={t("from.date.to.date")}
            onChange={(e) => {
              setRange({
                start_date: moment(e[0]).format("YYYY-MM-DD"),
                end_date: moment(e[1]).format("YYYY-MM-DD"),
              });
            }}
          />
        </div>
      </Filters>
      <div>
        <Card
          className="m-4"
          courierFinanceReportData
          footer={
            value === 1 ? (
              <Pagination
                title={t("general.count")}
                count={courierFinanceReportData?.count}
                onChange={(pageNumber) => setCurrentPage(pageNumber)}
                pageCount={limit}
                onChangeLimit={(limitNumber) => setLimit(limitNumber)}
                limit={limit}
              />
            ) : null
          }
        >
          <Header
            startAdornment={
              <StyledTabs
                value={value}
                onChange={handleChange}
                centered={false}
                aria-label="full width tabs example"
                TabIndicatorProps={{ children: <span className="w-2" /> }}
              >
                <StyledTab
                  label={tabLabel(t("clients"))}
                  {...a11yProps(0)}
                  style={{ width: "110px" }}
                />
                <StyledTab
                  label={tabLabel(t("couriers"))}
                  {...a11yProps(1)}
                  style={{ width: "100px" }}
                />
              </StyledTabs>
            }
          />
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <CTable
                headColumns={orderHeadColumns}
                bodyData={orderFinanceReportData?.reports}
                isLoading={false}
                footerData={orderFinanceReportData?.total_reports}
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <CTable
                headColumns={courierHeadColumns}
                bodyData={courierFinanceReportData?.reports}
                isLoading={false}
                footerData={courierFinanceReportData?.total_reports}
              />
            </TabPanel>
          </SwipeableViews>
        </Card>
      </div>
    </>
  );
};

export default UI;
