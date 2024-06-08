import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Masonry from "react-smart-masonry";
import { useFormik } from "formik";
import * as yup from "yup";
import moment from "moment";
import { withStyles } from "@mui/styles";
import {
  Save as SaveIcon,
  RotateLeftRounded as RotateLeftRoundedIcon,
} from "@mui/icons-material";
import { SET_COLOR_AND_TIME } from "redux/constants";
import { getShipper, updateShipper, getRegions } from "services";
import { Input } from "alisa-ui";
import Card from "components/Card";
import Select from "components/Select";
import Switch from "components/Switch";
import Form from "components/Form/Index";
import Gallery from "components/Gallery";
import TimePicker from "components/TimePicker";
import useWindowSize from "hooks/useWindowSize";
import PhoneInput from "components/PhoneInput";
import Checkbox from "components/Checkbox/Checkbox";
import FDropdown from "components/Filters/FDropdown";
import { Radio, RadioGroup } from "components/Radio";
import { showAlert } from "redux/actions/alertActions";
import { phoneValidation } from "utils/phoneValidator";
import FullScreenLoader from "components/FullScreenLoader";
import { FieldArray, FormikProvider } from "formik";
import { useCallback } from "react";
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Button from "components/Button/Buttonv2";

var resValuesInClosure;

const PrimaryCheckbox = withStyles({
  root: {
    color: "#B0BABF",
    "&$checked": {
      color: "#0E73F6",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function Company() {
  const [loader, setLoader] = useState(true);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [regions, setRegions] = useState(null);
  const [regionQ, setRegionQ] = useState("");

  const { t } = useTranslation();
  const { shipper_id, accessToken } = useSelector((state) => state.auth);
  const windowSize = useWindowSize();
  const dispatch = useDispatch();

  const colorOptions = [
    { label: t("yellow"), value: "yellow", color: "#FDE25D" },
    { label: t("red"), value: "red", color: "#FF9494" },
    { label: t("green"), value: "green", color: "#E1EDE0" },
  ];

  const saveChanges = (data) => {
    setBtnDisabled(true);
    updateShipper(data)
      .then(() => dispatch(showAlert(t("succesfully sended"), "success")))
      .finally(() => {
        setBtnDisabled(false);
        dispatch({
          type: SET_COLOR_AND_TIME,
          payload: {
            time: values.order_late_time,
            color: {
              name: values.order_late_colour.value,
              hex: values.order_late_colour.color,
            },
            free_delevery_for_delayed_order:
              values.free_delevery_for_delayed_order,
            free_delevery_time: values.free_delevery_time,
          },
        });
      });
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
      auto_accept_min_order_count: +values.auto_accept_min_order_count,
      auto_acceptance_sources:
        values.auto_acceptance_sources.length > 0
          ? values.auto_acceptance_sources.map((item) => item.value)
          : [],
      order_late_colour: values.order_late_colour.value,
      future_order_time: values.future_order_time,
      courier_action_radius: +values.courier_action_radius,
      max_delivery_time: +values.max_delivery_time,
      courier_period: +values.courier_period,
      menu_image: "1832311f-c606-4812-9886-1b688b37dec0",
      phone: values.phone ? [values.phone.toString()] : [],
      work_hour_start: moment(values.work_hour_start).format("H:mm"),
      work_hour_end: moment(values.work_hour_end).format("H:mm"),
      free_delevery_time: +values.free_delevery_time,
      crm: values.crm.value !== "delever" ? values.crm.value : "",
      fiscal_tin: values.fiscal_tin,
      group_order_priorities:
        values?.group_order_priorities[0]?.value === ""
          ? []
          : values?.group_order_priorities.map((item) => item?.value),
      is_active: true,
      payment_bot_token: values.payment_bot_token,
    };

    saveChanges(data);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(accessToken);
    dispatch(showAlert(t("successfully_copied"), "success"));
  };

  const initialValues = useMemo(
    () => ({
      auto_accept_min_order_count: 0,
      auto_acceptance_sources: [],
      auto_acception: false,
      colours: { primary: "#ff0000", secondary: "#ff0000", brand: "#ff0000" },
      default_region_id: "",
      name: "",
      phone: "",
      call_center_tg: "",
      address: "", //not
      crm: "",
      logo: "",
      future_order_time: "", //not
      minimal_order_price: "",
      max_delivery_time: "",
      order_late_colour: "",
      order_road: "",
      courier_period: "",
      max_courier_orders: 0,
      courier_accept_radius: "",
      courier_action_radius: "",
      courier_accepts_first: false,
      check_courier_action_radius: false,
      process_only_paid_orders: false,
      show_location_before_accepting: false,
      is_courier_billing: false,
      work_hour_start: null,
      worl_hour_end: null,
      enable_courier_working_hours: false,
      order_late_time: 0,
      is_orders_limit: false,
      branch_action_radius: 0,
      is_pickup_load: false,
      description: "",
      free_delevery_for_delayed_order: false, // yeahhh I know it is incorrect to write as "delevery", but it was already named after in the backend by this way :(
      free_delevery_time: 0,
      vat_percent: 0,
      group_order_priorities: [""],
      fiscal_tin: "",
      payment_bot_token: "",
    }),
    [],
  );

  // const phoneNumberRegexp = /^998([378]{2}|(9[013-57-9]))\d{7}$/;

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      phone: phoneValidation(),
    });
  }, []);

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const gallerySizeMake = (width) => {
    if (width < 1500 && width > 1300) {
      return 100;
    } else if (width <= 1300 && width > 1200) {
      return 80;
    } else if (width <= 1200) {
      return 60;
    } else {
      return 120;
    }
  };

  const { values, handleChange, setFieldValue, handleSubmit } = formik;

  useEffect(() => {
    const fetchData = () => {
      setLoader(true);
      if (!shipper_id) return setLoader(false);
      getShipper(shipper_id)
        .then((res) => {
          const resValues = {
            ...res,
            auto_acceptance_sources:
              res?.auto_acceptance_sources.length > 0
                ? res?.auto_acceptance_sources?.map((item) => ({
                    label: t(`${item === "bot" ? "telegram_bot" : item}`),
                    value: item,
                  }))
                : [],
            auto_acception: res?.auto_acception ?? false,
            colours: {
              primary: res?.colours?.primary
                ? res?.colours?.primary
                : "#ff0000",
              secondary: res?.colours?.secondary
                ? res?.colours?.secondary
                : "#ff0000",
              brand: res?.colours?.brand ? res?.colours?.brand : "#ff0000",
            },
            default_region_id: res?.default_region_id ?? "",
            phone: res?.phone[0],
            logo: res?.logo.split("delever/")[1],
            future_order_time: +res?.future_order_time,
            order_late_colour: {
              label: t(res?.order_late_colour),
              value: res?.order_late_colour,
              color: colorOptions?.find(
                (el) => el.value === res?.order_late_colour,
              )?.color,
            },
            work_hour_start: moment(res?.work_hour_start, "H:mm:ss"),
            work_hour_end: moment(res?.work_hour_end, "H:mm:ss"),
            payment_bot_token: res?.payment_bot_token,
            crm:
              res?.crm === "iiko"
                ? {
                    label: "IIKO",
                    value: "iiko",
                  }
                : res?.crm === "jowi"
                ? {
                    label: "JOWI",
                    value: "jowi",
                  }
                : res?.crm === "rkeeper"
                ? {
                    label: "R-Keeper",
                    value: "rkeeper",
                  }
                : res?.crm === "various"
                ? {
                    label: "Multiple POS",
                    value: "various",
                  }
                : res?.crm === "none"
                ? {
                    label: "Delever",
                    value: "delever",
                  }
                : "",
            group_order_priorities:
              res?.group_order_priorities.length > 0
                ? res?.group_order_priorities?.map((item) => ({
                    label: t(`${item}`),
                    value: item,
                  }))
                : [{ label: "", value: "" }],
          };
          resValuesInClosure = resValues;
          formik.setValues(resValues);
        })
        .finally(() => setLoader(false));
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRegions({ page: 1, limit: 10, search: regionQ }).then((res) =>
      setRegions(
        res?.regions?.map((type) => ({
          label: type.name,
          value: type.id,
        })),
      ),
    );
  }, [regionQ]);

  return loader ? (
    <FullScreenLoader />
  ) : (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <Masonry columns={2} gap={16} style={{ padding: "1rem" }}>
          <Card title={t("client")}>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-3">
                <Form.Item formik={formik} name="logo">
                  <div className="w-full h-full flex items-center flex-col">
                    <Gallery
                      rounded
                      width={gallerySizeMake(windowSize.width)}
                      height={gallerySizeMake(windowSize.width)}
                      gallery={values.logo ? [values.logo] : []}
                      setGallery={(elm) => {
                        setFieldValue("logo", elm[0]);
                      }}
                      multiple={false}
                    />
                  </div>
                </Form.Item>
              </div>

              <div className="col-span-9 flex flex-col gap-4">
                <div className="w-full flex items-center">
                  <div className="w-1/4 input-label">
                    <span>{t("name")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="name">
                        <Input
                          size="large"
                          id="name"
                          value={values.name}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-center">
                  <div className="w-1/4 input-label">
                    <span>{t("phone")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="phone">
                        <PhoneInput
                          value={values.phone}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-center">
                  <div className="w-1/4 input-label">
                    <span>{t("address.telegram")}</span>
                  </div>
                  <div className="w-3/4 flex">
                    <div className="w-full">
                      <Form.Item formik={formik} name="call_center_tg">
                        <Input
                          size="large"
                          id="call_center_tg"
                          value={values.call_center_tg}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                    {/* <IconButton icon={<AddIcon />} /> */}
                  </div>
                </div>
                <div className="flex w-full items-center">
                  <div className="w-1/4 input-label">
                    <span>{t("description")}</span>
                  </div>
                  <div className="w-3/4">
                    <textarea
                      id="description"
                      className="w-full border border-lightgray-1 rounded-md"
                      values={values.description}
                      onChange={(e) =>
                        setFieldValue("description", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex w-full items-center">
                  <div className="w-1/4 input-label">
                    <label>{t("address")}</label>
                  </div>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="address">
                      <Input
                        size="large"
                        id="address"
                        value={values.address}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex w-full items-center">
                  <div className="w-1/4 input-label">
                    <label>{t("integration")}</label>
                  </div>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="crm">
                      <Select
                        height={40}
                        value={values.crm}
                        options={[
                          { label: "IIKO", value: "iiko" },
                          { label: "JOWI", value: "jowi" },
                          { label: "Poster", value: "poster" },
                          { label: "R-Keeper", value: "rkeeper" },
                          { label: "Delever", value: "delever" },
                          { label: "Multiple POS", value: "various" },
                        ]}
                        onChange={(val) => {
                          setFieldValue("crm", {
                            label: val.label,
                            value: val.value,
                          });
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="w-3/4 input-label">
                    <label>{t("is_orders_limit")}</label>
                  </div>
                  <div className="w-1/4">
                    <Form.Item formik={formik} name="is_orders_limit">
                      <Switch
                        checked={values.is_orders_limit}
                        onChange={() =>
                          setFieldValue(
                            "is_orders_limit",
                            !values.is_orders_limit,
                          )
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex w-full items-center mb-2">
                  <div className="w-1/4 input-label">
                    <label>{t("Webhook")}</label>
                  </div>
                  <div className="w-3/4">
                    <Button variant="outlined" onClick={handleCopyWebhook}>
                      {t("copy")}
                    </Button>
                  </div>
                </div>
                {values.is_orders_limit && (
                  <div>
                    <div className="col-span-4 w-full flex items-center">
                      <div className="w-3/4 input-label">
                        <span>{t("branch_action_radius")}</span>
                      </div>
                      <div className="w-1/4">
                        <div>
                          <Form.Item
                            formik={formik}
                            name="branch_action_radius"
                          >
                            <Input
                              size="large"
                              id="branch_action_radius"
                              value={values.branch_action_radius}
                              onChange={handleChange}
                              suffix={t("km")}
                              type="number"
                              min="1"
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-4 w-full flex items-center">
                      <div className="w-3/4 input-label">
                        <span>{t("is_pickup_load")}</span>
                      </div>
                      <div className="w-1/4">
                        <div>
                          <Form.Item formik={formik} name="is_pickup_load">
                            <PrimaryCheckbox
                              color="primary"
                              id="is_pickup_load"
                              checked={values.is_pickup_load}
                              onChange={(e) => {
                                setFieldValue(
                                  "is_pickup_load",
                                  e.target.checked,
                                );
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
          <Card title={t("orders")}>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("average_delivery_time")}</span>
                </div>
                <div className="w-1/4">
                  <div>
                    <Form.Item formik={formik} name="future_order_time">
                      <Input
                        size="large"
                        id="future_order_time"
                        value={values.future_order_time}
                        onChange={handleChange}
                        suffix={t("min")}
                        type="number"
                        min="1"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("minimal_order_price")}</span>
                </div>
                <div className="w-1/4">
                  <div>
                    <Form.Item formik={formik} name="minimal_order_price">
                      <Input
                        size="large"
                        id="minimal_order_price"
                        value={values.minimal_order_price}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("max_delivery_time")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="max_delivery_time">
                      <Input
                        size="large"
                        suffix={t("min")}
                        id="max_delivery_time"
                        value={values.max_delivery_time}
                        onChange={handleChange}
                        type="number"
                        min="1"
                      />
                    </Form.Item>
                  </div>
                  {/* <IconButton icon={<AddIcon />} /> */}
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("order_late_time")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="order_late_time">
                      <Input
                        size="large"
                        suffix={t("min")}
                        id="order_late_time"
                        value={values.order_late_time}
                        onChange={handleChange}
                        type="number"
                        min="1"
                      />
                    </Form.Item>
                  </div>
                  {/* <IconButton icon={<AddIcon />} /> */}
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("order_late_colour")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="order_late_colour">
                      <Select
                        // isClearable
                        height={40}
                        value={values.order_late_colour}
                        options={colorOptions}
                        onChange={(val) => {
                          setFieldValue("order_late_colour", val);
                        }}
                      />
                    </Form.Item>
                  </div>
                  {/* <IconButton icon={<AddIcon />} /> */}
                </div>
              </div>

              <div className="col-span-4 flex w-full items-center">
                <div className="w-3/4 input-label">
                  <label>{t("order_road")}</label>
                </div>
                <div className="w-2/4">
                  <Form.Item formik={formik} name="order_road">
                    <RadioGroup
                      name="order_road"
                      selectedValue={values.order_road}
                      value={values.order_road}
                      onChange={(val) => {
                        setFieldValue("order_road", val);
                      }}
                      className="flex items-center"
                    >
                      <Radio value="way" className="mr-4" />
                      <span className="mr-4">{t("road")}</span>
                      <Radio value="radius" className="mr-4" />
                      <span className="mr-4">{t("radius")}</span>
                    </RadioGroup>
                  </Form.Item>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("work_hour_start")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="work_hour_start">
                      <TimePicker
                        showHour={true}
                        onChange={(val) => {
                          setFieldValue("work_hour_start", val);
                        }}
                        value={values.work_hour_start}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("work_hour_end")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="work_hour_end">
                      <TimePicker
                        onChange={(val) => {
                          setFieldValue("work_hour_end", val);
                        }}
                        value={values.work_hour_end}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("vat.percent")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="vat_percent">
                      <Input
                        onChange={(val) => {
                          val.target.value < 101 &&
                            setFieldValue("vat_percent", val.target.value);
                        }}
                        placeholder={t("vat.percent")}
                        value={values.vat_percent}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("fiscal_tin")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="fiscal_tin">
                      <Input
                        onChange={(val) => {
                          val.target.value < 101 &&
                            setFieldValue("fiscal_tin", val.target.value);
                        }}
                        placeholder={t("fiscal_tin")}
                        value={values.fiscal_tin}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("enable_courier_working_hours")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item
                      formik={formik}
                      name="enable_courier_working_hours"
                    >
                      <Switch
                        checked={values.enable_courier_working_hours}
                        onChange={() =>
                          setFieldValue(
                            "enable_courier_working_hours",
                            !values.enable_courier_working_hours,
                          )
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("auto_acception")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="auto_acception">
                      <Switch
                        checked={values.auto_acception}
                        onChange={() =>
                          setFieldValue(
                            "auto_acception",
                            !values.auto_acception,
                          )
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("auto_accept_min_order_count")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item
                      formik={formik}
                      name="auto_accept_min_order_count"
                    >
                      <Input
                        onChange={(val) => {
                          val.target.value < Math.pow(10, 9) &&
                            setFieldValue(
                              "auto_accept_min_order_count",
                              val.target.value,
                            );
                        }}
                        placeholder={t("auto_accept_min_order_count")}
                        value={values.auto_accept_min_order_count}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-2/4 input-label">
                  <span>{t("auto_acceptance_sources")}</span>
                </div>
                <div className="w-2/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="auto_acceptance_sources">
                      <Select
                        isMulti
                        height={40}
                        id="auto_acceptance_sources"
                        options={[
                          { value: "bot", label: t("telegram_bot") },
                          { value: "website", label: t("website") },
                          { value: "android", label: t("android") },
                          { value: "ios", label: t("ios") },
                        ]}
                        value={values.auto_acceptance_sources}
                        onChange={(val) => {
                          setFieldValue("auto_acceptance_sources", val);
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center justify-between">
                <div className="w-2/4 input-label">
                  <span>{t("default_region")}</span>
                </div>
                <div className="w-2/4 flex">
                  <div className="w-full">
                    <FDropdown
                      options={regions}
                      label="не выбран"
                      value={values?.default_region_id}
                      onClick={(value) =>
                        setFieldValue("default_region_id", value)
                      }
                      onChange={(e) => setRegionQ(e.target.value)}
                      reset={() => setFieldValue("default_region_id", "")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("payment_bot_token")}</span>
                </div>
                <div className="w-3/4">
                  <div>
                    <Form.Item formik={formik} name="payment_bot_token">
                      <Input
                        placeholder={t("write_token")}
                        id="payment_bot_token"
                        value={values.payment_bot_token}
                        onChange={handleChange}
                        type="text"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card title={t("couriers")}>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("courier_period")}</span>
                </div>
                <div className="w-1/4">
                  <div>
                    <Form.Item formik={formik} name="courier_period">
                      <Input
                        size="large"
                        id="courier_period"
                        value={values.courier_period}
                        onChange={handleChange}
                        suffix={t("min")}
                        type="number"
                        // min="1"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("courier_accept_radius")}</span>
                </div>
                <div className="w-1/4">
                  <div>
                    <Form.Item formik={formik} name="courier_accept_radius">
                      <Input
                        size="large"
                        id="courier_accept_radius"
                        value={values.courier_accept_radius}
                        onChange={handleChange}
                        suffix={t("km")}
                        type="number"
                        min="1"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("courier_action_radius")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="courier_action_radius">
                      <Input
                        size="large"
                        id="courier_action_radius"
                        value={values.courier_action_radius}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        suffix={t("m")}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("max.courier.orders")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="max_courier_orders">
                      <Input
                        size="large"
                        id="max_courier_orders"
                        value={values.max_courier_orders}
                        onChange={handleChange}
                        type="number"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="col-span-4 w-full flex items-center">
                <div className="w-3/4 input-label">
                  <span>{t("radius.priority")}</span>
                </div>
                <div className="w-1/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="priority_radius">
                      <Input
                        size="large"
                        id="priority_radius"
                        value={values.priority_radius}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        suffix={t("m")}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <div>
            <Card title={t("options")}>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="input-label">
                    <label>{t("courier_accepts_first")}</label>
                  </div>
                  <div>
                    <Form.Item formik={formik} name="courier_accepts_first">
                      <PrimaryCheckbox
                        color="primary"
                        id="courier_accepts_first"
                        checked={values.courier_accepts_first}
                        onChange={(e) => {
                          setFieldValue(
                            "courier_accepts_first",
                            e.target.checked,
                          );
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="input-label">
                    <label>{t("check_courier_action_radius")}</label>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="check_courier_action_radius"
                    >
                      <PrimaryCheckbox
                        color="primary"
                        id="check_courier_action_radius"
                        checked={values.check_courier_action_radius}
                        onChange={(e) => {
                          setFieldValue(
                            "check_courier_action_radius",
                            e.target.checked,
                          );
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="input-label">
                    <label>{t("process_only_paid_orders")}</label>
                  </div>
                  <div>
                    <Form.Item formik={formik} name="process_only_paid_orders">
                      <PrimaryCheckbox
                        color="primary"
                        id="process_only_paid_orders"
                        checked={values.process_only_paid_orders}
                        onChange={(e) => {
                          setFieldValue(
                            "process_only_paid_orders",
                            e.target.checked,
                          );
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="input-label">
                    <label>{t("show.location.before.accepting")}</label>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="show_location_before_accepting"
                    >
                      <PrimaryCheckbox
                        color="primary"
                        id="show_location_before_accepting"
                        checked={values.show_location_before_accepting}
                        onChange={(e) => {
                          setFieldValue(
                            "show_location_before_accepting",
                            e.target.checked,
                          );
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="input-label">
                    <label>{t("is.courier.billing")}</label>
                  </div>
                  <div>
                    <Form.Item formik={formik} name="is_courier_billing">
                      <PrimaryCheckbox
                        color="primary"
                        id="is_courier_billing"
                        checked={values.is_courier_billing}
                        onChange={(e) => {
                          setFieldValue("is_courier_billing", e.target.checked);
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="input-label">
                    <label>
                      {t("Проверка статуса оплаты после доставки ")}
                    </label>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="free_delevery_for_delayed_order"
                    >
                      <PrimaryCheckbox
                        color="primary"
                        id="free_delevery_for_delayed_order"
                        checked={values.free_delevery_for_delayed_order}
                        onChange={(e) => {
                          setFieldValue(
                            "free_delevery_for_delayed_order",
                            e.target.checked,
                          );
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
                {values.free_delevery_for_delayed_order && (
                  <div className="col-span-4 flex w-full items-center">
                    <div className="w-2/4 input-label">
                      <label>{t("time")}</label>
                    </div>
                    <div className="w-2/4">
                      <Form.Item formik={formik} name="free_delevery_time">
                        <Input
                          id="free_delevery_time"
                          placeholder={t("enter.time")}
                          value={values.free_delevery_time}
                          onChange={(e) => {
                            setFieldValue("free_delevery_time", e.target.value);
                          }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
          <Priority formik={formik} initialValues={initialValues} />
        </Masonry>
        <div className="sticky bottom-0 flex justify-end items-center w-full bg-white gap-3 p-4">
          <Button
            startIcon={<RotateLeftRoundedIcon />}
            variant="outlined"
            size="large"
            onClick={() => formik.resetForm({ values: resValuesInClosure })}
          >
            Удалить изменения
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            type="submit"
            disabled={btnDisabled}
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Priority({ formik }) {
  const { t } = useTranslation();

  const options = [
    { label: t("time"), value: "time" },
    { label: t("loyalty"), value: "loyalty" },
    { label: t("distance"), value: "distance" },
  ];

  const { values, setFieldValue } = formik;

  const DragHandle = SortableHandle(() => (
    <DragIndicatorIcon
      style={{
        color: "#6e8bb7",
        cursor: "n-resize",
      }}
    />
  ));

  const SortableList = SortableContainer((props) => {
    return props.children;
  });

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      var sortedIds = arrayMove(
        values?.group_order_priorities,
        oldIndex,
        newIndex,
      );
      setFieldValue("group_order_priorities", sortedIds);
    },
    [setFieldValue, values?.group_order_priorities],
  );

  const data = new Set(values?.group_order_priorities.map((el) => el.value));
  const result = options.filter((el) => !data.has(el.value));

  const SortableItem = SortableElement(({ value, position, remove }) => {
    return (
      <div className="flex justify-between items-baseline w-full gap-4 mb-3">
        <span className="d-block border rounded-md p-2">
          <DragHandle />
        </span>
        <div className="w-full flex">
          <div className="w-full mr-2">
            <Form.FieldArrayItem
              formik={formik}
              custom={true}
              //   custom_error={
              //     formik.errors?.["group_order_priorities"]?.[position]?.["label"]
              //   }
            >
              <Select
                height={40}
                id={`group_order_priorities[${position}].value`}
                options={result}
                value={value}
                onChange={(val) => {
                  setFieldValue(`group_order_priorities.${position}`, val);
                }}
                // disabled={values.type.value === "variant"}
              />
            </Form.FieldArrayItem>
          </div>
        </div>

        <div className="flex items-baseline justify-between w-auto">
          <span
            className="cursor-pointer d-block border rounded-md py-2 px-2"
            onClick={() => remove(position)}
          >
            <DeleteIcon color="error" />
          </span>
        </div>
      </div>
    );
  });

  return (
    <Card title={t("grouping.order.for.couriers")}>
      <div>
        <FormikProvider value={formik}>
          <FieldArray name="group_order_priorities">
            {({ push, remove }) => (
              <>
                <SortableList
                  useDragHandle
                  onSortEnd={onSortEnd}
                  key={"sortable-list"}
                >
                  <div>
                    {values.group_order_priorities?.map((group, index) => (
                      <SortableItem
                        key={`${group.value}`}
                        index={index}
                        value={group}
                        position={index}
                        remove={remove}
                      />
                    ))}
                  </div>
                </SortableList>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => push({ label: "", value: "", options: [] })}
                  disabled={values?.group_order_priorities?.length === 3}
                >
                  {t("add")}
                </Button>
              </>
            )}
          </FieldArray>
        </FormikProvider>
      </div>
    </Card>
  );
}
