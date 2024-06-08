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
import { getTag, postTag, updateTag } from "services/v2";
import Select from "components/Select";
import { colors } from "./tags";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
import genSelectOption from "helpers/genSelectOption";
import CustomSkeleton from "components/Skeleton";

export default function TagsCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [value, setValue] = useState(0);

  const initialValues = useMemo(
    () => ({
      title: {
        ru: "",
        uz: "",
        en: "",
      },
      color: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      title: defaultSchema,
      color: defaultSchema,
    });
  }, [t]);

  const onSubmit = (values) => {
    const data = {
      ...values,
      color: values.color.value,
      icon: "",
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateTag(params.id, data)
      : postTag(data);
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
      title: t(`tags`),
      link: true,
      route: `/home/catalog/tags`,
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
      getTag(params.id)
        .then((res) => {
          setValues({
            title: res?.title,
            color: genSelectOption(res?.color),
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [params.id, setValues]);

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleTabChange = (event, newValue) => setValue(newValue);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  return !isLoading ? (
    <form onSubmit={handleSubmit}>
      <Header startAdornment={<Breadcrumb routes={routes} />} />
      <div
        style={{ minHeight: "calc(100vh - 56px)" }}
        className="flex flex-col"
      >
        <Card
          className="w-1/2 flex flex-col gap-4 m-4 flex-1"
          bodyStyle={{ paddingTop: 0 }}
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
            />
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={EnIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("english"))}
                </span>
              }
              {...a11yProps(1)}
            />
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={UzIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("uzbek"))}
                </span>
              }
              {...a11yProps(2)}
            />
          </StyledTabs>
          <Form.Item
            formik={formik}
            name={`title.${value === 0 ? "ru" : value === 1 ? "en" : "uz"}`}
            label={t("name")}
            className="my-4"
          >
            <Input
              style={{ paddingTop: 4, paddingBottom: 4 }}
              size="large"
              value={
                values.title[value === 0 ? "ru" : value === 1 ? "en" : "uz"]
              }
              onChange={handleChange}
              name={`title.${value === 0 ? "ru" : value === 1 ? "en" : "uz"}`}
            />
          </Form.Item>
          <Form.Item formik={formik} name="color" label={t("color")}>
            <Select
              options={genSelectOption(colors)}
              value={values.color}
              onChange={(val) => setFieldValue("color", val)}
            />
          </Form.Item>
        </Card>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          {headerButtons}
        </div>
      </div>
    </form>
  ) : (
    <CustomSkeleton />
  );
}
