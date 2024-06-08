import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";
import Button from "components/Button";
import { BranchesIcon, DownloadIcon } from "constants/icons";
import FDropdown from "components/Filters/FDropdown";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Card from "components/Card";
import TabPanel from "components/Tab/TabPanel";
import { useHistory } from "react-router-dom";
import parseQuery from "helpers/parseQuery";
import BranchOrderReport from "./BranchOrderReport";
import BranchOrderTimeReport from "./BranchOrderTimeReport";
import { getBranches } from "services";
import { ExcelReport } from "services/excel";
import TimePicker from "components/TimePicker";

function BranchReport() {
  const history = useHistory();
  const { tab } = parseQuery();
  const [tabValue, setTabValue] = useState(+tab || 0);
  const [branch, setBranch] = useState([]);
  const [deliveryType, setDeliveryType] = useState([]);

  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    from_date: moment().subtract(5, "d").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    from_time: null,
    to_time: null,
    branch_id: "",
    delivery_type: "",
  });
  const deliveryTypeData = [
    { label: t("all"), value: null },
    { label: t("fair"), value: "delivery" },
    { label: t("pickup"), value: "self-pickup" },
  ];
  const handleFDDropdown = (branchId, close) => {
    setFilters({
      ...filters,
      branch_id: branchId,
    });
    close();
  };
  const clearRegion = () => {
    setFilters({
      ...filters,
      branch_id: null,
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

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    history.push({
      pathname: "/home/reports/branch_report",
      search: `tab=${newValue}`,
    });
  };
  useEffect(() => {
    getBranches({ limit: 20, page: 1 }).then((res) =>
      setBranch(
        res?.branches
          ? res?.branches?.map((branch) => ({
              label: branch?.name,
              value: branch?.id,
            }))
          : [],
      ),
    );
    setDeliveryType(
      deliveryTypeData.map((item) => ({
        label: item.label,
        value: item.value,
      })),
    );
  }, []);
  const downloadExcel = () => {
    if (tabValue === 0) {
      ExcelReport.branch_order_report({
        from_date: filters?.from_date,
        to_date: filters?.to_date,
        branch_id: filters?.branch_id,
      })
        .then((res) => downloadURI(res?.url, res?.file_name))
        .catch((e) => console.log(e));
      function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.setAttribute("download", name);
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } else if (tabValue === 1) {
      ExcelReport.branch_order_time_report({
        from_date: filters?.from_date,
        to_date: filters?.to_date,
        branch_id: filters?.branch_id,
        delivery_type: filters?.delivery_type,
      })
        .then((res) => downloadURI(res?.url, res?.file_name))
        .catch((e) => console.log(e));
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
      <Header title={t("branch_report")} />
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
                    from_date: moment()
                      .subtract(5, "d")
                      .format("YYYY-MM-DD h:mm:ss"),
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
            style={{ width: 170 }}
            showSecond
            value={filters?.from_time}
            onChange={(e) => {
              e === null
                ? setFilters((old) => ({
                    ...old,
                    from_time: null,
                  }))
                : setFilters((old) => ({
                    ...old,
                    from_time: e,
                  }));
            }}
          />
          <TimePicker
            style={{ width: 170 }}
            showSecond
            value={filters?.to_time}
            onChange={(e) => {
              e === null
                ? setFilters((old) => ({
                    ...old,
                    to_time: null,
                  }))
                : setFilters((old) => ({
                    ...old,
                    to_time: e,
                  }));
            }}
          />
          <FDropdown
            options={branch}
            onClick={handleFDDropdown}
            reset={clearRegion}
            value={filters.branch_id}
            label={t("branch")}
            icon={<BranchesIcon />}
          />
          <FDropdown
            className={tabValue === 0 ? "hidden" : "block"}
            options={deliveryType}
            onClick={(e, close) => {
              setFilters({ ...filters, delivery_type: e });
              close();
            }}
            reset={() => {
              setFilters({ ...filters, delivery_type: null });
            }}
            value={filters.delivery_type}
            label={t("Сортировка доставки")}
            icon={<BranchesIcon />}
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
            <StyledTab label={tabLabel(t("branches"))} {...a11yProps(0)} />
            <StyledTab label={tabLabel(t("by_time"))} {...a11yProps(1)} />
          </StyledTabs>
        }
        className="m-4"
      >
        <TabPanel value={tabValue} index={0}>
          <BranchOrderReport tabValue={tabValue} filters={filters} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <BranchOrderTimeReport tabValue={tabValue} filters={filters} />
        </TabPanel>
      </Card>
    </>
  );
}

export default BranchReport;
