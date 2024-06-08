import { useEffect, useState } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import Select from "components/Select";
import Switch from "components/Switch";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import { useTheme } from "@mui/material/styles";
import TabPanel from "components/Tab/TabPanel";
import SwipeableViews from "react-swipeable-views";
import { Grid } from "@mui/material";

const Template = ({
  tags,
  values,
  messages,
  setFieldValue,
}) => {
  const { t } = useTranslation();

  const [usedKeywords, setUsedKeywords] = useState({ 0: [], 1: [], 2: [] });
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => setValue(index);

  useEffect(() => {
    const timer = setTimeout(() => {
      let uz = [],
        ru = [],
        en = [];
      tags.forEach((tag) => {
        if (values?.message?.uz?.includes(tag.value)) {
          uz.push(tag.value);
        }
        if (values?.message?.ru?.includes(tag.value)) {
          ru.push(tag.value);
        }
        if (values?.message?.en?.includes(tag.value)) {
          en.push(tag.value);
        }
      });
      setUsedKeywords({ 0: uz, 1: ru, 2: en });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [tags, values]);

  return (
    <div className="p-4">
      <Grid container spacing={1}>
        <Grid item xs={12} lg={6}>
          <Card className="h-full" bodyClass="pt-0">
            <StyledTabs
              value={value}
              onChange={handleChange}
              centered={false}
              aria-label="full width tabs example"
              TabIndicatorProps={{ children: <span className="w-2" /> }}
              className="border-b"
            >
              <StyledTab label={t("uz")} {...a11yProps(0)} />
              <StyledTab label={t("ru")} {...a11yProps(1)} />
              <StyledTab label={t("en")} {...a11yProps(2)} />
            </StyledTabs>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <div
                  draggable="false"
                  className="border mt-2 p-2 outline-none rounded h-full"
                  contentEditable={true}
                  onInput={(e) => {
                    // const updatedContent = e.target.innerText;
                    // setTemplates((prevState) =>
                    //   prevState.map((template, i) =>
                    //     i === idx
                    //       ? {
                    //           ...template,
                    //           message_uz: updatedContent,
                    //         }
                    //       : template,
                    //   ),
                    // );
                    setFieldValue("message.uz", e.target.innerText);
                  }}
                  dangerouslySetInnerHTML={{
                    __html: messages?.uz,
                  }}
                />
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <div
                  draggable="false"
                  className="border mt-2 p-2 outline-none rounded h-full"
                  contentEditable={true}
                  dangerouslySetInnerHTML={{
                    __html: messages?.ru,
                  }}
                  onInput={(e) => {
                    // const updatedContent = e.target.innerText;
                    // setTemplates((prevState) =>
                    //   prevState.map((template, i) =>
                    //     i === idx
                    //       ? {
                    //           ...template,
                    //           message_ru: updatedContent,
                    //         }
                    //       : template,
                    //   ),
                    // );
                    setFieldValue("message.ru", e.target.innerText);
                  }}
                ></div>
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                <div
                  draggable="false"
                  className="border mt-2 p-2 outline-none rounded h-full"
                  contentEditable={true}
                  dangerouslySetInnerHTML={{
                    __html: messages?.en,
                  }}
                  onInput={(e) => {
                    // const updatedContent = e.target.innerText;
                    // setTemplates((prevState) =>
                    //   prevState.map((template, i) =>
                    //     i === idx
                    //       ? {
                    //           ...template,
                    //           message_en: updatedContent,
                    //         }
                    //       : template,
                    //   ),
                    // );
                    setFieldValue("message.en", e.target.innerText);
                  }}
                ></div>
              </TabPanel>
            </SwipeableViews>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card title={t("settings")} className="h-full">
            {values?.status_id !== "birthday" && (
              <div className="w-full flex justify-between items-center pt-4">
                <div className="w-1/4 input-label">
                  <span>{t("source")}</span>
                </div>
                <div className="w-2/4">
                  <div>
                    <Select
                      name="sources"
                      value={values.sources}
                      options={[
                        {
                          label: t("website"),
                          value: "website",
                        },
                        {
                          label: t("bot"),
                          value: "bot",
                        },
                        {
                          label: t("ios"),
                          value: "ios",
                        },
                        {
                          label: t("android"),
                          value: "android",
                        },
                        {
                          label: t("admin_panel"),
                          value: "admin_panel",
                        },
                      ]}
                      placeholder={t("source")}
                      onChange={(e) => setFieldValue("sources", e)}
                      dropdownIndicator={false}
                      style={{ minWidth: "50%" }}
                      isMulti
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="w-full flex justify-between items-center pt-4">
              <div className="w-1/4 input-label">
                <span>{t("Язык по умолчанию")}</span>
              </div>
              <div className="w-2/4">
                <div>
                  <Select
                    name="discounts"
                    value={values.default_language}
                    options={[
                      { value: "ru", label: t("ru") },
                      { value: "uz", label: t("uz") },
                      { value: "en", label: t("en") },
                    ]}
                    placeholder={t("Language")}
                    onChange={(e) => setFieldValue("default_language", e)}
                    dropdownIndicator={false}
                    style={{ minWidth: "50%" }}
                  />
                </div>
              </div>
            </div>

            {values?.status_id !== "birthday" && (
              <div className="w-full flex justify-between items-center pt-4">
                <div className="w-1/4 input-label">
                  <span>{t("Выводить цены продуктов")}</span>
                </div>
                <div className="w-2/4">
                  <div>
                    <Switch
                      checked={values.is_product_price_used}
                      onChange={(e) =>
                        setFieldValue("is_product_price_used", e)
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="w-full flex justify-between items-center pt-4">
              <div className="w-1/4 input-label">
                <span>{t("status")}</span>
              </div>
              <div className="w-2/4">
                <div>
                  <Switch
                    checked={values.is_active}
                    onChange={(e) => setFieldValue("is_active", e)}
                  />
                </div>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card title={t("keywords")} className="h-full">
            <div className="flex flex-wrap gap-2">
              {tags?.map(
                (tag) =>
                  !usedKeywords[value]?.includes(tag?.value) && (
                    <span
                      key={tag.value}
                      className="keyword_sms_template"
                      draggable="true"
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          "text/html",
                          `&nbsp;<span class="keyword_sms_template" contenteditable="false" draggable="true" data-content="${tag.label}">${tag.value}</span>&nbsp;`,
                        );
                      }}
                      data-content={tag.label}
                    >
                      {tag.value}
                    </span>
                  ),
              )}
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Template;
