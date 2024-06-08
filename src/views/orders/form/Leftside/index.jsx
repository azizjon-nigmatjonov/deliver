import { useState, useCallback, useEffect, useMemo, memo } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import ReactInputMask from "react-input-mask";
import AsyncSelect from "components/Select/Async";
import Card from "components/Card";
import Form from "components/Form/Index";
import Select from "components/Select";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import HistoryIcon from "@mui/icons-material/History";
import Checkbox from "components/Checkbox/Checkbox";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";

import {
  FormControl,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  RadioGroup,
} from "@mui/material";
import DatePicker from "components/DatePicker";
import moment from "moment";
import { getSourceIcon } from "../api";
import {
  getBranches,
  getCouriers,
  getFares,
  getShipper,
  getCouriersByBranch,
  useAggregators,
  getCourierTypes,
  useCustomerById,
} from "services";
import TimePicker from "components/TimePicker";
import { useSelector } from "react-redux";
import OrderHistory from "./ClientOrderHistory";
import parseQuery from "helpers/parseQuery";
import CustomersDropdown from "./CustomersDropdown";
import EditIcon from "@mui/icons-material/Edit";
import { CloseRounded } from "@mui/icons-material";
import { TruckIcon } from "constants/icons";
import CommentHistory from "./CommentHistory";
import copyIcon from "assets/icons/copy_icon.svg";
import useDebounce from "hooks/useDebounce";
import styles from "./styles.module.scss";
import Modal from "components/ModalV2";
import Button from "components/Button/Buttonv2";
import AddressSearch from "./AddressSearch";
import customerService from "services/customer";

function LeftSide({
  formik,
  distance,
  mapGeometry,
  branchOption,
  handleUserLogs,
  setMapGeometry,
  isOrderEditable,
  setIsCourierCall,
  placemarkGeometry,
  setPlacemarkGeometry,
}) {
  const [futureTime, setFutureTime] = useState(0);
  const [clientFocus, setClientFocus] = useState(false);
  const [clientAddressess, setClientAddressess] = useState([]);
  const [isTodaySelected, setIsTodaySelected] = useState(false);
  const [aggregatorChosen, setAggregatorChosen] = useState(false);
  const [openOrderHistoryModal, setOpenOrderHistoryModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);

  const { values, handleChange, setFieldValue } = formik;
  const debouncedPhoneNumber = useDebounce(values?.client_phone_number, 700);
  let currentDate = moment().format("YYYY-MM-DD");
  let momentFutureTime = moment(values?.future_time).format("YYYY-MM-DD");

  const { t } = useTranslation();
  const { shipper_id } = useSelector((state) => state.auth);
  const { newUserNumber, customerId } = parseQuery();
  const dispatch = useDispatch();

  const DELIVERY_TYPES = [
    { value: "delivery", label: t("delivery") },
    { value: "self-pickup", label: t("self-pickup") },
    { value: "hall", label: t("hall") },
    { value: "external", label: t("external") },
  ];

  const { aggregatorsQuery } = useAggregators({
    aggregatorsParams: {
      page: 1,
      limit: 10,
    },
    aggregatorsProps: {
      enabled: true,
    },
  });

  useCustomerById({
    id: customerId,
    props: {
      enabled: Boolean(customerId && customerId !== "undefined"),
      onSuccess: (data) => {
        setFieldValue("client_phone_number", data?.phone);
        setFieldValue("client_name", data?.name);
        setFieldValue("client_id", customerId);
      },
    },
  });

  // Clear customer details when phone number is changed
  useEffect(() => {
    if (
      values?.client_phone_number?.length < 13 &&
      (values?.aggregator_id || values?.client_id || values?.client_name)
    ) {
      setFieldValue("aggregator_id", "");
      setFieldValue("client_id", "");
      setFieldValue("client_name", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFieldValue, values?.client_phone_number?.length]);

  useEffect(() => {
    getShipper(shipper_id).then((res) => {
      setFutureTime(res?.future_order_time);
    });
  }, [shipper_id]);

  useEffect(() => {
    setIsTodaySelected(momentFutureTime === currentDate);
  }, [values?.future_time, momentFutureTime, currentDate]);

  useEffect(() => {
    if (newUserNumber && newUserNumber !== undefined) {
      setClientFocus(true);
      setFieldValue("client_phone_number", `+${newUserNumber}`);
    }
  }, [newUserNumber, setFieldValue]);

  useEffect(() => {
    if (values?.aggregator_id?.phone) {
      customerService
        .searchbyPhone({ phone: values?.aggregator_id?.phone })
        .then((res) => {
          setFieldValue("client_name", res?.customers[0]?.name);
          setFieldValue("client_id", res?.customers[0]?.id);
          setFieldValue("client_phone_number", res?.customers[0]?.phone);
          setFieldValue("delivery_type", "self-pickup");
        });
    }
  }, [values?.aggregator_id, setFieldValue]);

  useEffect(() => {
    if (
      debouncedPhoneNumber.replace(/(\+998)/g, "") &&
      !values?.aggregator_id &&
      isOrderEditable
    )
      customerService
        .searchbyPhone({ limit: 5, phone: debouncedPhoneNumber })
        .then((res) => setClientAddressess(res.customers))
        .catch((err) => console.log(err));
  }, [debouncedPhoneNumber, values?.aggregator_id, isOrderEditable]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    dispatch(showAlert(t("successfully_copied"), "success"));
  };

  const onPhoneChange = (e, extra) => {
    let value = e.target.value.split(" ").join("");
    if (extra) setFieldValue("extra_phone_number", value);
    else setFieldValue("client_phone_number", value);
  };

  const onAggregatorChange = (value) => {
    setFieldValue("aggregator_id", value);
    setAggregatorChosen(true);
    setFieldValue("client_phone_number", value.phone);
  };

  const aggregatorOptions = useMemo(() => {
    return aggregatorsQuery?.isSuccess
      ? aggregatorsQuery?.data?.aggregators?.map((aggregator) => ({
          label: aggregator?.name,
          value: aggregator?.id,
          phone: aggregator?.phone_number,
        }))
      : [];
  }, [aggregatorsQuery]);

  const loadBranches = useCallback((input, cb) => {
    getBranches({ limit: 20, search: input })
      .then((res) => {
        let branches = res?.branches?.map((branch) => ({
          label: `${branch.name} (${branch.real_time_orders_amount})`,
          value: branch.id,
          elm: branch,
        }));
        cb(branches);
      })
      .catch((err) => console.log(err));
  }, []);

  const loadCouriers = useCallback(
    (inputValue, callback) => {
      if (values?.branch?.value) {
        getCouriersByBranch(values?.branch?.value, {
          limit: 20,
          search: inputValue,
          courier_type_id: values?.courier_type?.value,
        })
          .then((res) => {
            let couriers = res?.couriers?.map((courier) => ({
              label: `${courier.first_name} ${courier.last_name} (${courier.total_orders_count})`,
              value: courier.id,
            }));
            callback(couriers);
          })
          .catch((err) => console.log(err));
      } else {
        getCouriers({
          limit: 20,
          search: inputValue,
          courier_type_id: values?.courier_type?.value,
        })
          .then((res) => {
            let couriers = res?.couriers?.map((courier) => ({
              label: `${courier.first_name} ${courier.last_name}`,
              value: courier.id,
            }));
            callback(couriers);
          })
          .catch((err) => console.log(err));
      }
    },
    [values?.courier_type, values?.branch?.value],
  );

  const loadFares = useCallback((input, cb) => {
    getFares({ limit: 20, search: input })
      .then((res) => {
        let fares = res?.fares?.map((fare) => ({
          label: fare.name,
          value: fare.id,
          elm: fare,
        }));
        cb(fares);
      })
      .catch((err) => console.log(err));
  }, []);

  const loadCourierTypes = useCallback((inputValue, callback) => {
    getCourierTypes({ page: 1, limit: 20, search: inputValue })
      .then((res) => {
        let courier_type = res?.courier_type?.map((fare) => ({
          label: fare.name,
          value: fare.id,
        }));
        callback(courier_type);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Card
            title={t("client")}
            className="h-full"
            extra={
              <img
                src={getSourceIcon(values.source)}
                alt="source"
                className="w-5 h-5"
              />
            }
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 w-full">
                <Aggregators
                  onClick={onAggregatorChange}
                  options={aggregatorOptions}
                  title={t("aggregators")}
                />
                <div className="flex-1">
                  <Form.Item formik={formik} name="client_name">
                    <div className="flex items-center pr-3 border rounded-md flex-1">
                      <input
                        onChange={handleChange}
                        value={values.client_name}
                        disabled={aggregatorChosen}
                        id="client_name"
                        placeholder={t("client_name")}
                        className="w-full py-1 px-2 focus:outline-none outline-none border-none"
                      />
                      {(values?.aggregator_id || values?.client_name) && (
                        <CloseRounded
                          color="disabled"
                          className="cursor-pointer"
                          fontSize="small"
                          onClick={() => {
                            setFieldValue("aggregator_id", "");
                            setFieldValue("client_name", "");
                            setFieldValue("client_phone_number", "");
                            setAggregatorChosen(false);
                            handleUserLogs({
                              name: "Агрегатор",
                            });
                          }}
                        />
                      )}
                    </div>
                  </Form.Item>
                </div>
                {values?.client_id && (
                  <IconButton
                    sx={{
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: 1.5,
                    }}
                    size="small"
                    color="primary"
                    onClick={() => setIsEditModal(true)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
              <div className="flex flex-wrap gap-2 w-full">
                <IconButton
                  size="small"
                  title={t("orders.history")}
                  disabled={!values?.client_id}
                  color="primary"
                  onClick={() => setOpenOrderHistoryModal(true)}
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    borderRadius: 1.5,
                  }}
                >
                  <HistoryIcon
                    color={values?.client_id ? "inherit" : "disabled"}
                    fontSize="small"
                  />
                </IconButton>
                <div className="flex-1">
                  <Form.Item formik={formik} name="client_phone_number">
                    <OutsideClickHandler
                      onOutsideClick={() => setClientFocus(false)}
                    >
                      <ReactInputMask
                        disabled={aggregatorChosen || !isOrderEditable}
                        id="client_phone_number"
                        maskplaceholder={t("number_no", { no: 1 })}
                        value={values.client_phone_number}
                        mask="+\9\98 99 999 99 99"
                        onFocus={() => setClientFocus(true)}
                        onChange={onPhoneChange}
                        maskChar={null}
                      >
                        {(inputProps) => (
                          <div className="flex items-center border rounded-md pr-3">
                            <input
                              {...inputProps}
                              placeholder={t("number_no", { no: 1 })}
                              onChange={handleChange}
                              disabled={aggregatorChosen || !isOrderEditable}
                              style={{ border: "none" }}
                              title={t("number_no", { no: 1 })}
                              className="py-1 px-2 focus:outline-none outline-none border-none"
                              autoFocus
                            />
                            <img
                              src={copyIcon}
                              title={t("copy")}
                              alt="copy"
                              className="cursor-pointer w-5 h-5"
                              onClick={() =>
                                handleCopy(values?.client_phone_number)
                              }
                            />
                          </div>
                        )}
                      </ReactInputMask>
                      {clientAddressess?.length > 0 && clientFocus && (
                        <CustomersDropdown
                          clientAddressess={clientAddressess}
                          setClientFocus={setClientFocus}
                          handleUserLogs={handleUserLogs}
                          setFieldValue={setFieldValue}
                        />
                      )}
                    </OutsideClickHandler>
                  </Form.Item>
                </div>
                <div className="flex-1">
                  <Form.Item formik={formik} name="extra_phone_number">
                    <ReactInputMask
                      disabled={aggregatorChosen || !isOrderEditable}
                      id="extra_phone_number"
                      maskplaceholder={t("number_no", { no: 2 })}
                      value={values.extra_phone_number}
                      mask="+\9\98 99 999 99 99"
                      maskChar={null}
                      onChange={(e) => {
                        onPhoneChange(e, true);
                        handleUserLogs({
                          name: "Доп тел номер клиента",
                        });
                      }}
                    >
                      {(inputProps) => (
                        <div className="flex items-center border rounded-md pr-3">
                          <input
                            {...inputProps}
                            placeholder={t("number_no", { no: 2 })}
                            disabled={aggregatorChosen || !isOrderEditable}
                            style={{ border: "none" }}
                            title={t("number_no", { no: 2 })}
                            className="py-1 px-2 focus:outline-none outline-none border-none"
                          />
                          <img
                            src={copyIcon}
                            alt="copy"
                            title={t("copy")}
                            className="cursor-pointer w-5 h-5"
                            onClick={() =>
                              handleCopy(values.extra_phone_number)
                            }
                          />
                        </div>
                      )}
                    </ReactInputMask>
                  </Form.Item>
                </div>
              </div>
              <div className="flex gap-2 w-full">
                <CommentHistory
                  phoneNumber={values?.client_phone_number}
                  clientId={values?.client_id}
                />
                <div className="flex-1">
                  <div className="w-full">
                    <Form.Item formik={formik} name="client_description">
                      <Input
                        disabled={true}
                        id="client_description"
                        placeholder={t("commentary_to_the_client")}
                        onChange={(e) => {
                          handleChange(e);
                          handleUserLogs({
                            name: "описание клиента",
                          });
                        }}
                        value={values.client_description}
                        className="bg-gray-100 overflow-hidden rounded-md"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card title={t("order.type")} className="h-full">
            <div className="flex flex-col gap-4">
              <Form.Item formik={formik} name="delivery_type">
                <Select
                  id="delivery_type"
                  value={{
                    value: values.delivery_type,
                    label: t(values.delivery_type),
                  }}
                  options={DELIVERY_TYPES}
                  placeholder={t("delivery.type")}
                  disabled={!isOrderEditable}
                  onChange={({ value }) => {
                    setFieldValue("delivery_type", value);
                    handleUserLogs({ name: "Тип доставка" });
                  }}
                />
              </Form.Item>
              <div className="w-full grid grid-cols-2 gap-x-2">
                <div>
                  <div className="w-full" title={t("future_date")}>
                    <Form.Item formik={formik} name="future_time">
                      <DatePicker
                        icon={null}
                        disabled={!isOrderEditable}
                        dateformat="DD.MM"
                        hideTimePicker
                        placeholder={t("date")}
                        onChange={(e) => {
                          setFieldValue("future_time", moment(e));
                          handleUserLogs({
                            name: "Время доставки",
                          });
                        }}
                        value={
                          values?.future_time ? moment(values?.future_time) : ""
                        }
                        hideTimeBlock
                        oldDateShow={false}
                        isTodaySelected={isTodaySelected}
                        style={{
                          maxHeight: "34px",
                          "& input": { marginLeft: 0 },
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="w-full" title={t("delivery_time")}>
                  <Form.Item formik={formik} name="delivery_time">
                    <TimePicker
                      onChange={(val) => {
                        setFieldValue("delivery_time", val);
                        handleUserLogs({
                          name: "Время доставки",
                        });
                      }}
                      futureTime={futureTime}
                      value={values?.delivery_time ? values?.delivery_time : ""}
                      isTodaySelected={isTodaySelected}
                      disabled={!isOrderEditable}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="flex items-center">
                <Checkbox
                  color="primary"
                  checked={values.is_reissued}
                  disabled={!isOrderEditable}
                  onChange={(e) => {
                    setFieldValue("is_reissued", e.target.checked);
                    handleUserLogs({
                      name: "Повторно оформленный",
                    });
                  }}
                />
                <p
                  className="break-normal text-md font-semibold"
                  style={{ color: "#303940" }}
                >
                  Повторно оформленный
                </p>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card title={t("additional.data")}>
            <div className="flex flex-col gap-3">
              <div className="w-full position-relative">
                <div className="flex gap-3">
                  <div className="w-4/6">
                    <Form.Item
                      formik={formik}
                      name="to_address"
                      label={t("address")}
                      required
                    >
                      <AddressSearch
                        formik={formik}
                        id="to_address"
                        placeholder={t("address") + "..."}
                        value={values.to_address}
                        setPlacemarkGeometry={setPlacemarkGeometry}
                        setMapGeometry={setMapGeometry}
                        handleUserLogs={handleUserLogs}
                        mapGeometry={mapGeometry}
                        debouncedPhoneNumber={debouncedPhoneNumber}
                      />
                    </Form.Item>
                  </div>
                  <div className="w-1/6">
                    <Form.Item
                      formik={formik}
                      name="accommodation"
                      label={t("apartment_block")}
                    >
                      <Input
                        id="accommodation"
                        value={values.accommodation}
                        onChange={(e) => {
                          handleChange(e);
                          handleUserLogs({
                            name: t("apartment_block"),
                          });
                        }}
                        autoComplete="off"
                        placeholder={t("apartment_block")}
                      />
                    </Form.Item>
                  </div>
                  <div className="w-1/6">
                    <Form.Item
                      formik={formik}
                      name="apartment"
                      label={t("apartment")}
                    >
                      <Input
                        id="apartment"
                        value={values.apartment}
                        onChange={(e) => {
                          handleChange(e);
                          handleUserLogs({
                            name: t("apartment"),
                          });
                        }}
                        placeholder={t("apartment")}
                        autoComplete="off"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-4/6">
                  <Form.Item
                    formik={formik}
                    name="address_description"
                    label={t("landmark")}
                  >
                    <Input
                      id="address_description"
                      placeholder={t("landmark")}
                      value={values.address_description}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
                <div className="w-1/6">
                  <Form.Item formik={formik} name="floor" label={t("floor")}>
                    <Input
                      id="floor"
                      type="number"
                      min="1"
                      autoComplete="off"
                      max="100"
                      value={values.floor}
                      onChange={(e) => {
                        handleChange(e);
                        handleUserLogs({
                          name: t("floor"),
                        });
                      }}
                      placeholder={t("floor")}
                    />
                  </Form.Item>
                </div>
                <div className="w-1/6">
                  <Form.Item
                    formik={formik}
                    name="building"
                    label={t("entrance")}
                  >
                    <Input
                      id="building"
                      min="1"
                      max="50"
                      type="number"
                      value={values.building}
                      onChange={(e) => {
                        handleChange(e);
                        handleUserLogs({
                          name: t("entrance"),
                        });
                      }}
                      placeholder={t("entrance")}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2/6">
                  <Form.Item
                    formik={formik}
                    name="branch"
                    label={t("branch")}
                    required
                  >
                    {placemarkGeometry?.length ? (
                      <Select
                        id="branch"
                        value={values.branch}
                        options={branchOption || []}
                        placeholder={t("branch")}
                        isSearchable
                        onChange={(val) => {
                          setFieldValue("branch", val);
                          handleUserLogs({
                            name: "Филиал",
                          });
                        }}
                      />
                    ) : (
                      <AsyncSelect
                        loadOptions={loadBranches}
                        defaultOptions={isOrderEditable}
                        isDisabled={!isOrderEditable}
                        value={values.branch}
                        placeholder={t("branch")}
                        minWidth="none"
                        onChange={(val) => {
                          if (values.delivery_type === "self-pickup" || values.delivery_type === "hall") {
                            setFieldValue("branch", val);
                            handleUserLogs({
                              name: "Филиал",
                            });
                          } else {
                            dispatch(
                              showAlert(
                                t(
                                  "warning_text_to_trying_to_select_branch_before_entering_address",
                                ),
                                "warning",
                              ),
                            );
                          }
                        }}
                      />
                    )}
                  </Form.Item>
                </div>
                <div className="w-2/6">
                  {values?.delivery_type === "external" ? (
                    <Form.Item
                      formik={formik}
                      name="external"
                      label={t("external")}
                    >
                      <Select
                        id="external"
                        options={[
                          {
                            value: "yandex",
                            label: t("yandex_delivery"),
                          },
                        ]}
                        value={values.external_type}
                        placeholder={t("external")}
                        onChange={(val) => {
                          setFieldValue("external_type", val);
                          handleUserLogs({
                            name: "Внешняя доставка",
                          });
                        }}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      formik={formik}
                      name="courier_type"
                      label={t("courier.type")}
                    >
                      <AsyncSelect
                        defaultOptions={isOrderEditable}
                        cacheOptions
                        isClearable
                        loadOptions={loadCourierTypes}
                        minWidth="none"
                        value={values.courier_type}
                        placeholder={t("courier.type")}
                        isDisabled={
                          values.delivery_type === "self-pickup" ||
                          !isOrderEditable
                        }
                        onChange={(val) => {
                          setFieldValue("courier_type", val);
                          handleUserLogs({
                            name: "Тип курьера",
                          });
                        }}
                      />
                    </Form.Item>
                  )}
                </div>
                <div className="w-2/6">
                  <div className="input-label">
                    <span>{t("to.call")}</span>
                  </div>
                  <FormControl component="fieldset" className={styles.root}>
                    <RadioGroup
                      aria-label="call"
                      name="call"
                      value={values.is_courier_call}
                      onChange={() => {
                        handleUserLogs({
                          name: "Курьер звонит",
                        });
                      }}
                      row
                    >
                      <RadioLabelCall
                        callable={false}
                        cb={setFieldValue}
                        setIsCourierCall={setIsCourierCall}
                        on={values.is_courier_call === false}
                      />
                      <RadioLabelCall
                        on={values.is_courier_call === true}
                        callable
                        cb={setFieldValue}
                        setIsCourierCall={setIsCourierCall}
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2/6">
                  {values.delivery_type === "external" ? (
                    <Form.Item
                      formik={formik}
                      name="yandex_class"
                      label={t("yandex_delivery_class")}
                    >
                      <Select
                        id="yandex_class"
                        value={values.yandex_class}
                        options={[
                          { value: "courier", label: t("courier") },
                          { value: "express", label: t("express") },
                        ]}
                        placeholder={t("yandex_delivery_class")}
                        onChange={(val) => {
                          setFieldValue("yandex_class", val);
                          handleUserLogs({
                            name: "Тип Яндекс доставки",
                          });
                        }}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      formik={formik}
                      name="courier_id"
                      label={t("courier")}
                    >
                      <AsyncSelect
                        defaultOptions={isOrderEditable}
                        cacheOptions
                        isClearable
                        loadOptions={loadCouriers}
                        minWidth="none"
                        value={values.courier_id}
                        placeholder={t("courier")}
                        isDisabled={
                          values.delivery_type === "self-pickup" ||
                          !isOrderEditable
                        }
                        onChange={(val) => {
                          setFieldValue("courier_id", val);
                          handleUserLogs({
                            name: "Курьер",
                          });
                        }}
                      />
                    </Form.Item>
                  )}
                </div>
                <div className="w-2/6">
                  {values?.delivery_type === "external" ? (
                    <Form.Item
                      formik={formik}
                      name="co_delivery_price"
                      label="Сумма Яндекс"
                    >
                      <Input
                        readOnly
                        name="co_delivery_price"
                        id="co_delivery_price"
                        placeholder="0"
                        value={values.co_delivery_price}
                        suffix={t("uzb.sum")}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      formik={formik}
                      name="co_delivery_price"
                      label={t("fare")}
                    >
                      <AsyncSelect
                        loadOptions={loadFares}
                        defaultOptions={isOrderEditable}
                        isClearable
                        minWidth="none"
                        isDisabled={
                          values.delivery_type === "self-pickup" ||
                          !isOrderEditable
                        }
                        value={values.fare_id}
                        placeholder={t("fare")}
                        onChange={(val) => {
                          setFieldValue("fare_id", val);
                          val?.elm &&
                            setFieldValue(
                              "co_delivery_price",
                              val?.elm?.base_price,
                            );
                          handleUserLogs({
                            name: t("fare"),
                          });
                        }}
                      />
                    </Form.Item>
                  )}
                </div>
                <div className="w-2/6">
                  {values?.delivery_type === "external" ? (
                    <Form.Item
                      formik={formik}
                      name="yandex_distance"
                      label={t("distance2")}
                    >
                      <Input
                        readOnly
                        name="yandex_distance"
                        id="yandex_distance"
                        placeholder="0"
                        value={values.yandex_distance}
                        suffix={t("km")}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      formik={formik}
                      name="distance"
                      label={t("distance2")}
                    >
                      <Input
                        readOnly
                        name="distance"
                        id="distance"
                        placeholder="0"
                        value={distance || values.distance}
                        suffix={t("km")}
                      />
                    </Form.Item>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Grid>
      </Grid>
      {values?.client_id && (
        <Modal
          title={t("orders.history")}
          open={openOrderHistoryModal}
          onClose={() => setOpenOrderHistoryModal(false)}
          maxWidth="lg"
          fullWidth={true}
        >
          <OrderHistory client_id={values.client_id} />
        </Modal>
      )}
      <EditClientNameModal
        open={isEditModal}
        onClose={() => setIsEditModal(false)}
        setFieldValue={setFieldValue}
        client_id={values.client_id}
        client_phone_number={values.client_phone_number}
        client_name={values.client_name}
      />
    </div>
  );
}

export default memo(LeftSide);

function EditClientNameModal({
  open,
  onClose,
  setFieldValue,
  client_id,
  client_name,
  client_phone_number,
}) {
  const [clientName, setClientName] = useState("");
  const { t } = useTranslation();

  useEffect(() => setClientName(client_name), [client_name]);

  const updateHandler = () => {
    customerService
      .update(client_id, {
        name: clientName,
        phone: client_phone_number,
      })
      .then(() => {
        setFieldValue("client_name", clientName);
        onClose();
        setClientName("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal
      title={t("Обновить информацию о клиенте")}
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={true}
    >
      <div className="input-label">Имя клиента</div>
      <Input
        id="name"
        autoComplete="off"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        fullWidth
        onClick={updateHandler}
      >
        {t("change")}
      </Button>
    </Modal>
  );
}

function Aggregators({ onClick, options, ...props }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div {...props}>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        size="small"
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: 1.5,
        }}
      >
        <TruckIcon fontSize="inherit" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {options?.map((item) => (
          <MenuItem
            key={item.value}
            onClick={() => {
              onClick(item);
              handleClose();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

// function RadioLabel({ on, callable, cb, children, ...props }) {
//   return (
//     <div
//       className={`border ${
//         on
//           ? "border-blue-600 text-blue-600"
//           : "border-bordercolor text-gray-400"
//       } rounded-md flex items-center justify-between w-1/2 cursor-pointer text-sm px-3 h-8`}
//       onClick={() => {
//         if (callable) cb("delivery_type", "self-pickup");
//         else cb("delivery_type", "delivery");
//       }}
//       {...props}
//     >
//       {callable ? (
//         <DirectionsWalkIcon fontSize="small" />
//       ) : (
//         // Scooter icon
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 20 20"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M19.4047 13.757C19.7129 13.7402 19.9579 13.4854 19.9579 13.1727C19.9579 11.4866 18.6045 10.1658 16.8767 10.1658H16.3057L15.6078 6.85322C16.2812 6.56064 16.7536 5.88869 16.7536 5.10811C16.7536 4.05959 15.9016 3.20654 14.8543 3.20654H12.1545C11.8313 3.20654 11.5693 3.46889 11.5693 3.79248V4.52217H10.1307C9.8075 4.52217 9.54547 4.78451 9.54547 5.10811C9.54547 5.4317 9.8075 5.69404 10.1307 5.69404H11.5693V6.42373C11.5693 6.74732 11.8313 7.00967 12.1545 7.00967H12.4144C11.9298 7.58268 11.6368 8.32287 11.6368 9.13072V12.4651C11.6368 12.4822 11.6229 12.496 11.6058 12.496H9.24176C9.22813 12.496 9.21594 12.4869 9.21207 12.4738L8.57477 10.3175C9.0884 10.1801 9.46793 9.71041 9.46793 9.15342C9.46793 7.83088 8.39328 6.75494 7.07238 6.75494H1.79945C0.807266 6.7549 0 7.56314 0 8.55658C0 9.46479 0.674727 10.2178 1.54859 10.3404C0.621563 11.1706 0.0369922 12.3767 0.0369922 13.7171V15.5413C0.0369922 15.8649 0.299023 16.1272 0.622227 16.1272H1.12859C1.40117 17.4882 2.60383 18.5167 4.04215 18.5167C5.48047 18.5167 6.68312 17.4882 6.9557 16.1272H14.1147C14.3873 17.4882 15.5899 18.5167 17.0282 18.5167C18.6668 18.5167 20 17.1819 20 15.5413C20 14.8724 19.7783 14.2545 19.4047 13.757ZM18.6916 12.5867H17.3741C17.2606 12.5735 17.1453 12.5659 17.0283 12.5659C16.8185 12.5659 16.6139 12.5881 16.4163 12.6297V11.3377H16.8767C17.7338 11.3377 18.4425 11.8536 18.6916 12.5867ZM12.7397 4.37838H14.8543C15.2562 4.37838 15.5832 4.70572 15.5832 5.10807C15.5832 5.51041 15.2562 5.83775 14.8543 5.83775H12.7397V4.37838ZM9.2418 13.6679H11.6059C12.2683 13.6679 12.8072 13.1283 12.8072 12.465V9.13068C12.8072 8.12357 13.5137 7.2785 14.4566 7.06627L15.2459 10.8128V13.1621C14.6732 13.5933 14.2607 14.2266 14.1147 14.9553H8.29637C8.02305 12.8531 6.28703 11.2802 4.12023 11.2802C3.15402 11.2802 2.2866 11.5958 1.60223 12.1384C2.16754 11.0801 3.28207 10.3583 4.56223 10.3583H7.36637L8.08988 12.8063C8.23973 13.3136 8.71344 13.6679 9.2418 13.6679ZM1.255 14.9553C1.35727 14.332 1.62355 13.7697 2.03078 13.334C2.5623 12.7653 3.30434 12.4521 4.12016 12.4521C5.62961 12.4521 6.84902 13.5128 7.11082 14.9553H1.255V14.9553ZM1.79945 9.18643C1.45262 9.18643 1.17043 8.90389 1.17043 8.55658C1.17043 8.20928 1.45262 7.92674 1.79945 7.92674H7.07238C7.74793 7.92674 8.2975 8.47697 8.2975 9.15334C8.2925 9.17744 8.25391 9.19338 8.18207 9.18635C7.6952 9.18635 7.83438 9.18635 7.73297 9.18635C7.03371 9.18643 1.80285 9.18643 1.79945 9.18643ZM4.04215 17.3448C3.25375 17.3448 2.5825 16.8348 2.33898 16.1272H5.74531C5.5018 16.8348 4.83055 17.3448 4.04215 17.3448ZM17.0283 17.3448C16.035 17.3448 15.227 16.5357 15.227 15.5413C15.227 14.5468 16.0351 13.7378 17.0283 13.7378C18.0215 13.7378 18.8296 14.5468 18.8296 15.5413C18.8296 16.5357 18.0215 17.3448 17.0283 17.3448Z"
//             fill={on ? "var(--primary-color)" : "#5B6871"}
//           />
//           <path
//             d="M17.0286 16.1308C17.3539 16.1308 17.6177 15.8667 17.6177 15.541C17.6177 15.2152 17.3539 14.9512 17.0286 14.9512C16.7032 14.9512 16.4395 15.2152 16.4395 15.541C16.4395 15.8667 16.7032 16.1308 17.0286 16.1308Z"
//             fill={on ? "var(--primary-color)" : "#5B6871"}
//           />
//           <path
//             d="M0.609648 5.05615H5.8584C6.1816 5.05615 6.44363 4.79381 6.44363 4.47021C6.44363 4.14662 6.1816 3.88428 5.8584 3.88428H0.609648C0.286445 3.88428 0.0244141 4.14662 0.0244141 4.47021C0.0244141 4.79381 0.286445 5.05615 0.609648 5.05615Z"
//             fill={on ? "var(--primary-color)" : "#5B6871"}
//           />
//           <path
//             d="M2.55398 2.65527H7.84797C8.17117 2.65527 8.4332 2.39293 8.4332 2.06934C8.4332 1.74574 8.17117 1.4834 7.84797 1.4834H2.55398C2.23078 1.4834 1.96875 1.74574 1.96875 2.06934C1.96875 2.39293 2.23078 2.65527 2.55398 2.65527Z"
//             fill={on ? "var(--primary-color)" : "#5B6871"}
//           />
//         </svg>
//       )}
//       {children}
//     </div>
//   );
// }

function RadioLabelCall({ on, callable, cb, setIsCourierCall, ...props }) {
  return (
    <div
      className={`border ${
        on
          ? "border-blue-600 text-blue-600"
          : "border-bordercolor text-gray-400"
      } rounded-md flex items-center justify-center w-1/2 cursor-pointer h-8`}
      onClick={() => {
        cb("is_courier_call", callable);
        setIsCourierCall(callable);
      }}
      {...props}
    >
      {callable ? (
        // Call Enabled Icon
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_6781_123754)">
            <path
              d="M16.675 12.8167C15.65 12.8167 14.6583 12.65 13.7333 12.35C13.4417 12.25 13.1167 12.325 12.8917 12.55L11.5833 14.1917C9.225 13.0667 7.01667 10.9417 5.84167 8.5L7.46667 7.11667C7.69167 6.88333 7.75833 6.55833 7.66667 6.26667C7.35833 5.34167 7.2 4.35 7.2 3.325C7.2 2.875 6.825 2.5 6.375 2.5L3.49167 2.5C3.04167 2.5 2.5 2.7 2.5 3.325C2.5 11.0667 8.94167 17.5 16.675 17.5C17.2667 17.5 17.5 16.975 17.5 16.5167L17.5 13.6417C17.5 13.1917 17.125 12.8167 16.675 12.8167Z"
              fill={on ? "var(--primary-color)" : "#5B6871"}
            />
          </g>
          <defs>
            <clipPath id="clip0_6781_123754">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        // Call Disabled Icon
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_6781_123751)">
            <path
              d="M5.54154 12.0999C3.47487 9.49154 2.31654 6.1332 2.52487 2.49987L7.11654 2.49987L7.62487 6.89154L5.52487 8.99154C5.86654 9.66654 6.27487 10.3082 6.7332 10.9082L16.4832 1.1582L17.6582 2.34154L2.3332 17.6582L1.1582 16.4832L5.54154 12.0999ZM9.07487 13.2582C9.6832 13.7249 10.3332 14.1332 11.0165 14.4832L13.1249 12.3749L17.4999 12.8832V17.4749C13.8582 17.6832 10.4999 16.5165 7.8832 14.4499L9.07487 13.2582Z"
              fill={on ? "var(--primary-color)" : "#5B6871"}
            />
          </g>
          <defs>
            <clipPath id="clip0_6781_123751">
              <rect
                width="20"
                height="20"
                fill="white"
                transform="matrix(0 1 -1 0 20 0)"
              />
            </clipPath>
          </defs>
        </svg>
      )}
    </div>
  );
}
