import {
  SET_EXTERNAL_ORDER_ID,
  SET_DATE_RANGE,
  SET_CUSTOMER_FILTER,
  CLEAR_FILTERS_DATA,
  SET_TAB_ID,
  OPEN_FILTERS,
  SET_BRANCHES,
  SET_COURIER_ID,
  SET_STATUSES,
  SET_DELIVERY_TYPE,
  SET_PAYMENT_METHOD,
} from "../constants";
import moment from "moment";

const CURRENT_DAY = moment().format("YYYY-MM-DD") + " 05:00:00";
const ONE_DAY_BEFORE =
  moment().subtract(1, "d").format("YYYY-MM-DD") + " 05:00:00";
const CURRENT_HOUR = moment().hour();

const INITIAL_STATE = {
  external_order_id: "",
  tab: "986a0d09-7b4d-4ca9-8567-aa1c6d770505",
  dateRange: {
    start_date: CURRENT_HOUR < 5 ? ONE_DAY_BEFORE : CURRENT_DAY,
    end_date:
      CURRENT_HOUR < 5
        ? CURRENT_DAY
        : moment().add(1, "d").format("YYYY-MM-DD") + " 05:00:00",
  },
  customer_id: "",
  is_open: false,
  branches: null,
  courier_id: null,
  statuses: null,
  delivery_type: null,
  payment_method: null,
};

export default function filtersReducer(
  state = INITIAL_STATE,
  { payload, type },
) {
  switch (type) {
    case SET_EXTERNAL_ORDER_ID:
      return {
        ...state,
        external_order_id: payload,
      };
    case SET_DATE_RANGE:
      return {
        ...state,
        dateRange: payload,
      };
    case SET_CUSTOMER_FILTER:
      return {
        ...state,
        customer_id: payload,
      };
    case SET_TAB_ID:
      return {
        ...state,
        tab: payload,
      };
    case OPEN_FILTERS:
      return {
        ...state,
        is_open: payload,
      };
    case SET_BRANCHES:
      return {
        ...state,
        branches: payload,
      };
    case SET_COURIER_ID:
      return {
        ...state,
        courier_id: payload,
      };
    case SET_STATUSES:
      return {
        ...state,
        statuses: payload,
      };
    case SET_DELIVERY_TYPE:
      return {
        ...state,
        delivery_type: payload,
      };
    case SET_PAYMENT_METHOD:
      return {
        ...state,
        payment_method: payload,
      };
    case CLEAR_FILTERS_DATA:
      return {
        ...state,
        payload: INITIAL_STATE,
      };
    default:
      return state;
  }
}
