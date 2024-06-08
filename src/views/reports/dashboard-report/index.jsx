import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import moment from "moment";
import Button from "components/Button";
import { BranchesIcon, PersonIcon } from "constants/icons";
import FDropdown from "components/Filters/FDropdown";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Card from "components/Card";
import TabPanel from "components/Tab/TabPanel";
import DashboardReportBranches from "./DashboardReportBranches";
import DashboardReportCouriers from "./DashboardReportCouriers";
import DatePicker from "components/DatePicker";
import { getDashboardBranch, getDashboardCourier } from "services/reports";
import { getBranches, getCouriers } from "services";
import "moment/locale/ru";

const CURRENT_MONTH = moment().clone().startOf("month").format("YYYY-MM-DD");
const END_MONTH = moment().clone().endOf("month").format("YYYY-MM-DD");

function DashboardReport() {
  const [tabValue, setTabValue] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [inputDateClear, setInputDateClear] = useState(false);
  const { t } = useTranslation();
  const [branches, setBranches] = useState([]);
  const [couriers, setCouriers] = useState([]);

  const [branchesReport, setBranchesReport] = useState([]);
  const [barNameBranch, setBarNameBranch] = useState([]);
  const [courierReport, setCourierReport] = useState([]);

  const [filters, setFilters] = useState({
    start_date1: CURRENT_MONTH,
    end_date1: END_MONTH,
    start_date2: CURRENT_MONTH,
    end_date2: END_MONTH,
    start_date3: CURRENT_MONTH,
    end_date3: END_MONTH,
    branch_id: "",
    courier_id: "",
  });

  const getData = useCallback(() => {
    setBarNameBranch([]);
    setBranchesReport([]);
    if (tabValue === 0) {
      setBtnLoading(true);
      getDashboardBranch({
        ...filters,
      })
        .then((res) => {
          res?.reports.map((report) => {
            setBranchesReport((prev) => [...prev, ...report.orders_amount]);
            let dateMonth = moment(report?.orders_amount[0].date)
              .locale("ru")
              .format("MMM");
            setBarNameBranch((prev) => [...prev, dateMonth]);
          });
        })
        .finally(() => setBtnLoading(false));
    } else {
      setBtnLoading(true);
      getDashboardCourier({
        start_date: filters.start_date1,
        end_date: filters.end_date1,
        courier_id: filters.courier_id,
        limit: 200,
      })
        .then((res) => {
          setCourierReport(res?.courier_dashboard_report.orders_amount);
        })
        .finally(() => setBtnLoading(false));
    }
  }, [filters, tabValue]);

  useEffect(() => {
    getData();
  }, []);

  const handleFDDropdownBranch = (branch_id, close) => {
    setFilters({
      ...filters,
      branch_id,
    });
    close();
  };
  const handleFDDropdownCouriers = (courier_id, close) => {
    setFilters({
      ...filters,
      courier_id,
    });
    close();
  };

  const clearFilter = () => {
    setFilters({
      ...filters,
      branch_id: null,
      courier_id: null,
    });
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );
  const handleDateClear = (e) => {
    setFilters({
      start_date1: CURRENT_MONTH,
      end_date1: END_MONTH,
      start_date2: CURRENT_MONTH,
      end_date2: END_MONTH,
      start_date3: CURRENT_MONTH,
      end_date3: END_MONTH,
      branch_id: "",
      courier_id: "",
    });
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    handleDateClear();
    setInputDateClear(!inputDateClear);
    setCourierReport([]);
    setBranchesReport([]);
  };

  useEffect(() => {
    getBranches({ limit: 100 }).then((res) => setBranches(res?.branches));
    getCouriers({ limit: 100 }).then((res) => setCouriers(res?.couriers));
  }, []);

  useEffect(() => {
    setBtnDisabled(true);
    if (!tabValue) {
      if (
        (filters.start_date1 !== null,
        filters.end_date1 !== null,
        filters.start_date2 !== null,
        filters.end_date2 !== null,
        filters.start_date3 !== null,
        filters.end_date3 !== null,
        filters.branch_id !== null)
      ) {
        setBtnDisabled(false);
      }
    } else {
      if (
        (filters.start_date1 !== null,
        filters.end_date1 !== null,
        filters.courier_id !== null)
      ) {
        setBtnDisabled(false);
      }
    }
  }, [filters]);

  return (
    <>
      <Header title={t("dashboard_report")} />
      <Filters className="mb-0" style={{ borderBottom: "none" }}>
        <div className="flex gap-4 items-center product_report">
          <DatePicker
            // inputDateClear={inputDateClear}
            className="w-full"
            defaultValue={moment(filters.start_date1)}
            hideTimePicker
            placeholder={t("enter.date")}
            mode={"month"}
            dateformat={"YYYY-MM"}
            onChange={(e) => {
              e !== null
                ? setFilters((prev) => ({
                    ...prev,
                    end_date1: moment(e)
                      .clone()
                      .endOf("month")
                      .format("YYYY-MM-DD "),
                    start_date1: moment(e)
                      .clone()
                      .startOf("month")
                      .format("YYYY-MM-DD "),
                  }))
                : setFilters({
                    start_date1: CURRENT_MONTH,
                    end_date1: END_MONTH,
                    start_date2: CURRENT_MONTH,
                    end_date2: END_MONTH,
                    start_date3: CURRENT_MONTH,
                    end_date3: END_MONTH,
                  });
            }}
            hideTimeBlock
            isMonth={true}
          />
          <DatePicker
            className={tabValue ? "hidden" : "w-full "}
            // inputDateClear={inputDateClear}
            hideTimePicker
            defaultValue={moment(filters.start_date2)}
            placeholder={t("enter.date")}
            mode={"month"}
            dateformat={"YYYY-MM"}
            onChange={(e) => {
              e !== null
                ? setFilters((prev) => ({
                    ...prev,
                    end_date2: moment(e)
                      .clone()
                      .endOf("month")
                      .format("YYYY-MM-DD "),
                    start_date2: moment(e)
                      .clone()
                      .startOf("month")
                      .format("YYYY-MM-DD "),
                  }))
                : setFilters({
                    start_date1: CURRENT_MONTH,
                    end_date1: END_MONTH,
                    start_date2: CURRENT_MONTH,
                    end_date2: END_MONTH,
                    start_date3: CURRENT_MONTH,
                    end_date3: END_MONTH,
                  });
            }}
            hideTimeBlock
            isMonth={true}
          />
          <DatePicker
            className={tabValue ? "hidden" : "w-full"}
            // inputDateClear={inputDateClear}
            hideTimePicker
            defaultValue={moment(filters.start_date3)}
            placeholder={t("enter.date")}
            mode={"month"}
            dateformat={"YYYY-MM"}
            onChange={(e) => {
              e !== null
                ? setFilters((prev) => ({
                    ...prev,
                    end_date3: moment(e)
                      .clone()
                      .endOf("month")
                      .format("YYYY-MM-DD "),
                    start_date3: moment(e)
                      .clone()
                      .startOf("month")
                      .format("YYYY-MM-DD "),
                  }))
                : setFilters({
                    start_date1: CURRENT_MONTH,
                    end_date1: END_MONTH,
                    start_date2: CURRENT_MONTH,
                    end_date2: END_MONTH,
                    start_date3: CURRENT_MONTH,
                    end_date3: END_MONTH,
                  });
            }}
            hideTimeBlock
            isMonth={true}
          />
          <FDropdown
            icon={!tabValue ? <BranchesIcon /> : <PersonIcon />}
            options={
              !tabValue
                ? branches.map(({ id, name }) => ({ label: name, value: id }))
                : couriers.map(({ id, first_name }) => ({
                    label: first_name,
                    value: id,
                  }))
            }
            onClick={
              !tabValue ? handleFDDropdownBranch : handleFDDropdownCouriers
            }
            reset={clearFilter}
            value={!tabValue ? filters.branch_id : filters.courier_id}
            label={!tabValue ? t("branches") : t("couriers")}
          />

          <Button
            size="large"
            disabled={btnDisabled}
            type="submit"
            loading={btnLoading}
            onClick={getData}
          >
            {t("search")}
          </Button>
        </div>
      </Filters>
      <Card
        className="m-4"
        startAdornment={[]}
        filters={
          <StyledTabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="primary"
            centered={false}
            aria-label="full width tabs example"
          >
            <StyledTab label={tabLabel(t("branches"))} {...a11yProps(0)} />
            <StyledTab label={tabLabel(t("couriers"))} {...a11yProps(1)} />
          </StyledTabs>
        }
      >
        <TabPanel value={tabValue} tabValue={tabValue} index={0}>
          <DashboardReportBranches
            barNameBranch={barNameBranch}
            branchesReport={branchesReport}
          />
        </TabPanel>
        <TabPanel value={tabValue} tabValue={tabValue} index={1}>
          <DashboardReportCouriers courierReport={courierReport} />
        </TabPanel>
      </Card>
    </>
  );
}

export default DashboardReport;
