import { useMemo, useState, useEffect } from "react";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import { useTranslation } from "react-i18next";
import Russian from "./Russian";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import TabPanel from "components/Tab/TabPanel";
import English from "./English";
import Uzbek from "./Uzbek";
import Modal from "components/Modal";
import { useFormik } from "formik";
import * as yup from "yup";
import { updateProperty, getProperty } from "services/v2";

const AddOptionsModal = ({ attribute, open, setOptionModal }) => {
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const theme = useTheme();
  const [loader, setLoader] = useState(false);

  const initialValues = useMemo(
    () => ({
      id: "",
      title: {
        ru: "",
        uz: "",
        en: "",
      },
      description: {
        ru: "",
        uz: "",
        en: "",
      },
      active: "",
      options: [
        {
          title: {
            uz: "",
            ru: "",
            en: "",
          },
        },
      ],
    }),
    [],
  );

  const handleTabChange = (event, newValue) => setValue(newValue);

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };
  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  const onSubmit = (values) => {
    const data = {
      title: {
        ru: values.title_ru,
        uz: values.title_uz,
        en: values.title_en,
      },
      description: {
        ru: values.description_ru,
        uz: values.description_uz,
        en: values.description_en,
      },
      active: values.active,
      options: values.options,
    };

    updateProperty(attribute?.id, data)
      .then(() => {
        setOptionModal(false);
      })
      .catch((error) => console.log(error));
  };

  const validationSchema = () => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      title_ru: defaultSchema,
      title_en: defaultSchema,
      title_uz: defaultSchema,
      description_ru: defaultSchema,
      description_en: defaultSchema,
      description_uz: defaultSchema,
      options: yup.array().of(
        yup
          .object()
          .required(t("required.field"))
          .shape({
            title: yup.object().shape({
              uz: defaultSchema,
              ru: defaultSchema,
              en: defaultSchema,
            }),
          }),
      ),
    });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { isValid, errors, setValues, handleSubmit } = formik;

  useEffect(() => {
    if (attribute?.id) {
      setLoader(true);
      getProperty(attribute?.id)
        .then((res) => {
          setValues({
            title_ru: res?.title?.ru,
            title_en: res?.title?.en,
            title_uz: res?.title?.uz,
            description_ru: res?.description?.ru,
            description_en: res?.description?.en,
            description_uz: res?.description?.uz,
            active: res?.active,
            options: res?.options?.map((option) => ({
              id: option.id,
              title: {
                uz: option.title.uz,
                en: option.title.en,
                ru: option.title.ru,
              },
            })),
          });
        })
        .catch((e) => console.log(e))
        .finally(() => setLoader(false));
    }
  }, [attribute.id, setValues]);

  return (
    <Modal
      title={t("add.option")}
      width={550}
      open={open && attribute?.id}
      onClose={() => setOptionModal(false)}
      isWarning={false}
      confirm={t("add.option")}
      close={t("cancel")}
      onConfirm={() => handleSubmit()}
    >
      <StyledTabs
        value={value}
        onChange={handleTabChange}
        centered={false}
        aria-label="full width tabs example"
        TabIndicatorProps={{ children: <span className="w-2" /> }}
        className="border-b justify-around"
      >
        <StyledTab
          label={
            <span className="flex justify-around items-center">
              <img src={RuIcon} alt="uzb logo" width="20" height="20" />{" "}
              {tabLabel(t("russian"))}
              {!isValid &&
                errors?.options?.map((error) => (
                  <span className="text-red-600 text-lg animate-pulse">
                    {error?.title?.ru && "!"}
                  </span>
                ))}
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
              {!isValid &&
                errors?.options?.map((error) => (
                  <span className="text-red-600 text-lg animate-pulse">
                    {error?.title?.en && "!"}
                  </span>
                ))}
            </span>
          }
          {...a11yProps(1)}
          style={{ width: "150px" }}
        />
        <StyledTab
          label={
            <span className="flex justify-around items-center">
              <img src={UzIcon} alt="uzb logo" width="20" height="20" />
              {tabLabel(t("uzbek"))}
              {!isValid &&
                errors?.options?.map((error) => (
                  <span className="text-red-600 text-lg animate-pulse">
                    {error?.title?.uz && "!"}
                  </span>
                ))}
            </span>
          }
          {...a11yProps(2)}
          style={{ width: "150px" }}
        />
      </StyledTabs>

      {!loader && (
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Russian formik={formik} />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <English formik={formik} />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Uzbek formik={formik} />
          </TabPanel>
        </SwipeableViews>
      )}
    </Modal>
  );
};

export default AddOptionsModal;
