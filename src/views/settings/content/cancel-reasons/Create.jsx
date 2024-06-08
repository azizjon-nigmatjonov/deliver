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
import { useTheme } from "@mui/material/styles";
import {
  getCancelingReason,
  postCancelingReason,
  updateCancelingReason,
} from "services";
import CustomSkeleton from "components/Skeleton";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import TextArea from "components/Textarea";

export default function CancelReasonsCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const theme = useTheme();

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const initialValues = useMemo(
    () => ({
      text: "",
      text_for_client: {
        uz: "",
        en: "",
        ru: "",
      },
    }),
    [],
  );

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateCancelingReason(params.id, data)
      : postCancelingReason(data);
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
  });

  const { values, handleChange, setValues, handleSubmit } = formik;

  const routes = [
    {
      title: t(`cancel-reasons`),
      link: true,
      route: `/home/settings/content/cancel-reasons`,
    },
    {
      title: params.id ? t("edit") : t("create"),
    },
  ];

  const headerButtons = (
    <>
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
      <Button icon={SaveIcon} size="large" type="submit" loading={saveLoading}>
        {t("save")}
      </Button>
    </>
  );

  useEffect(() => {
    if (params.id) {
      getCancelingReason(params.id)
        .then((res) => {
          setValues({
            text: res?.text,
            text_for_client: {
              uz: res?.text_for_client?.uz,
              ru: res?.text_for_client?.ru,
              en: res?.text_for_client?.en,
            },
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [params.id, setValues]);

  return !isLoading ? (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <div>
          <Header
            title={params.id ? t("edit") : t("add")}
            startAdornment={<Breadcrumb routes={routes} />}
          />
          <div className="m-4">
            <div className="grid grid-cols-2 gap-5">
              <Card title={t("general.information")}>
                <div className="flex flex-col items-baseline">
                  <div className="input-label">{t("name")}</div>
                  <div className="w-full">
                    <Form.Item formik={formik} name="text">
                      <Input
                        size="large"
                        value={values.text}
                        onChange={handleChange}
                        name="text"
                        placeholder={t("input")}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div>
                  <StyledTabs
                    value={value}
                    onChange={handleChangeTab}
                    centered={false}
                    aria-label="full width tabs example"
                    TabIndicatorProps={{ children: <span className="w-2" /> }}
                    className="border-b mb-4"
                  >
                    <StyledTab
                      label={
                        <span className="flex justify-around items-center">
                          {tabLabel(t("uz"))}
                        </span>
                      }
                      {...a11yProps(0)}
                    />
                    <StyledTab
                      label={
                        <span className="flex justify-around items-center">
                          {tabLabel(t("ru"))}
                        </span>
                      }
                      {...a11yProps(1)}
                    />
                    <StyledTab
                      label={
                        <span className="flex justify-around items-center">
                          {tabLabel(t("en"))}
                        </span>
                      }
                      {...a11yProps(2)}
                    />
                  </StyledTabs>
                  <SwipeableViews
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                  >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                      <div className="input-label">{t("text_for_client")}</div>
                      <div className="w-full">
                        <Form.Item formik={formik} name="text_for_client.uz">
                          <TextArea
                            id="text_for_client.uz"
                            {...formik.getFieldProps("text_for_client.uz")}
                          />
                        </Form.Item>
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                      <div className="input-label">{t("text_for_client")}</div>
                      <div className="w-full">
                        <Form.Item formik={formik} name="text_for_client.ru">
                          <TextArea
                            id="text_for_client.ru"
                            {...formik.getFieldProps("text_for_client.ru")}
                          />
                        </Form.Item>
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                      <div className="input-label">{t("text_for_client")}</div>
                      <div className="w-full">
                        <Form.Item formik={formik} name="text_for_client.en">
                          <TextArea
                            id="text_for_client.en"
                            {...formik.getFieldProps("text_for_client.en")}
                          />
                        </Form.Item>
                      </div>
                    </TabPanel>
                  </SwipeableViews>
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          {headerButtons}
        </div>
      </div>
    </form>
  ) : (
    <CustomSkeleton />
  );
}
