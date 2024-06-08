import { useEffect, useMemo, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import {
  getTgbotStngs,
  postTgbotStngs,
  updateTgbotStngs,
} from "services/v2/tgbot";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
// MUI
import { useTheme } from "@mui/material/styles";
// Assets
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
// Components
import { StyledTabs, StyledTab } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import Form from "components/Form/Index";
import Gallery from "components/Gallery";
import Switch from "components/Switch";
import Select from "components/Select";
import BaseFields from "../BaseFields";
import Input from "components/Input";
import Card from "components/Card";
import English from "./English";
import Russian from "./Russian";
import Uzbek from "./Uzbek";
import { Box } from "@mui/material";
import Button from "components/Button/Buttonv2";

export default function Settings() {
  const { t } = useTranslation();
  const { shipper_id } = useSelector((state) => state.auth);

  const [lang, setLang] = useState(0);
  const [hasSettings, setHasSettings] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const initialValues = useMemo(
    () => ({
      about_us: {
        en: "",
        ru: "",
        uz: "",
      },
      about_us_image: "",
      bot_language: [],
      delivery_type: [],
      is_animate: false,
      main_menu_buttons: [],
      menu_link: {
        en: "",
        ru: "",
        uz: "",
      },
      order_confirmation_text_delivery: {
        en: "",
        ru: "",
        uz: "",
      },
      order_confirmation_text_self_pickup: {
        en: "",
        ru: "",
        uz: "",
      },
      payment_type: [],
      shipper_id: shipper_id,
      show_category_image: true,
      tg_chat_id: "",
      use_web_app: true,
      web_app_url: "",
    }),
    [shipper_id],
  );

  const dispatch = useDispatch();
  const theme = useTheme();

  const languages = ["en", "ru", "uz"];
  const menuButtons = [
    {
      label: t("give_feedback"),
      value: "feedback",
    },
    {
      label: t("nearest_branch"),
      value: "nearest_branch",
    },
    {
      label: t("stock"),
      value: "sale",
    },
    {
      label: t("branches"),
      value: "branches",
    },
    {
      label: t("settings"),
      value: "settings",
    },
    {
      label: t("my_orders"),
      value: "my_orders",
    },
    {
      label: t("about_us"),
      value: "about_us",
    },
    {
      label: t("vacancies"),
      value: "vacancies",
    },
    {
      label: t("news"),
      value: "news",
    },
    {
      label: t("events"),
      value: "events",
    },
  ];

  // Object to store error messages for each field
  const fieldErrorMessages = {
    // menu_link: t("enter_correct_url"),
    // order_confirmation_text_delivery: t("enter_order_text_delivery"),
    // order_confirmation_text_self_pickup: t("enter_order_text_pickup"),
    delivery_type: t("select_order_type"),
    bot_language: t("select_lang"),
    payment_type: t("select_payment_type"),
    // about_us: t("enter_about"),
    tg_chat_id: t("enter_tg_chat_id"),
  };

  // Function to check if a URL is valid
  const isValidUrl = (url) => url.includes("telegra.ph/");

  // Main validation function
  const validateForm = (values) => {
    for (const field in fieldErrorMessages) {
      if (Array.isArray(values[field]) && !values[field].length) {
        dispatch(showAlert(fieldErrorMessages[field], "error"));
        return false;
      } else if (
        typeof values[field] === "object" &&
        !Array.isArray(values[field])
      ) {
        const links = languages.map((lang) => values[field][lang]);
        const isValidLinks = links.every((link) => !!link && isValidUrl(link));
        if (!isValidLinks) {
          dispatch(showAlert(fieldErrorMessages[field], "success"));
          return false;
        }
      } else if (!values[field]) {
        dispatch(showAlert(fieldErrorMessages[field], "error"));
        return false;
      }
    }
    return true;
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
      delivery_type:
        values.delivery_type.length > 0
          ? values.delivery_type.map((item) => item.value)
          : null,
      main_menu_buttons:
        values.delivery_type.length > 0
          ? values.main_menu_buttons.map((item) => item.value)
          : null,
      order_confirmation_text_self_pickup: !values
        .order_confirmation_text_self_pickup.uz
        ? {}
        : values.order_confirmation_text_self_pickup,
      order_confirmation_text_delivery: !values.order_confirmation_text_delivery
        .uz
        ? {}
        : values.order_confirmation_text_delivery,
      menu_link: !values.menu_link.uz ? {} : values.menu_link,
    };
    if (!validateForm(data)) return;
    saveChanges(data);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  const { setValues, values, setFieldValue, handleSubmit } = formik;

  useEffect(() => {
    const getSettingsData = async () => {
      try {
        const response = await getTgbotStngs(shipper_id);
        setHasSettings(true);
        setValues({
          ...response,
          delivery_type: response?.delivery_type?.map((item) => ({
            label: t(item),
            value: item,
          })),
          main_menu_buttons: response?.main_menu_buttons?.map((item) => ({
            label: t(
              item === "feedback"
                ? "give_feedback"
                : item === "sale"
                ? "stock"
                : item,
            ),
            value: item,
          })),
        });
      } catch (error) {
        setHasSettings(false);
      }
    };
    getSettingsData();
  }, [shipper_id, t, setValues]);

  const saveChanges = (data) => {
    setBtnDisabled(true);
    hasSettings
      ? updateTgbotStngs(shipper_id, data)
          .then(() => dispatch(showAlert(t("successfully.saved"), "success")))
          .finally(() => setBtnDisabled(false))
      : postTgbotStngs(data)
          .then(() => dispatch(showAlert(t("successfully.saved"), "success")))
          .finally(() => setBtnDisabled(false));
  };

  const handleTabChange = (event, newValue) => setLang(newValue);

  const handleChangeIndex = (index) => setLang(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 1.5,
            p: 2,
          }}
        >
          <Card
            bodyClass="flex flex-col gap-4"
            style={{ height: "fit-content" }}
            title={t("settings")}
          >
            <div>
              <div className="input-label">
                <span>{t("Language")}</span>
              </div>
              <Form.Item formik={formik} name="bot_language">
                <Select
                  isMulti
                  height={40}
                  id="bot_language"
                  options={[
                    {
                      label: "Русский",
                      value: "ru",
                    },
                    {
                      label: "English",
                      value: "en",
                    },
                    {
                      label: "O’zbekcha",
                      value: "uz",
                    },
                  ]}
                  value={values.bot_language}
                  onChange={(val) => {
                    setFieldValue("bot_language", val);
                  }}
                />
              </Form.Item>
            </div>
            <div>
              <div className="input-label">
                <span>{t("main_menu")}</span>
              </div>
              <Form.Item formik={formik} name="main_menu_buttons">
                <Select
                  isMulti
                  height={40}
                  id="main_menu_buttons"
                  options={menuButtons}
                  value={values.main_menu_buttons}
                  onChange={(val) => {
                    setFieldValue("main_menu_buttons", val);
                  }}
                />
              </Form.Item>
            </div>
            <div>
              <div className="input-label">
                <span>{t("order.type")}</span>
              </div>
              <Form.Item formik={formik} name="delivery_type">
                <Select
                  isMulti
                  height={40}
                  id="delivery_type"
                  options={[
                    {
                      label: t("delivery"),
                      value: "delivery",
                    },
                    {
                      label: t("self_pickup"),
                      value: "self_pickup",
                    },
                  ]}
                  value={values.delivery_type}
                  onChange={(val) => {
                    setFieldValue("delivery_type", val);
                  }}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                formik={formik}
                name="payment_type"
                label={t("payment.type")}
              >
                <Select
                  isMulti
                  height={40}
                  id="payment_type"
                  options={[
                    {
                      label: t("cash"),
                      value: "cash",
                    },
                    {
                      label: "Payme",
                      value: "payme",
                    },
                    {
                      label: "Click",
                      value: "click",
                    },
                    {
                      label: "Apelsin",
                      value: "apelsin",
                    },
                  ]}
                  value={values.payment_type}
                  onChange={(val) => {
                    setFieldValue("payment_type", val);
                  }}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                formik={formik}
                name="tg_chat_id"
                label={t("tg.chat.id")}
                required
              >
                <Input
                  type="text"
                  id="tg_chat_id"
                  value={values.tg_chat_id}
                  onChange={({ target: { value } }) => {
                    setFieldValue("tg_chat_id", value);
                  }}
                />
              </Form.Item>
            </div>
            <div>
              <div className="input-label text-sm">
                <p>{t("display_category_photo")}</p>
              </div>

              <div className="flex gap-3 text-sm">
                <p>{t("enable_category_photo_visibility")}</p>
                <div className="w-1/4">
                  <Form.Item formik={formik} name="show_category_image">
                    <Switch
                      checked={values.show_category_image}
                      onChange={() => {
                        setFieldValue(
                          "show_category_image",
                          !values.show_category_image,
                        );
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div>
              <div className="input-label text-sm">
                <p>Web app версия</p>
              </div>

              <div className="flex gap-3 text-sm">
                <p>Включить Web app версию</p>
                <div className="w-1/4">
                  <Form.Item formik={formik} name="use_web_app">
                    <Switch
                      checked={values.use_web_app}
                      onChange={() => {
                        setFieldValue("use_web_app", !values.use_web_app);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            {values.use_web_app && (
              <div>
                <div className="input-label text-sm">
                  <p>Анимационные картины</p>
                </div>

                <div className="flex gap-3 text-sm">
                  <p>Выключить анимационные картины</p>
                  <div className="w-1/4">
                    <Form.Item formik={formik} name="is_animate">
                      <Switch
                        checked={values.is_animate}
                        onChange={() =>
                          setFieldValue("is_animate", !values.is_animate)
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            )}
            <div>
              <Form.Item
                formik={formik}
                name="web_app_url"
                label="Ссылка для Web app"
                required={values.use_web_app}
              >
                <Input
                  type="text"
                  id="web_app_url"
                  value={values.web_app_url}
                  onChange={({ target: { value } }) => {
                    setFieldValue("web_app_url", value);
                  }}
                />
              </Form.Item>
            </div>
          </Card>
          <Card title={t("Контент")}>
            <StyledTabs
              value={lang}
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
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={lang}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={lang} index={0} dir={theme.direction}>
                <BaseFields lang={<Russian />} formik={formik} />
              </TabPanel>
              <TabPanel value={lang} index={1} dir={theme.direction}>
                <BaseFields lang={<English />} formik={formik} />
              </TabPanel>
              <TabPanel value={lang} index={2} dir={theme.direction}>
                <BaseFields lang={<Uzbek />} formik={formik} />
              </TabPanel>
            </SwipeableViews>
            <div>
              <Form.Item formik={formik} name="about_us_image">
                <div className="w-full h-full flex flex-col items-center mt-4">
                  <Gallery
                    rounded
                    width={120}
                    height={120}
                    gallery={
                      values.about_us_image ? [values.about_us_image] : []
                    }
                    setGallery={(elm) =>
                      setFieldValue("about_us_image", elm[0])
                    }
                    multiple={false}
                  />
                  795x492
                </div>
              </Form.Item>
            </div>
          </Card>
        </Box>
        <div className="sticky bottom-0 flex justify-end items-center w-full bg-white py-2 px-4">
          <Button
            size="large"
            variant="contained"
            type="submit"
            loading={btnDisabled}
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </form>
  );
}
