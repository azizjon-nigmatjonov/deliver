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
import parseQuery from "helpers/parseQuery";
import ByBranches from "./ByBranches";
import ByProducts from "./ByProducts";
import branchService from "services/branch";
import { getOperators } from "services/operator";
import { getExcelData, getExcelProductsByBranch } from "services/v2/excel";
import AsyncSelect from "components/Select/Async";

function ProductReport() {
  const { tab } = parseQuery();
  const [tabValue, setTabValue] = useState(+tab || 0);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    start_date: moment().subtract(1, "days").format("YYYY-MM-DD") + " 5:00:00",
    end_date: moment().format("YYYY-MM-DD") + " 5:00:00",
    branch_id: "",
    shipper_user_id: "",
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

  const handleChange = (event, newValue) => setTabValue(newValue);

  const downloadExcel = () => {
    !tabValue
      ? getExcelData({
          start_date: filters?.start_date,
          end_date: filters?.end_date,
          branch_id: filters?.branch_id?.value,
          shipper_user_id: tabValue ? filters.shipper_user_id?.value : "",
        })
          .then((res) => downloadURI(res?.url, res?.file_name))
          .catch((e) => console.log("excel", e))
      : getExcelProductsByBranch({
          start_date: filters?.start_date,
          end_date: filters?.end_date,
        })
          .then((res) => downloadURI(res?.url, res?.file_name))
          .catch((e) => console.log("excel", e));
  };

  const downloadURI = useCallback((uri, name) => {
    var link = document.createElement("a");
    link.setAttribute("download", name);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  const loadShipperUsers = useCallback((inputValue, callback) => {
    getOperators({ limit: 20, search: inputValue })
      .then((res) => {
        let shipper_users = res?.shipper_users?.map((user) => ({
          label: user.name,
          value: user.id,
        }));
        callback(shipper_users);
      })
      .catch((err) => console.log(err));
  }, []);

  const loadBranches = useCallback((inputValue, callback) => {
    branchService
      .getList({ limit: 20, search: inputValue })
      .then((res) => {
        let branches = res?.branches?.map((branch) => ({
          label: branch.name,
          value: branch.id,
        }));
        callback(branches);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Header title={t("product_report")} />
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
          <RangePicker
            hideTimePicker
            placeholder={t("order.period")}
            onChange={(e) => {
              e[0] === null
                ? setFilters((old) => ({
                    ...old,
                    start_date:
                      moment().subtract(1, "d").format("YYYY-MM-DD") +
                      " " +
                      "5:00:00",
                    end_date: moment().format("YYYY-MM-DD") + " 5:00:00",
                  }))
                : setFilters((old) => {
                    return {
                      ...old,
                      start_date:
                        moment(e[0]).format("YYYY-MM-DD") + " 5:00:00",
                      end_date: moment(e[1]).format("YYYY-MM-DD") + " 5:00:00",
                    };
                  });
            }}
          />
          {tabValue === 1 && (
            <AsyncSelect
              loadOptions={loadShipperUsers}
              defaultOptions
              isClearable
              value={filters.shipper_user_id}
              placeholder={t("operator")}
              onChange={(val) =>
                setFilters({ ...filters, shipper_user_id: val })
              }
            />
          )}
          {!tabValue && (
            <AsyncSelect
              loadOptions={loadBranches}
              defaultOptions
              isClearable
              value={filters.branch_id}
              placeholder={t("branches")}
              onChange={(val) => setFilters({ ...filters, branch_id: val })}
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
            <StyledTab label={tabLabel(t("on_products"))} {...a11yProps(0)} />
            <StyledTab label={tabLabel(t("on_branches"))} {...a11yProps(1)} />
          </StyledTabs>
        }
        className="m-4"
      >
        <TabPanel value={tabValue} index={0}>
          <ByProducts tabValue={tabValue} filters={filters} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ByBranches tabValue={tabValue} filters={filters} />
        </TabPanel>
      </Card>
    </>
  );
}

export default ProductReport;
