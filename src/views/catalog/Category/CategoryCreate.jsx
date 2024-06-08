import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { getCategory, postCategory, updateCategory } from "services/v2";
import { useParams } from "react-router-dom";
import Header from "components/Header";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { showAlert } from "redux/actions/alertActions";
import * as yup from "yup";
import Filters from "components/Filters";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import GeneralInformation from "./tabs/GeneralInformation";
import CustomSkeleton from "components/Skeleton";

export default function CategoryCreate() {
  const { id } = useParams();
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const lang = useSelector((state) => state.lang.current);

  const [buttonLoader, setButtonLoader] = useState(false);
  const [loader, setLoader] = useState(true);

  const fetchData = () => {
    setLoader(true);
    if (!id) return setLoader(false);
    getCategory(id, {})
      .then((res) => {
        formik.setValues({
          active: res?.active,
          description_ru: res?.description.ru,
          description_uz: res?.description.uz,
          description_en: res?.description.en,
          image: res?.image,
          title_ru: res?.title.ru,
          title_uz: res?.title.uz,
          title_en: res?.title.en,
          order_no: res?.order_no,
        });
        if (res?.parent !== null)
          setFieldValue("category_id", {
            label: res?.parent?.title?.[lang],
            value: res?.parent.id,
          });
      })
      .finally(() => setLoader(false));
  };

  const saveChanges = (data) => {
    setButtonLoader(true);
    if (id) {
      updateCategory(id, data)
        .catch((err) =>
          dispatch(showAlert(t(err?.Error?.Message ?? err?.Error))),
        )
        .then(() => history.push("/home/catalog/category"))
        .finally(() => setButtonLoader(false));
    } else {
      postCategory(data)
        .catch((err) =>
          dispatch(showAlert(t(err?.Error?.Message ?? err?.Error))),
        )
        .then(() => history.push("/home/catalog/category"))
        .finally(() => setButtonLoader(false));
    }
  };

  const onSubmit = (values) => {
    const data = {
      active: values.active,
      description: {
        ru: values.description_ru,
        uz: values.description_uz,
        en: values.description_en,
      },
      order_no: values.order_no || null,
      image: values.image,
      title: {
        ru: values.title_ru,
        uz: values.title_uz,
        en: values.title_en,
      },
      parent_id: values.category_id !== "" ? values?.category_id?.value : "",
    };
    saveChanges(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const initialValues = useMemo(
    () => ({
      description_ru: null,
      description_uz: null,
      description_en: null,
      image: null,
      title_ru: null,
      title_uz: null,
      title_en: null,
      category_id: "",
      order_no: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));

    return yup.object().shape({
      title_ru: defaultSchema,
      title_uz: defaultSchema,
      title_en: defaultSchema,
    });
  }, [t]);

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  const routes = [
    {
      title: <div>{t("Sales")}</div>,
      link: true,
      route: `/home/catalog/category`,
    },
    {
      title: id ? t("edit") : t("create"),
    },
  ];

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

  return (
    <>
      {loader ? (
        <CustomSkeleton />
      ) : (
        <>
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
                  >
                    <StyledTab
                      label={tabLabel(t("general.information"))}
                      {...a11yProps(0)}
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
                    <GeneralInformation
                      formik={formik}
                      handleChange={handleChange}
                      values={values}
                      setFieldValue={setFieldValue}
                    />
                  </TabPanel>
                </SwipeableViews>
              </div>

              <div className="sticky bottom-0 overflow-hidden flex justify-end items-center w-full bg-white p-4 gap-5">
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
                  loading={buttonLoader}
                >
                  {t(id ? "save" : "create")}
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
}
