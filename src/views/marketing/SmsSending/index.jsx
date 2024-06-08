import { useState, useReducer } from "react";
import Pagination from "components/Pagination";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import { Input } from "alisa-ui";
import Header from "components/Header";
import Filters from "components/Filters";
import SendIcon from "@mui/icons-material/Send";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import SwipeableViews from "react-swipeable-views";
import Clients from "./Clients";
import Couriers from "./Couriers";
import { useTheme } from "@mui/material";
import RangePicker from "components/DatePicker/RangePicker";
import { SendSmsToUsers } from "services/send-sms";
import moment from "moment";
import Search from "components/Search";
import Message from "./Messages";
import Button from "components/Button/Buttonv2";
import Modal from "components/ModalV2";

const initialStates = {
  end_count: "",
  end_date: "",
  end_price: "",
  start_count: "",
  start_date: "",
  start_price: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "DATE_TIME":
      return {
        ...state,
        start_date: action.payload[0]
          ? moment(action.payload[0]).format("DD.MM.YYYY")
          : "",
        end_date: action.payload[1]
          ? moment(action.payload[1]).format("DD.MM.YYYY")
          : "",
      };
    case "START_PRICE":
      return { ...state, start_price: action.payload };
    case "END_PRICE":
      return { ...state, end_price: action.payload };
    case "START_COUNT":
      return { ...state, start_count: action.payload };
    case "END_COUNT":
      return { ...state, end_count: action.payload };
    case "CLEAR":
      return initialStates;
    default:
      return state;
  }
};

export default function SmsSending() {
  const [formData, setFormData] = useState({
    phone_numbers: [],
    text: "",
    to_all: false,
    user_type: "",
  });
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(true);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isMessageModal, setMessageModal] = useState(false);
  const [value, setValue] = useState(0);
  const [customers, setCustomers] = useState({});
  const [couriers, setCouriers] = useState({});

  const theme = useTheme();
  const { t } = useTranslation();
  let debounce = setTimeout(() => {}, 0);
  const [state, dispatch] = useReducer(reducer, initialStates);

  const onDebouncedChange = (type, value) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      dispatch({ type, payload: value });
    }, 300);
  };

  const onSubmit = () => {
    setDisabledBtn(true);
    SendSmsToUsers(
      formData.to_all
        ? {
            ...state,
            text: message,
            to_all: true,
            user_type: value === 0 ? "customer" : "courier",
          }
        : {
            text: message,
            phone_numbers: formData.phone_numbers,
            to_all: false,
            user_type: value === 0 ? "customer" : "courier",
          },
    )
      .then(() => setMessage(""))
      .finally(() => {
        setMessageModal(false);
        setDisabledBtn(false);
      });
  };

  const handleChange = (event, newValue) => {
    setFormData({
      phone_numbers: [],
      text: "",
      to_all: false,
      user_type: "",
    });
    dispatch({ type: "CLEAR" });
    setValue(newValue);
  };

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  return (
    <>
      <Header
        title={t("sms_sending")}
        endAdornment={
          <Button
            variant="contained"
            disabled={!(formData.to_all || formData?.phone_numbers?.length > 0)}
            endIcon={<SendIcon />}
            onClick={() => setMessageModal(true)}
          >
            {t("send.sms")}
          </Button>
        }
      />
      <Filters>
        <div className="flex gap-4 items-center">
          <Search setSearch={(value) => setSearch(value)} width={250} />
          {value === 2 && (
            <RangePicker
              hideTimePicker
              placeholder={t("from.date.to.date")}
              onChange={(e) => {
                dispatch({ type: "DATE_TIME", payload: e });
              }}
            />
          )}
          {value === 0 && (
            <>
              <RangePicker
                hideTimePicker
                placeholder={t("from.date.to.date")}
                onChange={(e) => {
                  console.log(e);
                  dispatch({ type: "DATE_TIME", payload: e });
                }}
              />
              <Input
                type="number"
                onChange={(e) =>
                  onDebouncedChange("START_COUNT", e.target.value)
                }
                width={120}
                placeholder={t("from.count")}
                size="middle"
              />
              <Input
                type="number"
                onChange={(e) => onDebouncedChange("END_COUNT", e.target.value)}
                width={120}
                placeholder={t("to.count")}
                size="middle"
              />
              <Input
                onChange={(e) =>
                  onDebouncedChange("START_PRICE", e.target.value)
                }
                width={120}
                placeholder={t("from.price")}
                size="middle"
                type="number"
              />
              <Input
                onChange={(e) => onDebouncedChange("END_PRICE", e.target.value)}
                width={120}
                placeholder={t("to.price")}
                size="middle"
                type="number"
              />
            </>
          )}
        </div>
      </Filters>
      <Card
        className="m-4"
        footer={
          <Pagination
            title={t("general.count")}
            count={value === 1 ? couriers?.count : customers.count}
            onChange={(pageNumber) => setCurrentPage(pageNumber)}
            pageCount={limit}
            onChangeLimit={(limitNumber) => setLimit(limitNumber)}
            limit={limit}
          />
        }
      >
        <Header
          startAdornment={
            <StyledTabs
              value={value}
              onChange={handleChange}
              centered={false}
              aria-label="full width tabs example"
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
              <StyledTab
                label={tabLabel(t("history.sms"))}
                {...a11yProps(2)}
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
            <Clients
              currentPage={currentPage}
              limit={limit}
              search={search}
              customers={customers}
              setCustomers={setCustomers}
              loader={loader}
              setLoader={setLoader}
              value={value}
              items={formData}
              setItems={setFormData}
              state={state}
            />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Couriers
              currentPage={currentPage}
              limit={limit}
              search={search}
              couriers={couriers}
              setCouriers={setCouriers}
              loader={loader}
              setLoader={setLoader}
              value={value}
              items={formData}
              setItems={setFormData}
            />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Message
              currentPage={currentPage}
              limit={limit}
              search={search}
              customers={customers}
              setCustomers={setCustomers}
              loader={loader}
              setLoader={setLoader}
              value={value}
              items={formData}
              setItems={setFormData}
              state={state}
            />
          </TabPanel>
        </SwipeableViews>
      </Card>
      <Modal
        open={isMessageModal}
        title={t("send.sms")}
        fullWidth={true}
        onClose={() => setMessageModal(false)}
      >
        <textarea
          value={message}
          className="w-full border border-lightgray-1 rounded px-4 pt-2 pb-12 mb-4"
          placeholder={t("write.your.message.here")}
          style={{ paddingBottom: "70px" }}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={onSubmit}
          disabled={!message || disabledBtn}
        >
          {t("send")}
        </Button>
      </Modal>
    </>
  );
}
