import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { getReview, postReview, updateReview } from "services";
import CustomSkeleton from "components/Skeleton";
import Filters from "components/Filters";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";

import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import { useTheme } from "@mui/material/styles";
import TabPanel from "components/Tab/TabPanel";
import Select from "components/Select";
import genSelectOption from "helpers/genSelectOption";
import Switch from "components/Switch";

export default function ReviewsCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [value, setValue] = useState(0);

  const initialValues = useMemo(
    () => ({
      message: {
        uz: "",
        ru: "",
      },
      related_subject: null,
      type: null,
      active: true,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      message: defaultSchema,
      related_subject: defaultSchema,
      type: defaultSchema,
    });
  }, [t]);

  const onSubmit = (values) => {
    const data = {
      ...values,
      related_subject: values.related_subject.value,
      type: values.type.value,
      active: values.active,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateReview(params.id, data)
      : postReview(data);
    selectedAction
      .then((res) => {
        history.goBack();
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik;

  const routes = [
    {
      title: t(`reviews`),
      link: true,
      route: `/home/settings/content/reviews`,
    },
    {
      title: params.id ? t("edit") : t("create"),
    },
  ];

  useEffect(() => {
    if (params.id) {
      getReview(params.id)
        .then((res) => {
          setValues({
            message: res?.message,
            related_subject: {
              label: t(res?.related_subject),
              value: res?.related_subject,
            },
            type: {
              label: res?.type,
              value: res?.type,
            },
            active: res?.active,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [params.id, setValues]);

  const handleTabChange = (event, newValue) => setValue(newValue);

  const handleChangeIndex = (index) => setValue(index);

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };
  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );
  const refers = ["operator", "courier", "delivery_time", "meal"];
  const typeOfComment = ["dislike", "like"];

  return !isLoading ? (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <div>
          <Header startAdornment={[<Breadcrumb routes={routes} />]} />
          <Filters>
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
                    <img src={UzIcon} alt="uzb logo" width="20" height="20" />{" "}
                    {tabLabel(t("uzbek"))}
                  </span>
                }
                {...a11yProps(0)}
                style={{ width: "150px" }}
              />
              <StyledTab
                label={
                  <span className="flex justify-around items-center">
                    <img src={RuIcon} alt="uzb logo" width="20" height="20" />{" "}
                    {tabLabel(t("russian"))}
                  </span>
                }
                {...a11yProps(1)}
                style={{ width: "150px" }}
              />
            </StyledTabs>
          </Filters>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <div className="m-4">
                <div className="grid grid-cols-2 gap-5">
                  <Card title={t("Заполните поля")}>
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="input-label">{t("description")}</div>
                        <div className="col-span-2">
                          <Form.Item formik={formik} name="message">
                            <Input
                              size="large"
                              value={values.message?.uz}
                              onChange={handleChange}
                              name="message.uz"
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div>
                        <div className="input-label">Относится к</div>
                        <div className="col-span-2">
                          <Form.Item
                            formik={formik}
                            name="referelated_subjectrs"
                          >
                            <Select
                              height={40}
                              options={genSelectOption(refers)}
                              value={values.related_subject}
                              onChange={(val) => {
                                setFieldValue("related_subject", val);
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div>
                        <div className="input-label">{t("type")}</div>
                        <div className="col-span-2">
                          <Form.Item formik={formik} name="type">
                            <Select
                              height={40}
                              defaultValue={genSelectOption(typeOfComment)[0]}
                              options={genSelectOption(typeOfComment)}
                              value={values.type}
                              useZIndex
                              onChange={(val) => {
                                setFieldValue("type", val);
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div>
                        <div className="input-label">{t("active")}</div>
                        <div className="col-span-2">
                          <Form.Item formik={formik} name="type">
                            <Switch
                              checked={values.active}
                              onChange={(val) => setFieldValue("active", val)}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <div className="m-4">
                <div className="grid grid-cols-2 gap-5">
                  <Card title={t("Заполните поля")}>
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="input-label">{t("description")}</div>
                        <div className="col-span-2">
                          <Form.Item formik={formik} name="message">
                            <Input
                              size="large"
                              value={values.message?.ru}
                              onChange={handleChange}
                              name="message.ru"
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div>
                        <div className="input-label">Относится к</div>
                        <div className="col-span-2">
                          <Form.Item formik={formik} name="related_subject">
                            <Select
                              height={40}
                              options={genSelectOption(refers)}
                              value={values.related_subject}
                              onChange={(val) => {
                                setFieldValue("related_subject", val);
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div>
                        <div className="input-label">{t("type")}</div>
                        <div className="col-span-2">
                          <Form.Item formik={formik} name="type">
                            <Select
                              height={40}
                              options={genSelectOption(typeOfComment)}
                              value={values.type}
                              onChange={(val) => {
                                setFieldValue("type", val);
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div>
                        <div className="input-label">{t("active")}</div>
                        <div className="col-span-2">
                          <Form.Item formik={formik} name="type">
                            <Switch
                              checked={values.active}
                              onChange={handleChange}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabPanel>
          </SwipeableViews>
        </div>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          <Button
            icon={CancelIcon}
            size="large"
            shape="outlined"
            color="red"
            borderColor="bordercolor"
            onClick={() => history.goBack()}
          >
            {t("cancel")}
          </Button>
          <Button
            icon={SaveIcon}
            size="large"
            type="submit"
            loading={saveLoading}
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </form>
  ) : (
    <CustomSkeleton />
  );
}
