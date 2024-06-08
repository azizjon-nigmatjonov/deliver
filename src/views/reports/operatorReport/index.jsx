import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";
import Button from "components/Button";
import { DownloadIcon } from "constants/icons";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Card from "components/Card";
import TabPanel from "components/Tab/TabPanel";
import NewOrderOperator from "./NewOrderOperator";
import OrderOperator from "./OrderOperator";
import { useHistory } from "react-router-dom";
import parseQuery from "helpers/parseQuery";
import { customStyles } from "components/Select";
import { ExcelReport } from "services/excel";
import AsyncSelect from "components/Select/Async";
import { getOperators } from "services/operator";

function OperatorReport() {
  const { shipper_user_id } = JSON.parse(localStorage.getItem("persist:auth"));
  const history = useHistory();
  const { tab } = parseQuery();
  const [tabValue, setTabValue] = useState(+tab || 0);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    from_date: moment().format("YYYY-MM-DD"),
    to_date: moment().add(1, "days").format("YYYY-MM-DD"),
    start_date: moment().subtract(5, "days").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    operator_id: "",
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
  const downloadExcel = () => {
    if (tabValue === 0) {
      ExcelReport.order_operator({
        start_date: filters?.from_date + " " + "5:00:00",
        end_date: filters?.to_date + " " + "5:00:00",
      }).then((res) => downloadURI(res?.url, res?.file_name));
      function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.setAttribute("download", name);
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } else if (tabValue === 1) {
      ExcelReport.new_order_operator({
        from_date: filters?.start_date,
        to_date: filters?.end_date,
        operator_id: JSON.parse(shipper_user_id),
      }).then((res) => downloadURI(res?.url, res?.file_name));
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
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    history.push({
      pathname: "/home/reports/operator_report",
      search: `tab=${newValue}`,
    });
  };

  const loadOperators = useCallback((input, cb) => {
    getOperators({ page: 1, limit: 20, phone: input })
      .then((response) => {
        var operators = response?.shipper_users?.map((operator) => ({
          label: operator.name,
          value: operator.id,
        }));
        cb(operators);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Header title={t("operator_report_order")} />
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
        <div className="flex items-center">
          {tabValue === 1 && (
            <AsyncSelect
              id="operator"
              defaultOptions
              cacheOptions
              isSearchable
              isClearable
              className="mr-4"
              onChange={(elm) =>
                setFilters((prev) => ({ ...prev, operator_id: elm }))
              }
              value={filters.operator}
              loadOptions={loadOperators}
              placeholder={t("to.filter")}
              styles={customStyles({
                width: "230px",
                control: (base, state) => ({
                  ...base,
                  minHeight: "2rem",
                  height: "2rem",
                  border: "1px solid #E5E9EB",
                }),
                indicatorSeparator: (base, state) => ({
                  ...base,
                  height: "1rem",
                }),
              })}
            />
          )}
          <RangePicker
            defaultValue={[moment(filters.from_date), moment(filters.to_date)]}
            hideTimePicker
            placeholder={t("order.period")}
            className="ml-8"
            onChange={(e) => {
              e[0] === null
                ? setFilters((old) => ({
                    ...old,
                    from_date: moment().subtract(5, "d").format("YYYY-MM-DD"),
                    to_date: moment().format("YYYY-MM-DD"),
                    start_date: moment()
                      .subtract(5, "days")
                      .format("YYYY-MM-DD"),
                    end_date: moment().format("YYYY-MM-DD"),
                  }))
                : setFilters((old) => ({
                    ...old,
                    from_date: moment(e[0]).format("YYYY-MM-DD"),
                    to_date: moment(e[1]).format("YYYY-MM-DD"),
                    start_date: moment(e[0]).format("YYYY-MM-DD"),
                    end_date: moment(e[1]).format("YYYY-MM-DD"),
                  }));
            }}
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
              label={tabLabel(t("operators_report"))}
              {...a11yProps(0)}
            />
            <StyledTab
              label={tabLabel(t("operators_report_new"))}
              {...a11yProps(1)}
            />
          </StyledTabs>
        }
        className="m-4"
      >
        <TabPanel value={tabValue} index={0}>
          <OrderOperator filters={filters} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <NewOrderOperator filters={filters} />
        </TabPanel>
      </Card>
    </>
  );
}

export default OperatorReport;
