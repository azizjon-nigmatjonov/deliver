import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { Input } from "alisa-ui";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
import Button from "components/Button";
import Card from "components/Card";
import RangePicker from "components/DateTimePicker/RangePicker";
import Form from "components/Form/Index";
import Gallery from "components/Gallery";
import Header from "components/Header";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import Switch from "components/Switch";
import TabPanel from "components/Tab/TabPanel";
import TextArea from "components/Textarea";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";
import { useHistory, useParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { getOnePopUp, postPopUp, updatePopUp } from "services/v2/marketing/popup";
import * as yup from "yup";

const CreatePopUp = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const history = useHistory();
  const { id } = useParams();

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleTabChange = (event, newValue) => setValue(newValue);

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  const initialValues = useMemo(
    () => ({
      about_ru: "",
      about_uz: "",
      about_en: "",
      title_ru: "",
      title_uz: "",
      title_en: "",
      button_ru: "",
      button_uz: "",
      button_en: "",
      active: true,
      from_date: "",
      to_date: "",
      from_time: "",
      to_time: "",
      url: "",
      image: "",
      order_no: 0,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      about_ru: defaultSchema,
      about_uz: defaultSchema,
      about_en: defaultSchema,
      title_ru: defaultSchema,
      title_uz: defaultSchema,
      title_en: defaultSchema,
      button_ru: defaultSchema,
      button_uz: defaultSchema,
      button_en: defaultSchema,
      from_date: defaultSchema,
      to_date: defaultSchema,
      from_time: defaultSchema,
      to_time: defaultSchema,
      url: defaultSchema,
      image: defaultSchema,
      order_no: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const submitValues = {
      title: {
        ru: values?.title_ru,
        uz: values?.title_uz,
        en: values?.title_en,
      },
      about: {
        ru: values?.about_ru,
        uz: values?.about_uz,
        en: values?.about_en,
      },
      button: {
        ru: values.button_ru,
        uz: values.button_uz,
        en: values.button_en,
      },
      active: values?.active,
      from_date: values?.from_date,
      to_date: values?.to_date,
      from_time: values?.from_time,
      to_time: values?.to_time,
      url: values?.url,
      image: values?.image,
      order_no: Number(values?.order_no),
    };

    id
      ? updatePopUp(id, submitValues)
          .catch((err) => console.log(err))
          .finally(() => history.goBack())
      : postPopUp(submitValues)
          .catch((err) => console.log(err))
          .finally(() => history.goBack());
  };

  const formik = useFormik({ initialValues, onSubmit, validationSchema });

  const { values, handleChange, setFieldValue, handleSubmit, setValues } =
    formik;

  useEffect(() => {
    if (id) {
      getOnePopUp(id).then((res) => {
        setValues({
          ...res,
          button_ru: res?.button?.ru,
          button_uz: res?.button?.uz,
          button_en: res?.button?.en,
          about_ru: res?.about?.ru,
          about_uz: res?.about?.uz,
          about_en: res?.about?.en,
          title_ru: res?.title?.ru,
          title_uz: res?.title?.uz,
          title_en: res?.title?.en,
          image: res?.image?.split("/").pop(),
          order_no: res?.order_no,
        });
      });
    }
  }, []);

  const routes = [
    {
      title: <div>{t("pop.ups.list")}</div>,
      link: true,
      route: `/home/marketing/popup`,
    },
    {
      title: t("create"),
    },
  ];

  const headerTitle = useMemo(() => {
    return [
      <div className="flex">
        <ArrowBackIcon
          onClick={() => history.goBack()}
          className="cursor-pointer"
        />
        <p className="ml-3">{t("add.popup")}</p>
      </div>,
    ];
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Header title={headerTitle} />
        <Card
          className="m-4"
          title={t("general.information")}
          bodyStyle={{ padding: "0 1rem" }}
        >
          <StyledTabs
            value={value}
            onChange={handleTabChange}
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
            className="border-b"
          >
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={RuIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("russian"))}
                </span>
              }
              {...a11yProps(0)}
              style={{ width: "150px" }}
            />
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={EnIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("english"))}
                </span>
              }
              {...a11yProps(1)}
              style={{ width: "150px" }}
            />
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={UzIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("uzbek"))}
                </span>
              }
              {...a11yProps(2)}
              style={{ width: "150px" }}
            />
          </StyledTabs>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <div className="grid grid-cols-12 gap-8 mb-14">
                <div className="col-span-2 ml-2">
                  <Form.Item formik={formik} name="image">
                    <div className="w-full h-full flex mt-6 items-center flex-col">
                      <Gallery
                        width={160}
                        height={160}
                        gallery={values.image ? [values.image] : []}
                        setGallery={(elm) => setFieldValue("image", elm[0])}
                        multiple={false}
                        extraTitle="650x284"
                      />
                    </div>
                  </Form.Item>
                </div>

                <div className="col-span-10 flex flex-col gap-4">
                  <div className="w-full pt-4">
                    <div className="w-1/4 input-label mb-1">
                      <span>
                        {t("name")}
                        <span className="text-red-600">*</span>
                      </span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="title_ru">
                          <Input
                            size="large"
                            id="title_ru"
                            value={values.title_ru}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col">
                    <div className="w-1/4 input-label mb-1">
                      <span>
                        {t("description")}
                        <span className="text-red-600">*</span>
                      </span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="about_ru">
                          <TextArea
                            id="about_ru"
                            {...formik.getFieldProps("about_ru")}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-full flex flex-col pt-4 mr-4">
                      <div className="w-1/4 input-label mb-1">
                        <span>
                          {t("time_date")}
                          <span className="text-red-600">*</span>
                        </span>
                      </div>
                      <div className="w-6/8">
                        <div>
                          <Form.Item formik={formik} name="from_date">
                            <RangePicker
                              hideTimePicker
                              placeholder={t("order.period")}
                              dateValue={[
                                values.from_date
                                  ? moment(values.from_date)
                                  : undefined,
                                values.from_date
                                  ? moment(values.to_date)
                                  : undefined,
                              ]}
                              onChange={(e) => {
                                if (e[0] === null) {
                                  setFieldValue("from_date", undefined);
                                  setFieldValue("to_date", undefined);
                                } else {
                                  setFieldValue(
                                    "from_date",
                                    moment(e[0]).format("YYYY-MM-DD"),
                                  );
                                  setFieldValue(
                                    "to_date",
                                    moment(e[1]).format("YYYY-MM-DD"),
                                  );
                                }
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col pt-4 ml-4">
                      <div className="w-full input-label mb-1">
                        <span>
                          {t("from_time")}
                          <span className="text-red-600">*</span>
                        </span>
                      </div>
                      <div className="w-3/4">
                        <div>
                          <Form.Item formik={formik} name="from_time">
                            <ReactInputMask
                              id="from_time"
                              maskplaceholder={t("enter.time")}
                              value={values.from_time}
                              mask="99:99"
                              onChange={handleChange}
                              disabled={false}
                            >
                              {(inputProps) => (
                                <Input
                                  {...inputProps}
                                  placeholder={t("enter.time")}
                                  onChange={handleChange}
                                  disabled={false}
                                />
                              )}
                            </ReactInputMask>
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col pt-4">
                      <div className="w-full input-label mb-1">
                        <span>
                          {t("to_time")}
                          <span className="text-red-600">*</span>
                        </span>
                      </div>
                      <div className="w-3/4">
                        <div>
                          <Form.Item formik={formik} name="to_time">
                            <ReactInputMask
                              id="to_time"
                              maskplaceholder={t("enter.time")}
                              value={values.to_time}
                              mask="99:99"
                              onChange={handleChange}
                              disabled={false}
                            >
                              {(inputProps) => (
                                <Input
                                  {...inputProps}
                                  placeholder={t("enter.time")}
                                  onChange={handleChange}
                                  disabled={false}
                                />
                              )}
                            </ReactInputMask>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col">
                    <div className="w-1/4 input-label mb-1">
                      <span>{t("link")}</span>
                      <span className="text-red-600">*</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="url">
                          <Input
                            size="large"
                            id="url"
                            value={values.url}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col">
                    <div className="w-1/4 input-label mb-1">
                      <span>{t("action.text.button")}</span>
                      <span className="text-red-600">*</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="button_ru">
                          <Input
                            size="large"
                            id="button_ru"
                            value={values.button_ru}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/3 flex justify-between items-baseline mr-2">
                      <div className="w-1/4 input-label">
                        <span>{t("status")}</span>
                        <span className="text-red-600">*</span>
                      </div>
                      <div className="w-3/4">
                        <Form.Item formik={formik} name="active">
                          <Switch
                            id="active"
                            checked={values.active}
                            onChange={(e) => setFieldValue("active", e)}
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className=" flex justify-between items-baseline">
                      <div className="w-2/4 input-label">
                        <span>{t("priority")}</span>
                        <span className="text-red-600">*</span>
                      </div>
                      <div>
                        <Form.Item formik={formik} name="order_no">
                          <Input
                            id="order_no"
                            value={values.order_no}
                            onChange={(e) =>
                              setFieldValue("order_no", e.target.value)
                            }
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <div className="grid grid-cols-12 gap-8 mb-14 mt-4">
                <div className="col-span-2 ml-2">
                  <Form.Item formik={formik} name="image">
                    <div className="w-full h-full flex mt-6 items-center flex-col">
                      <Gallery
                        width={160}
                        height={160}
                        gallery={values.image ? [values.image] : []}
                        setGallery={(elm) => setFieldValue("image", elm[0])}
                        multiple={false}
                        extraTitle="650x284"
                      />
                    </div>
                  </Form.Item>
                </div>

                <div className="col-span-10">
                  <div className="w-full flex flex-col">
                    <div className="w-1/4 input-label mb-1">
                      <span>{t("name")}</span>
                      <span className="text-red-600">*</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="title_en">
                          <Input
                            size="large"
                            id="title_en"
                            value={values.title_en}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col">
                    <div className="w-1/4 input-label mb-1">
                      <span>{t("description")}</span>
                      <span className="text-red-600">*</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="about_en">
                          <TextArea
                            id="about_en"
                            {...formik.getFieldProps("about_en")}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-full flex flex-col pt-4 mr-4">
                      <div className="w-1/4 input-label mb-1">
                        <span>{t("time_date")}</span>
                        <span className="text-red-600">*</span>
                      </div>
                      <div className="w-6/8">
                        <div>
                          <Form.Item formik={formik} name="from_date">
                            <RangePicker
                              hideTimePicker
                              placeholder={t("order.period")}
                              dateValue={[
                                values.from_date
                                  ? moment(values.from_date)
                                  : undefined,
                                values.to_date
                                  ? moment(values.to_date)
                                  : undefined,
                              ]}
                              onChange={(e) => {
                                if (e[0] === null) {
                                  setFieldValue("from_date", undefined);
                                  setFieldValue("to_date", undefined);
                                } else {
                                  setFieldValue(
                                    "from_date",
                                    moment(e[0]).format("YYYY-MM-DD"),
                                  );
                                  setFieldValue(
                                    "to_date",
                                    moment(e[1]).format("YYYY-MM-DD"),
                                  );
                                }
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col pt-4 ml-4">
                      <div className="w-full input-label mb-1">
                        <span>{t("from_time")}</span>
                        <span className="text-red-600">*</span>
                      </div>
                      <div className="w-3/4">
                        <div>
                          <Form.Item formik={formik} name="from_time">
                            <ReactInputMask
                              id="from_time"
                              maskplaceholder={t("enter.time")}
                              value={values.from_time}
                              mask="99:99"
                              onChange={handleChange}
                              disabled={false}
                            >
                              {(inputProps) => (
                                <Input
                                  {...inputProps}
                                  placeholder={t("enter.time")}
                                  onChange={handleChange}
                                  disabled={false}
                                />
                              )}
                            </ReactInputMask>
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col pt-4">
                      <div className="w-full input-label mb-1">
                        <span>{t("to_time")}</span>
                        <span className="text-red-600">*</span>
                      </div>
                      <div className="w-3/4">
                        <div>
                          <Form.Item formik={formik} name="to_time">
                            <ReactInputMask
                              id="to_time"
                              maskplaceholder={t("enter.time")}
                              value={values.to_time}
                              mask="99:99"
                              onChange={handleChange}
                              disabled={false}
                            >
                              {(inputProps) => (
                                <Input
                                  {...inputProps}
                                  placeholder={t("enter.time")}
                                  onChange={handleChange}
                                  disabled={false}
                                />
                              )}
                            </ReactInputMask>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col">
                    <div className="w-1/4 input-label mb-1">
                      <span>{t("link")}</span>
                      <span className="text-red-600">*</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="url">
                          <Input
                            size="large"
                            id="url"
                            value={values.url}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col">
                    <div className="w-1/4 input-label mb-1">
                      <span>{t("action.text.button")}</span>
                      <span className="text-red-600">*</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="button_en">
                          <Input
                            size="large"
                            id="button_en"
                            value={values.button_en}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/3 flex justify-between items-baseline mr-2">
                      <div className="w-1/4 input-label">
                        <span>{t("status")}</span>
                        <span className="text-red-600">*</span>
                      </div>
                      <div className="w-3/4">
                        <Form.Item formik={formik} name="active">
                          <Switch
                            id="active"
                            checked={values.active}
                            onChange={(e) => setFieldValue("active", e)}
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className=" flex justify-between items-baseline">
                      <div className="w-2/4 input-label">
                        <span>{t("priority")}</span>
                        <span className="text-red-600">*</span>
                      </div>
                      <div>
                        <Form.Item formik={formik} name="order_no">
                          <Input
                            id="order_no"
                            value={values.order_no}
                            onChange={(e) =>
                              setFieldValue("order_no", e.target.value)
                            }
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <div className="grid grid-cols-12 gap-8 mb-14 mt-4">
                <div className="col-span-2 ml-2">
                  <Form.Item formik={formik} name="image">
                    <div className="w-full h-full flex mt-6 items-center flex-col">
                      <Gallery
                        width={160}
                        height={160}
                        gallery={values.image ? [values.image] : []}
                        setGallery={(elm) => setFieldValue("image", elm[0])}
                        multiple={false}
                        extraTitle="650x284"
                      />
                    </div>
                  </Form.Item>
                </div>

                <div className="col-span-10">
                  <div className="w-full flex flex-col">
                    <div className="w-1/4 input-label mb-1">
                      <span>{t("name")}</span>
                      <span className="text-red-600">*</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="title_uz">
                          <Input
                            size="large"
                            id="title_uz"
                            value={values.title_uz}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col">
                    <div className="w-1/4 input-label mb-1">
                      <span>{t("description")}</span>
                      <span className="text-red-600">*</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="about_uz">
                          <TextArea
                            id="about_uz"
                            {...formik.getFieldProps("about_uz")}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-full flex flex-col pt-4 mr-4">
                      <div className="w-1/4 input-label mb-1">
                        <span>{t("time_date")}</span>
                        <span className="text-red-600">*</span>
                      </div>
                      <div className="w-6/8">
                        <div>
                          <Form.Item formik={formik} name="from_date">
                            <RangePicker
                              hideTimePicker
                              placeholder={t("order.period")}
                              dateValue={[
                                values.from_date
                                  ? moment(values.from_date)
                                  : undefined,
                                values.to_date
                                  ? moment(values.to_date)
                                  : undefined,
                              ]}
                              onChange={(e) => {
                                if (e[0] === null) {
                                  setFieldValue("from_date", undefined);
                                  setFieldValue("to_date", undefined);
                                } else {
                                  setFieldValue(
                                    "from_date",
                                    moment(e[0]).format("YYYY-MM-DD"),
                                  );
                                  setFieldValue(
                                    "to_date",
                                    moment(e[1]).format("YYYY-MM-DD"),
                                  );
                                }
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col pt-4 ml-4">
                      <div className="w-full input-label mb-1">
                        <span>{t("from_time")}</span>
                        <span className="text-red-600">*</span>
                      </div>
                      <div className="w-3/4">
                        <div>
                          <Form.Item formik={formik} name="from_time">
                            <ReactInputMask
                              id="from_time"
                              maskplaceholder={t("enter.time")}
                              value={values.from_time}
                              mask="99:99"
                              onChange={handleChange}
                              disabled={false}
                            >
                              {(inputProps) => (
                                <Input
                                  {...inputProps}
                                  placeholder={t("enter.time")}
                                  onChange={handleChange}
                                  disabled={false}
                                />
                              )}
                            </ReactInputMask>
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col pt-4">
                      <div className="w-full input-label mb-1">
                        <span>{t("to_time")}</span>
                        <span className="text-red-600">*</span>
                      </div>
                      <div className="w-3/4">
                        <div>
                          <Form.Item formik={formik} name="to_time">
                            <ReactInputMask
                              id="to_time"
                              maskplaceholder={t("enter.time")}
                              value={values.to_time}
                              mask="99:99"
                              onChange={handleChange}
                              disabled={false}
                            >
                              {(inputProps) => (
                                <Input
                                  {...inputProps}
                                  placeholder={t("enter.time")}
                                  onChange={handleChange}
                                  disabled={false}
                                />
                              )}
                            </ReactInputMask>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col">
                    <div className="w-1/4 input-label mb-1">
                      <span>{t("link")}</span>
                      <span className="text-red-600">*</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="url">
                          <Input
                            size="large"
                            id="url"
                            value={values.url}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col">
                    <div className="w-1/4 input-label mb-1">
                      <span>{t("action.text.button")}</span>
                      <span className="text-red-600">*</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="button_uz">
                          <Input
                            size="large"
                            id="button_uz"
                            value={values.button_uz}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/3 flex justify-between items-baseline mr-2">
                      <div className="w-1/4 input-label">
                        <span>{t("status")}</span>
                        <span className="text-red-600">*</span>
                      </div>
                      <div className="w-3/4">
                        <Form.Item formik={formik} name="active">
                          <Switch
                            id="active"
                            checked={values.active}
                            onChange={(e) => setFieldValue("active", e)}
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className=" flex justify-between items-baseline">
                      <div className="w-2/4 input-label">
                        <span>{t("priority")}</span>
                        <span className="text-red-600">*</span>
                      </div>
                      <div>
                        <Form.Item formik={formik} name="order_no">
                          <Input
                            id="order_no"
                            value={values.order_no}
                            onChange={(e) =>
                              setFieldValue("order_no", e.target.value)
                            }
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </SwipeableViews>
        </Card>
        <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-4 gap-5">
          <Button
            icon={CancelIcon}
            size="large"
            shape="outlined"
            color="red"
            iconClassName="red"
            borderColor="bordercolor"
            onClick={() => history.goBack()}
          >
            {t("cancel")}
          </Button>

          <Button
            icon={SaveIcon}
            size="large"
            type="submit"
            // loading={btnDisabled}
          >
            {t(id ? "save" : "create")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePopUp;
