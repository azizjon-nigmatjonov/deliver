import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import Template from "./Template";
import { useFormik } from "formik";
import Button from "components/Button";
import SaveIcon from "@mui/icons-material/Save";
import { smsStatusList } from "constants/statuses";
import {
  useSmsTemplate,
  useSmsTemplateMutations,
} from "services/v2/sms-template";
import { showAlert } from "redux/actions/alertActions";
import { useDispatch } from "react-redux";
import customTemplateService, {
  useCustomTemplateList,
} from "services/v2/custom_template";
import { useMutation } from "@tanstack/react-query";

const tags = [
  {
    value: "exl_or_id",
    label: "ID заказа",
  },
  {
    value: "shr_name",
    label: "Название ресторана",
  },
  {
    value: "max_or_time",
    label: "Время доставки",
  },
  {
    value: "prds_msg",
    label: "Список продуктов",
  },
  {
    value: "total_pr",
    label: "Общая сумма",
  },
  {
    value: "dt_pr",
    label: "Сумма скидки",
  },
  {
    value: "cr_ft_name",
    label: "Имя курьера",
  },
  {
    value: "cr_lt_name",
    label: "Фамилия курьера",
  },
  {
    value: "cr_ph_num",
    label: "Номер курьера",
  },
  {
    value: "cus_name",
    label: "Имя клиента",
  },
  {
    value: "cus_phone",
    label: "Номер клиента",
  },
];

const initialTemplates = smsStatusList?.map((status) => ({
  label: status.label,
  status_id: status?.id,
  message_ru: "",
  message_en: "",
  message_uz: "",
  id: "",
  default_language: "en",
  sources: [],
  is_product_price_used: false,
  is_active: false,
}));

const SMSTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [messages, setMessages] = useState({ uz: "", ru: "", en: "" });
  const [value, setValue] = useState(0);
  const [saveLoading, setSaveLoading] = useState(false);

  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  useEffect(() => {
    setTemplates([
      ...initialTemplates,
      {
        label: "birthday",
        status_id: "birthday",
        message_ru: "",
        message_en: "",
        message_uz: "",
        default_language: "en",
        is_active: false,
      },
    ]);
  }, []);

  const updateCustom = useMutation({
    mutationFn: customTemplateService.update,
  });
  const createCustom = useMutation({
    mutationFn: customTemplateService.create,
  });

  const { postSMSTemplate } = useSmsTemplateMutations({
    props: {
      onSuccess: (res) => {
        dispatch(showAlert(t("successfully_created"), "success"));
        setSaveLoading(false);
      },
      onError: (err) => {
        setSaveLoading(false);
      },
    },
  });
  const { putSMSTemplate } = useSmsTemplateMutations({
    props: {
      onSuccess: (res) => {
        dispatch(showAlert(t("successfully_updated"), "success"));
        setSaveLoading(false);
      },
      onError: (err) => {
        setSaveLoading(false);
      },
    },
  });

  const initialValues = useMemo(
    () => ({
      default_language: "",
      id: "",
      is_product_price_used: false,
      is_active: false,
      message: {
        ru: "",
        en: "",
        uz: "",
      },
      sources: [],
      status_id: "986a0d09-7b4d-4ca9-8567-aa1c6d770505",
    }),
    [],
  );

  const onSubmit = (values) => {
    if (!values?.message?.uz || !values?.message?.ru || !values?.message?.en) {
      return dispatch(showAlert(t("SMS шаблон пустой"), "warning"));
    } else {
      if (values?.status_id === "birthday") {
        const data = {
          id: values?.id,
          default_language: values?.default_language?.value,
          is_active: values?.is_active,
          sms: {
            uz: values?.message.uz,
            ru: values?.message.ru,
            en: values?.message.en,
          },
          bot: {
            uz: "",
            ru: "",
            en: "",
          },
          app: {
            uz: "",
            ru: "",
            en: "",
          },
          type: "birthday",
        };
        if (data?.id)
          return updateCustom.mutate(data, {
            onSuccess: () =>
              dispatch(showAlert(t("successfully_updated"), "success")),
          });
        createCustom.mutate(data, {
          onSuccess: () =>
            dispatch(showAlert(t("successfully_created"), "success")),
        });
        return;
      }

      const data = {
        default_language: values?.default_language?.value,
        is_product_price_used: values?.is_product_price_used,
        is_active: values?.is_active,
        message: {
          uz: values?.message.uz,
          ru: values?.message.ru,
          en: values?.message.en,
        },
        sources: values?.sources?.map((source) => source.value),
        status_id: values?.status_id,
        id: values?.id,
      };

      if (data?.id) return putSMSTemplate.mutate(data);
      postSMSTemplate.mutate(data);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  const { values, setFieldValue, handleSubmit, setValues } = formik;

  const TextWithKeywords = (text, tags) => {
    const wrappedText = tags.reduce((result, tag) => {
      const regex = new RegExp(tag.value, "gi");
      return result.replace(
        regex,
        `<span contenteditable="false" class="keyword_sms_template" draggable="false" data-content="${tag.label}"> ${tag.value} </span>`,
      );
    }, text);

    return wrappedText;
  };

  const onSuccessData = (data) => {
    data
      ? setValues({
          default_language: {
            value: data[0]?.default_language,
            label: t(data[0]?.default_language),
          },
          id: data[0]?.id,
          is_product_price_used: data[0]?.is_product_price_used,
          is_active: data[0]?.is_active,
          message: data[0]?.message ? data[0]?.message : data[0]?.sms,
          sources: data[0]?.sources?.map((source) => ({
            value: source,
            label: t(source),
          })),
          status_id: values?.status_id,
        })
      : setValues({
          default_language: "",
          id: "",
          is_product_price_used: false,
          is_active: false,
          message: { uz: "", ru: "", en: "" },
          sources: [],
          status_id: values?.status_id,
        });
    // setTemplates((prevState) =>
    //   prevState.map((template) =>
    //     template?.status_id === values?.status_id
    //       ? {
    //           ...template,
    //           message_uz: data
    //             ? (data[0]?.message ? data[0]?.message : data[0]?.sms)?.uz
    //             : "",
    //           message_ru: data
    //             ? (data[0]?.message ? data[0]?.message : data[0]?.sms)?.ru
    //             : "",
    //           message_en: data
    //             ? (data[0]?.message ? data[0]?.message : data[0]?.sms)?.en
    //             : "",
    //         }
    //       : template,
    //   ),
    // );
    const enMsg = TextWithKeywords(
      data ? (data[0]?.message ? data[0]?.message : data[0]?.sms)?.en : "",
      tags,
    );
    const ruMsg = TextWithKeywords(
      data ? (data[0]?.message ? data[0]?.message : data[0]?.sms)?.ru : "",
      tags,
    );
    const uzMsg = TextWithKeywords(
      data ? (data[0]?.message ? data[0]?.message : data[0]?.sms)?.uz : "",
      tags,
    );
    setMessages({
      uz: uzMsg.replace(/\n/g, "<br />"),
      en: enMsg.replace(/\n/g, "<br />"),
      ru: ruMsg.replace(/\n/g, "<br />"),
    });
  };

  useSmsTemplate({
    params: {
      status_id: values?.status_id,
    },
    props: {
      enabled:
        values?.status_id && values?.status_id !== "birthday" ? true : false,
      onSuccess: (data) => onSuccessData(data?.sms_templates),
    },
  });

  useCustomTemplateList({
    params: {
      type: "birthday",
    },
    props: {
      enabled: values?.status_id && values?.status_id === "birthday",
      onSuccess: (data) => onSuccessData(data?.custom_templates),
    },
  });

  return (
    <form
      onSubmit={handleSubmit}
      style={{ minHeight: "100vh" }}
      className="flex flex-col justify-between"
    >
      <div>
        <Header
          title={t("SMSTemplate")}
          startAdornment={
            <StyledTabs
              value={value}
              onChange={handleTabChange}
              centered={false}
              aria-label="full width tabs example"
              TabIndicatorProps={{ children: <span className="w-2" /> }}
            >
              {templates?.map((item, idx) => (
                <StyledTab
                  onClick={() => {
                    setFieldValue("status_id", item.status_id);
                    // setFieldValue("message", {
                    //   uz: item.message_uz,
                    //   ru: item.message_ru,
                    //   en: item.message_en,
                    // });
                  }}
                  key={item?.status_id}
                  label={t(item?.label)}
                  {...a11yProps(idx)}
                />
              ))}
            </StyledTabs>
          }
        />
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          {templates?.map((item, idx) => (
            <TabPanel
              key={item?.status_id}
              value={value}
              index={idx}
              dir={theme.direction}
            >
              <Template
                tags={tags}
                values={values}
                messages={messages}
                setFieldValue={setFieldValue}
              />
            </TabPanel>
          ))}
        </SwipeableViews>
      </div>
      <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
        <Button
          icon={SaveIcon}
          size="large"
          type="submit"
          loading={saveLoading}
        >
          {t("save")}
        </Button>
      </div>
    </form>
  );
};

export default SMSTemplate;
