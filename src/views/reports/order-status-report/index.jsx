import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import moment from "moment";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Card from "components/Card";
import TabPanel from "components/Tab/TabPanel";
import parseQuery from "helpers/parseQuery";
import AllReport from "./AllReport";
import DatePicker from "components/DatePicker";
import Async from "components/Select/Async";
import { getBranches } from "services";

function OrderStatusReport() {
  const { tab } = parseQuery();
  const [tabValue, setTabValue] = useState(+tab || 0);
  const { t } = useTranslation();
  const [multiBranchId, setMultiBranchId] = useState([]);

  const [filters, setFilters] = useState({
    start_date: moment().subtract(1, "days").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
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
  };

  const handleDateClear = (e) => {
    setFilters((old) => ({
      ...old,
      start_date: moment().format("YYYY-MM-DD"),
      end_date: moment().add(1, "days").format("YYYY-MM-DD"),
    }));
  };
  const handleDateChange = (e) => {
    setFilters((old) => ({
      ...old,
      start_date: moment(e).format("YYYY-MM-DD"),
      end_date: moment(e).add(1, "days").format("YYYY-MM-DD"),
    }));
  };

  const loadBranch = useCallback((input, cb) => {
    getBranches({ limit: 10, search: input })
      .then((res) => {
        var data = res?.branches?.map((branch) => ({
          label: branch.name,
          value: branch.id,
        }));
        cb(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChangeBranchId = (branch_id) => {
    setMultiBranchId(branch_id);
    var result = getFields(branch_id, "value"); // returns [ 1, 3, 5 ]
    function getFields(input, field) {
      var output = [];
      for (var i = 0; i < input.length; ++i) output.push(input[i][field]);
      return output;
    }
    setFilters((prev) => ({ ...prev, branch_id: result.join(",") }));
  };

  return (
    <>
      <Header title={t("order_status_report")} />
      <Filters className="mb-0" style={{ borderBottom: "none" }}>
        <div className="flex gap-4 items-center product_report">
          <div>
            <DatePicker
              style={{ width: 250 }}
              hideTimePicker
              placeholder={t("enter.date")}
              // defaultValue={[filters.start_date, filters.end_date]}
              onChange={(e) =>
                e[0] === null ? handleDateClear() : handleDateChange(e)
              }
              hideTimeBlock
            />
          </div>
          <div style={{ minWidth: 300 }}>
            <Async
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  minHeight: "36px",
                  height: "36px",
                }),
              }}
              style={{ height: "30" }}
              isSearchable
              isClearable
              cacheOptions
              isMulti
              name="product"
              defaultOptions={true}
              loadOptions={loadBranch}
              value={multiBranchId}
              onChange={handleChangeBranchId}
            />
          </div>
        </div>
      </Filters>
      <Card
        title={
          <StyledTabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="primary"
            centered={false}
            aria-label="full width tabs example"
          >
            <StyledTab label={tabLabel(t("day_report"))} {...a11yProps(0)} />
          </StyledTabs>
        }
        className="m-4"
      >
        <TabPanel value={tabValue} tabValue={tabValue} index={0}>
          <AllReport tabValue={tabValue} filters={filters} />
        </TabPanel>
      </Card>
    </>
  );
}

export default OrderStatusReport;
