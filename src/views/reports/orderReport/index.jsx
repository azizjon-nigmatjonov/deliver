import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";
import Button from "components/Button";
import {
  BranchesIcon,
  DownloadIcon,
  PersonIcon,
  TypeDeliverIcon,
} from "constants/icons";
import FDropdown from "components/Filters/FDropdown";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Card from "components/Card";
import TabPanel from "components/Tab/TabPanel";
import { useHistory } from "react-router-dom";
import parseQuery from "helpers/parseQuery";
import requests from "services/branch";
import AllReport from "./AllReport";
import AllOrderReport from "./AllOrderReport";
import DeliveryChargeReport from "./DeliveryChargeReport";
import MapOrderReports from "./MapOrderReports";
import { getAggregators, getCouriersCount } from "services";
import { ExcelReport } from "services/excel";
import customerService from "services/customer";

function OrderReport() {
  const { shipper_id } = JSON.parse(localStorage.getItem("persist:auth"));
  const history = useHistory();
  const { tab } = parseQuery();
  const [tabValue, setTabValue] = useState(+tab || 0);
  const { t } = useTranslation();
  const [branches, setBranches] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [aggregators, setAggregators] = useState([]);
  const [source, setCourse] = useState([]);
  const [typeDeliver, setTypeDeliver] = useState([]);
  const [typePayment, setTypePayment] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [courierSearchValue, setCourierSearchValue] = useState("");

  const [dateValue, setDateValue] = useState({
    start_date: moment().format("YYYY-MM-DD"),
    end_date: moment().add(2, "days").format("YYYY-MM-DD"),
    custom_start_date: moment().format("YYYY-MM-DD"),
    custom_end_date: moment().add(1, "days").format("YYYY-MM-DD"),
  });
  const [filters, setFilters] = useState({
    from_date: moment().subtract(1, "days").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    custom_from_date: moment().format("YYYY-MM") + "-01",
    custom_to_date: moment().add(1, "days").format("YYYY-MM-DD"),
    branch_id: null,
    courier_id: null,
    aggregators: null,
    source: null,
    type_deliver: null,
    payment_type: null,
    customer_id: null,
  });
  const sourceData = [
    { label: t("admin_panel"), value: "admin_panel" },
    { label: t("bot"), value: "bot" },
    { label: t("app"), value: "app" },
    { label: t("website"), value: "website" },
  ];
  const deliveryTypeData = [
    { label: t("delivery"), value: "delivery" },
    { label: t("self_pickup"), value: "self-pickup" },
    { label: t("aggregator"), value: "aggregator" },
  ];
  const paymentMethodData = [
    { label: t("cash"), value: "cash" },
    { label: "Click", value: "click" },
    { label: "Payme", value: "payme" },
    { label: "Apelsin", value: "apelsin" },
    { label: t("transfer"), value: "transfer" },
  ];
  const handleFDDropdownBranch = (branch_id, close) => {
    setFilters({
      ...filters,
      branch_id,
    });
    close();
  };
  const handleFDDropdownAggregator = (aggregator, close) => {
    setFilters({
      ...filters,
      aggregators: aggregator,
    });
    close();
  };
  const clearRegion = () => {
    setFilters({
      ...filters,
      branch_id: null,
    });
  };
  const clearAggregator = () => {
    setFilters({
      ...filters,
      aggregators: null,
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
      pathname: "/home/reports/order_report",
      search: `tab=${newValue}`,
    });
  };

  useEffect(() => {
    getCouriersCount({ limit: 20, page: 1, search: courierSearchValue }).then(
      (res) =>
        setCouriers(
          res?.couriers
            ? res?.couriers?.map((courier) => ({
                label: `${courier?.first_name} ${courier?.last_name}`,
                value: courier.id,
              }))
            : [],
        ),
    );
  }, [courierSearchValue]);

  useEffect(() => {
    requests.getList({ limit: 100, page: 1 }).then((res) =>
      setBranches(
        res?.branches
          ? res?.branches.map((branch) => ({
              label: branch.name,
              value: branch.id,
            }))
          : [],
      ),
    );
    getAggregators({
      page: 1,
      limit: 100,
      shipper_id: JSON.parse(shipper_id),
    }).then((res) =>
      setAggregators(
        res?.aggregators
          ? res?.aggregators.map((aggregator) => ({
              label: aggregator?.name,
              value: aggregator?.id,
            }))
          : [],
      ),
    );
    customerService.getSMSCustomers({ limit: 20, page: 1 }).then((res) =>
      setCustomers(
        res?.customers
          ? res?.customers.map((customer) => ({
              label: customer?.name,
              value: customer?.id,
            }))
          : [],
      ),
    );

    setCourse(
      sourceData.map((item) => ({ label: item?.label, value: item?.value })),
    );
    setTypeDeliver(
      deliveryTypeData.map((item) => ({
        label: item?.label,
        value: item?.value,
      })),
    );
    setTypePayment(
      paymentMethodData.map((item) => ({
        label: item?.label,
        value: item?.value,
      })),
    );
  }, []);

  const downloadExcel = () => {
    if (tabValue === 0) {
      ExcelReport.interval_order_report({
        start_date: dateValue?.custom_start_date,
        end_date: dateValue?.custom_end_date,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => console.log("excel", e));
    } else if (tabValue === 1) {
      ExcelReport.order_report({
        start_date: filters?.from_date,
        end_date: filters?.to_date,
        source: filters?.source,
        aggregator_id: filters?.aggregators,
        payment_type: filters?.payment_type,
        delivery_type: filters?.type_deliver,
        courier_id: filters?.courier_id,
        branch_id: filters?.branch_id,
      }).catch((e) => console.log("excel", e));
    } else if (tabValue === 2) {
      ExcelReport.order_report_old({
        start_date: filters?.from_date,
        end_date: filters?.to_date,
        source: filters?.source,
        aggregator_id: filters?.aggregators,
        payment_type: filters?.payment_type,
        delivery_type: filters?.type_deliver,
        courier_id: filters?.courier_id,
        branch_id: filters?.branch_id,
      }).catch((e) => console.log("excel", e));
    } else if (tabValue === 3) {
      ExcelReport.order_report_with_delayed({
        start_date: filters?.from_date,
        end_date: filters?.to_date,
      }).catch((e) => console.log("excel", e));
    }
  };
  const handleDateClear = (e) => {
    setFilters((old) => ({
      ...old,
      from_date: moment().subtract(5, "d").format("YYYY-MM-DD"),
      to_date: moment().format("YYYY-MM-DD"),
      custom_from_date: moment().format("YYYY-MM-DD"),
      custom_to_date: moment().format("YYYY-MM-DD"),
    }));
    setDateValue((old) => ({
      ...old,
      start_date: moment().subtract(5, "d").format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD"),
      custom_start_date: moment().format("YYYY-MM-DD"),
    }));
  };
  const handleDateChange = (e) => {
    setFilters((old) => ({
      from_date: moment(e[0]).format("YYYY-MM-DD") + " 05:00:00",
      to_date: moment(e[1]).format("YYYY-MM-DD") + " 05:00:00",
      custom_from_date: moment(e[0]).format("YYYY-MM-DD") + " 05:00:00",
      custom_to_date: moment(e[1]).format("YYYY-MM-DD") + " 05:00:00",
    }));
    setDateValue((old) => ({
      start_date: moment(e[0]).format("YYYY-MM-DD") + " 05:00:00",
      end_date: moment(e[1]).format("YYYY-MM-DD") + " 05:00:00",
      custom_start_date: moment(e[0]).format("YYYY-MM-DD") + " 05:00:00",
      custom_end_date: moment(e[1]).format("YYYY-MM-DD") + " 05:00:00",
    }));
  };

  return (
    <>
      <Header title={t("order_report")} />
      <Filters
        className="mb-0"
        style={{ borderBottom: "none" }}
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
            onChange={(e) =>
              e[0] === null ? handleDateClear() : handleDateChange(e)
            }
          />
          <FDropdown
            className={
              tabValue === 0 || tabValue === 2 || tabValue === 3
                ? "hidden"
                : "block"
            }
            icon={<BranchesIcon />}
            options={branches}
            onClick={handleFDDropdownBranch}
            reset={clearRegion}
            value={filters.branch_id}
            label={"Филиал"}
          />
          <FDropdown
            className={
              tabValue === 0 || tabValue === 2 || tabValue === 3
                ? "hidden"
                : "block"
            }
            icon={<TypeDeliverIcon />}
            options={aggregators}
            onClick={handleFDDropdownAggregator}
            reset={clearAggregator}
            value={filters.aggregators}
            label={"Агрегаторы"}
          />
          <FDropdown
            className={
              tabValue === 0 || tabValue === 2 || tabValue === 3
                ? "hidden"
                : "block"
            }
            icon={<PersonIcon />}
            options={source}
            onClick={(source, close) => {
              setFilters({ ...filters, source });
              close();
            }}
            reset={() => setFilters({ ...filters, source: null })}
            value={filters.source}
            label={"Источник"}
          />
        </div>
      </Filters>
      <Filters
        style={{ border: "none" }}
        className={
          tabValue === 0 || tabValue === 2 || tabValue === 3
            ? "mb-0 hidden"
            : "mb-0 block"
        }
      >
        <div className="flex gap-4 items-center product_report">
          <FDropdown
            className={
              tabValue === 0 || tabValue === 2 || tabValue === 3
                ? "hidden"
                : "block"
            }
            icon={<TypeDeliverIcon />}
            options={typeDeliver}
            onClick={(type_deliver, close) => {
              setFilters({ ...filters, type_deliver });
              close();
            }}
            reset={() => setFilters({ ...filters, type_deliver: null })}
            value={filters.type_deliver}
            label={"Тип доставки"}
          />
          <FDropdown
            className={
              tabValue === 0 || tabValue === 2 || tabValue === 3
                ? "hidden"
                : "block"
            }
            icon={<PersonIcon />}
            options={couriers}
            onClick={(courierId, close) => {
              setFilters({ ...filters, courier_id: courierId });
              close();
            }}
            onChange={(e) => setCourierSearchValue(e.target.value)}
            reset={() => setFilters({ ...filters, courier_id: null })}
            value={filters.courier_id}
            label={"Курьеры"}
          />
          <FDropdown
            className={
              tabValue === 0 ||
              tabValue === 1 ||
              tabValue === 2 ||
              tabValue === 3
                ? "hidden"
                : "block"
            }
            icon={<PersonIcon />}
            options={customers}
            onClick={(customer, close) => {
              setFilters({ ...filters, customer_id: customer });
              close();
            }}
            reset={() => setFilters({ ...filters, customer_id: null })}
            value={filters.customer_id}
            label={"Клиенты"}
          />

          <FDropdown
            className={
              tabValue === 0 || tabValue === 3 || tabValue === 4
                ? "hidden"
                : "block"
            }
            icon={<TypeDeliverIcon />}
            options={typePayment}
            onClick={(paymentType, close) => {
              setFilters({ ...filters, payment_type: paymentType });
              close();
            }}
            reset={() => setFilters({ ...filters, payment_type: null })}
            value={filters.payment_type}
            label={"Способ оплаты"}
          />
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
            <StyledTab label={tabLabel(t("all_reporting"))} {...a11yProps(0)} />
            <StyledTab
              label={tabLabel(t("all_order_reports"))}
              {...a11yProps(1)}
            />

            <StyledTab
              label={tabLabel(t("map_order_reports"))}
              {...a11yProps(2)}
            />
            <StyledTab
              label={tabLabel(t("delivery_charge_report"))}
              {...a11yProps(3)}
            />
          </StyledTabs>
        }
        className="m-4"
      >
        <TabPanel value={tabValue} tabValue={tabValue} index={0}>
          <AllReport
            dateValue={dateValue}
            tabValue={tabValue}
            filters={filters}
          />
        </TabPanel>
        <TabPanel value={tabValue} tabValue={tabValue} index={1}>
          <AllOrderReport tabValue={tabValue} filters={filters} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <MapOrderReports
            dateValue={dateValue}
            filters={filters}
            tabValue={tabValue}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <DeliveryChargeReport tabValue={tabValue} filters={filters} />
        </TabPanel>
      </Card>
    </>
  );
}

export default OrderReport;
