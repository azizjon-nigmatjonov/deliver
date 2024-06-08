import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import Header from "components/Header";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { showAlert } from "redux/actions/alertActions";
import * as yup from "yup";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import GeneralInformation from "./GeneralInformation";
import CustomSkeleton from "components/Skeleton";
import {
  getPromo,
  postPromo,
  updatePromo,
} from "../../../../services/promotion";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CategoryCreate() {
  const { id } = useParams();
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();

  const [buttonLoader, setButtonLoader] = useState(false);
  const [loader, setLoader] = useState(true);

  const fetchData = () => {
    setLoader(true);
    if (!id) return setLoader(false);
    getPromo(id)
      .then((res) => {
        formik.setValues({
          description_ru: res?.description.ru,
          description_uz: res?.description.uz,
          description_en: res?.description.en,
          image: res?.image.replace("https://test.cdn.delever.uz/delever/", ""),
          title_ru: res?.title.ru,
          title_uz: res?.title.uz,
          title_en: res?.title.en,
          start_date: moment.unix(res?.start_time).format("YYYY-MM-DD"),
          end_date: moment.unix(res?.end_time).format("YYYY-MM-DD"),
          is_active: res?.is_active,
        });
      })
      .finally(() => setLoader(false));
  };

  const saveChanges = (data) => {
    setButtonLoader(true);
    if (id) {
      updatePromo(id, data)
        .then(() => history.go(-1))
        .catch((err) =>
          dispatch(showAlert(t(err?.data?.Error?.Message ?? err?.data?.Error))),
        )
        .finally(() => setButtonLoader(false));
    } else {
      postPromo(data)
        .then(() => history.go(-1))
        .catch((err) =>
          dispatch(showAlert(t(err.data?.Error?.Message ?? err?.data?.Error))),
        )
        .finally(() => setButtonLoader(false));
    }
  };

  const onSubmit = (data) => {
    const value = {
      description: {
        ru: values.description_ru,
        uz: values.description_uz,
        en: values.description_en,
      },
      image: values.image,
      is_active: values.is_active,
      title: {
        ru: values.title_ru,
        uz: values.title_uz,
        en: values.title_en,
      },
      start_time: moment(data.start_date).unix().toString(),
      end_time: moment(data.end_date).unix().toString(),
    };
    saveChanges(value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const initialValues = useMemo(
    () => ({
      description_ru: "",
      description_uz: "",
      description_en: "",
      image: "",
      title_ru: "",
      title_uz: "",
      title_en: "",
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
  }, []);

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  const headerTitle = useMemo(() => {
    return [
      <div className="flex">
        <ArrowBackIcon
          onClick={() => history.goBack()}
          className="cursor-pointer"
        />
        <p className="ml-3">{t("add.stock")}</p>
      </div>,
    ];
  }, []);

  // Tabs

  const handleChangeIndex = (index) => setValue(index);

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
                <Header title={headerTitle} />
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
              <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-4 gap-5">
                {" "}
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
