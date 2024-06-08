import React, { useCallback } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RangePicker from "components/DateTimePicker/RangePicker";
import moment from "moment";
import AsyncSelect from "components/Select/Async";
import Select, { customStyles } from "components/Select";
import { getBranches, getCouriers } from "services";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_BRANCHES,
  SET_COURIER_ID,
  SET_CUSTOMER_FILTER,
  SET_DATE_RANGE,
  SET_DELIVERY_TYPE,
  SET_EXTERNAL_ORDER_ID,
  SET_PAYMENT_METHOD,
  SET_STATUSES,
} from "redux/constants";
import { filterStatus, payment_types } from "./statuses";
import SuperInput from "components/SuperInput";
import { useTranslation } from "react-i18next";
import customerService from "services/customer";

const OrderFilters = ({ inputRef }) => {
  const { t } = useTranslation();
  const {
    branches,
    external_order_id,
    statuses,
    dateRange,
    courier_id,
    customer_id,
    delivery_type,
    payment_method,
    is_open,
  } = useSelector((state) => state.orderFilters);
  const dispatch = useDispatch();

  const loadCustomers = useCallback((input, cb) => {
    customerService
      .searchbyPhone({ page: 1, limit: 10, phone: input })
      .then((response) => {
        let aggregatorsRes = response?.customers?.map((customer) => ({
          label: `${customer.name} (${customer.phone})`,
          value: customer.id,
          phone: customer.phone,
        }));
        cb(aggregatorsRes);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadBranches = useCallback((input, cb) => {
    getBranches({ page: 1, limit: 10, search: input })
      .then((response) => {
        let branches = response?.branches?.map((branch) => ({
          label: branch.name,
          value: branch.id,
        }));
        cb(branches);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadCouriers = useCallback((input, cb) => {
    getCouriers({ page: 1, limit: 10, search: input })
      .then((response) => {
        let couriers = response?.couriers?.map((courier) => ({
          label: `${courier.first_name} ${courier.last_name} (${courier.phone})`,
          value: courier.id,
        }));
        cb(couriers);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleRangeChange = useCallback(
    (e) => {
      if (e[0] === null) {
        const CURRENT_DAY = moment().format("YYYY-MM-DD") + " 05:00:00";
        const ONE_DAY_BEFORE =
          moment().subtract(1, "d").format("YYYY-MM-DD") + " 05:00:00";
        const CURRENT_HOUR = moment().hour();

        dispatch({
          type: SET_DATE_RANGE,
          payload: {
            start_date: CURRENT_HOUR < 5 ? ONE_DAY_BEFORE : CURRENT_DAY,
            end_date:
              CURRENT_HOUR < 5
                ? CURRENT_DAY
                : moment().add(1, "d").format("YYYY-MM-DD") + " 05:00:00",
          },
        });
      } else {
        dispatch({
          type: SET_DATE_RANGE,
          payload: {
            start_date: moment(e[0]).format("YYYY-MM-DD") + " 05:00:00",
            end_date: moment(e[1]).format("YYYY-MM-DD") + " 05:00:00",
          },
        });
      }
    },
    [dispatch],
  );

  const deliveryOptions = [
    {
      label: t("delivery"),
      value: "delivery",
    },
    {
      label: t("pickup"),
      value: "self-pickup",
    },
    {
      label: t("hall"),
      value: "hall",
    },
    {
      label: t("external"),
      value: "external",
    },
  ];

  return (
    <div
      style={{
        maxHeight: is_open ? "117px" : "0px",
        overflow: is_open ? "visible" : "hidden",
        transition: "150ms ease",
      }}
      className="mb-4"
    >
      {/* border border-lighgray-1 p-4 rounded-md */}
      <div className="flex w-full justify-between">
        <AsyncSelect
          id="customer"
          className="w-1/4 mr-4"
          minWidth="none"
          defaultOptions
          cacheOptions
          isSearchable
          isClearable
          onChange={(elm) => {
            dispatch({
              type: SET_CUSTOMER_FILTER,
              payload: elm,
            });
          }}
          value={customer_id}
          loadOptions={loadCustomers}
          placeholder={t("search_phone_number")}
          styles={customStyles({
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
        <AsyncSelect
          id="branch"
          className="w-1/4 mr-4"
          minWidth="none"
          defaultOptions
          cacheOptions
          isSearchable
          isMulti
          isClearable
          onChange={(elm) => {
            dispatch({
              type: SET_BRANCHES,
              payload: [...elm],
            });
          }}
          value={branches}
          loadOptions={loadBranches}
          placeholder={t("select.branch")}
          styles={customStyles({
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
            showClearIcons: true,
          })}
        />
        <AsyncSelect
          id="courier"
          className="w-1/4 mr-4"
          minWidth="none"
          defaultOptions
          cacheOptions
          isSearchable
          isClearable
          onChange={(elm) => {
            dispatch({
              type: SET_COURIER_ID,
              payload: elm,
            });
          }}
          value={courier_id}
          loadOptions={loadCouriers}
          placeholder={t("choose.courier")}
          styles={customStyles({
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
            showClearIcons: true,
          })}
        />
        <Select
          className="w-1/4"
          isMulti
          isSearchable
          isClearable
          cacheOptions
          value={statuses}
          options={filterStatus}
          onChange={(val) =>
            dispatch({
              type: SET_STATUSES,
              payload: val,
            })
          }
          placeholder={t("choose.status")}
        />
      </div>
      <div className="flex w-full justify-between mt-4">
        <SuperInput
          isValidateNumber
          onChange={({ target: { value } }) => {
            dispatch({
              type: SET_EXTERNAL_ORDER_ID,
              payload: value,
            });
          }}
          className="w-1/4 mr-4"
          placeholder={t("order_id_search")}
          value={external_order_id}
          addonBefore={
            <SearchIcon
              style={{ fill: "var(--primary-color)", marginRight: "8px" }}
            />
          }
        />
        <RangePicker
          inputRef={inputRef}
          className="w-1/4 mr-4"
          dateValue={[
            dateRange?.start_date ? moment(dateRange?.start_date) : undefined,
            dateRange?.end_date ? moment(dateRange?.end_date) : undefined,
          ]}
          hideTimePicker
          placeholder={t("order.period")}
          onChange={handleRangeChange}
        />
        <Select
          className="w-1/4 mr-4"
          isSearchable
          isClearable
          cacheOptions
          value={delivery_type}
          options={deliveryOptions}
          onChange={(val) => {
            dispatch({
              type: SET_DELIVERY_TYPE,
              payload: val,
            });
          }}
          placeholder={t("order.type")}
        />
        <Select
          className="w-1/4"
          isClearable
          cacheOptions
          value={payment_method}
          options={payment_types}
          onChange={(val) => {
            dispatch({
              type: SET_PAYMENT_METHOD,
              payload: val,
            });
          }}
          placeholder={t("payment.type")}
        />
      </div>
    </div>
  );
};

export default OrderFilters;
