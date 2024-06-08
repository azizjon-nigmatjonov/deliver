import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import CourierTable from "./CouriersTable";
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";
import Button from "components/Button";
import { DownloadIcon } from "constants/icons";
import FDropdown from "components/Filters/FDropdown";
import { getBranches, getCouriers } from "services";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Card from "components/Card";
import TabPanel from "components/Tab/TabPanel";
import ByDateTable from "./ByDateTable";
import ByCommentTable from "./ByCommentTable";
import { ExcelReport } from "services/excel";
import CourierTransaction from "./CourierTransaction";
import request from "utils/axios";

export default function Reports() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    from_date: moment().subtract(5, "d").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    search: "",
    branch_id: null,
  });
  const [couriers, setCouriers] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [request, setRequest] = useState({
    page: 1,
    limit: 10,
    order_by: "",
    sort: "",
  });

  useEffect(() => {
    fetchData();
    setFilters((prev) => ({
      from_date: prev.from_date,
      to_date: prev.to_date,
      search: "",
      branch_id: null,
    }));
  }, [tabValue]);

  const fetchData = async () => {
    if (tabValue === 0) {
      const { branches } = await getBranches({ limit: 20 });
      setSelectData(
        branches
          ? branches.map((elm) => ({ label: elm.name, value: elm.id }))
          : [],
      );
    } else if (tabValue === 1) {
      const { couriers } = await getCouriers({ limit: 30 });
      setCouriers(
        couriers
          ? couriers?.map((courier) => ({
              label: `${courier.first_name} ${courier.last_name}`,
              value: courier.id,
            }))
          : [],
      );
    } else {
      return null;
    }
  };

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

  const handleChange = (event, newValue) => setTabValue(newValue);
  const downloadExcel = () => {
    if (tabValue === 0) {
      ExcelReport.courier_report({
        from_date: filters?.from_date,
        to_date: filters?.to_date,
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
    } else if (tabValue === 1) {
      ExcelReport.courier_order_report({
        from_date: filters?.from_date,
        to_date: filters?.to_date,
        courier_id: filters?.branch_id,
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
    } else if (tabValue === 2) {
      ExcelReport.courier_review_report({
        from_date: filters?.from_date,
        to_date: filters?.to_date,
        order_by: request.order_by,
        sort: request.sort,
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
    } else if (tabValue === 3) {
      ExcelReport.courier_transaction_report({
        from_date: filters?.from_date,
        to_date: filters?.to_date,
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
      <Header title={t("reports.by.courier")} />
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
                    from_date: moment().subtract(5, "d").format("YYYY-MM-DD"),
                    to_date: moment().format("YYYY-MM-DD"),
                  }))
                : setFilters((old) => ({
                    ...old,
                    from_date: moment(e[0]).format("YYYY-MM-DD"),
                    to_date: moment(e[1]).format("YYYY-MM-DD"),
                  }));
            }}
          />
          {(tabValue === 0 || tabValue === 1) && (
            <FDropdown
              options={tabValue === 0 ? selectData : couriers}
              onClick={handleFDDropdown}
              reset={clearRegion}
              value={filters.branch_id}
              label={tabValue === 0 ? t("branch") : t("couriers")}
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
            <StyledTab
              label={tabLabel(t("couriers"))}
              {...a11yProps(0)}
              style={{ width: "110px" }}
            />
            <StyledTab
              label={tabLabel(t("by.date"))}
              {...a11yProps(1)}
              style={{ width: "90px" }}
            />
            <StyledTab
              label={tabLabel(t("by.comments"))}
              {...a11yProps(2)}
              style={{ width: "170px" }}
            />
            <StyledTab
              label={tabLabel(t("by.transactions"))}
              {...a11yProps(3)}
              style={{ width: "170px" }}
            />
          </StyledTabs>
        }
        className="m-4"
      >
        <TabPanel value={tabValue} index={0}>
          <CourierTable filters={filters} tabValue={tabValue} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ByDateTable
            filters={filters}
            tabValue={tabValue}
            couriers={couriers}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <ByCommentTable
            filters={filters}
            tabValue={tabValue}
            couriers={couriers}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <CourierTransaction
            filters={filters}
            request={request}
            setRequest={setRequest}
          />
        </TabPanel>
      </Card>
    </>
  );
}
