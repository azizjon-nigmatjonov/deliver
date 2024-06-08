import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import {
  getMeasurement,
  postMeasurement,
  updateMeasurement,
} from "services/v2";
import genSelectOption from "helpers/genSelectOption";
import CustomSkeleton from "components/Skeleton";
import Russian from "./tabs/Russian";
import English from "./tabs/English";
import Uzbek from "./tabs/Uzbek";
import SwipeableViews from "react-swipeable-views";
import Filters from "components/Filters";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
import { useTheme } from "@mui/material/styles";

export default function UnitsCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const theme = useTheme();

  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      getMeasurement(params.id)
        .then((res) => {
          setValues({
            unit_ru: genSelectOption(res?.title.ru),
            unit_en: genSelectOption(res?.title.en),
            unit_uz: genSelectOption(res?.title.uz),
            reduction_ru: res?.short_name,
            accuracy: genSelectOption(res?.accuracy),
            code: res?.code,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [params.id]);

  const initialValues = useMemo(
    () => ({
      unit_ru: "",
      unit_en: "",
      unit_uz: "",
      reduction_ru: "",
      accuracy: "",
      code: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      unit_ru: defaultSchema,
      unit_en: defaultSchema,
      unit_uz: defaultSchema,
      accuracy: defaultSchema,
    });
  }, [t]);

  const onSubmit = (values) => {
    const data = {
      title: {
        ru: values.unit_ru.value,
        uz: values.unit_uz.value,
        en: values.unit_en.value,
      },
      short_name: values.reduction_ru,
      accuracy: +values.accuracy.value,
      code: values.code,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateMeasurement(params.id, data)
      : postMeasurement(data);
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
      title: t(`unit`),
      link: true,
      route: `/home/catalog/units`,
    },
    {
      title: params.id ? t("edit") : t("create"),
    },
  ];
  console.log("values12", values);
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

  return !isLoading ? (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <div>
          <Header startAdornment={<Breadcrumb routes={routes} />} />
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
          </Filters>

          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Russian
                formik={formik}
                values={values}
                setFieldValue={setFieldValue}
                handleChange={handleChange}
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <English
                formik={formik}
                values={values}
                setFieldValue={setFieldValue}
                handleChange={handleChange}
              />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <Uzbek
                formik={formik}
                values={values}
                setFieldValue={setFieldValue}
                handleChange={handleChange}
              />
            </TabPanel>
          </SwipeableViews>
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
