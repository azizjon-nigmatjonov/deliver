import React, { useState } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import TabPanel from "components/Tab/TabPanel";
import TextArea from "components/Textarea";
import Gallery from "components/Gallery/v2";
import Form from "components/Form/Index";
import { Grid } from "@mui/material";

const AboutTexts = ({ formik }) => {
  const [value, setValue] = useState(0);
  const { setFieldValue } = formik;

  const theme = useTheme();
  const { t } = useTranslation();

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

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );
  const { values } = formik;

  return (
    <Card
      title={t("about_us")}
      extra={
        <StyledTabs
          value={value}
          onChange={handleChange}
          centered={false}
          aria-label="full width tabs example"
          TabIndicatorProps={{ children: <span className="w-2" /> }}
        >
          <StyledTab
            label={
              <span className="flex justify-around items-center">
                {tabLabel(t(values?.sources[1]?.source))}
              </span>
            }
            {...a11yProps(0)}
          />
          <StyledTab
            label={
              <span className="flex justify-around items-center">
                {tabLabel(t(values?.sources[2]?.source))}
              </span>
            }
            {...a11yProps(1)}
          />
          <StyledTab
            label={
              <span className="flex justify-around items-center">
                {tabLabel(t(values?.sources[4]?.source))}
              </span>
            }
            {...a11yProps(2)}
          />
        </StyledTabs>
      }
      headerStyle={{ paddingTop: 0, paddingBottom: 0 }}
    >
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container spacing={2}>
            <Grid item xs={3} display="flex" justifyContent="center">
              <Form.Item formik={formik} name="photo" label={t("photo")}>
                <Gallery
                  width={170}
                  height={155}
                  gallery={
                    values?.sources[1]?.image ? [values?.sources[1]?.image] : []
                  }
                  setGallery={(val) =>
                    setFieldValue(`sources[1].image`, val[0])
                  }
                  multiple={false}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={3}>
              <Form.Item formik={formik} name="uz" label={t("uz")}>
                <TextArea
                  size={6}
                  id={`sources[1].about_us.uz`}
                  {...formik.getFieldProps(`sources[1].about_us.uz`)}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={3}>
              <Form.Item formik={formik} name="ru" label={t("ru")}>
                <TextArea
                  size={6}
                  id={`sources[1].about_us.ru`}
                  {...formik.getFieldProps(`sources[1].about_us.ru`)}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={3}>
              <Form.Item formik={formik} name="en" label={t("en")}>
                <TextArea
                  size={6}
                  id={`sources[1].about_us.en`}
                  {...formik.getFieldProps(`sources[1].about_us.en`)}
                />
              </Form.Item>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid container spacing={2}>
            <Grid item xs={3} display="flex" justifyContent="center">
              <Form.Item formik={formik} name="photo" label={t("photo")}>
                <Gallery
                  width={170}
                  height={155}
                  gallery={
                    values?.sources[1]?.image ? [values?.sources[1]?.image] : []
                  }
                  setGallery={(val) =>
                    setFieldValue(`sources[2].image`, val[0])
                  }
                  multiple={false}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={3}>
              <Form.Item formik={formik} name="uz" label={t("uz")}>
                <TextArea
                  size={6}
                  id={`sources[2].about_us.uz`}
                  {...formik.getFieldProps(`sources[2].about_us.uz`)}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={3}>
              <Form.Item formik={formik} name="ru" label={t("ru")}>
                <TextArea
                  size={6}
                  id={`sources[2].about_us.ru`}
                  {...formik.getFieldProps(`sources[2].about_us.ru`)}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={3}>
              <Form.Item formik={formik} name="en" label={t("en")}>
                <TextArea
                  size={6}
                  id={`sources[2].about_us.en`}
                  {...formik.getFieldProps(`sources[2].about_us.en`)}
                />
              </Form.Item>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Grid container spacing={2}>
            <Grid item xs={3} display="flex" justifyContent="center">
              <Form.Item formik={formik} name="photo" label={t("photo")}>
                <Gallery
                  width={170}
                  height={155}
                  gallery={
                    values?.sources[4]?.image ? [values?.sources[4]?.image] : []
                  }
                  setGallery={(val) =>
                    setFieldValue(`sources[4].image`, val[0])
                  }
                  multiple={false}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={3}>
              <Form.Item formik={formik} name="uz" label={t("uz")}>
                <TextArea
                  size={6}
                  id={`sources[4].about_us.uz`}
                  {...formik.getFieldProps(`sources[4].about_us.uz`)}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={3}>
              <Form.Item formik={formik} name="ru" label={t("ru")}>
                <TextArea
                  size={6}
                  id={`sources[4].about_us.ru`}
                  {...formik.getFieldProps(`sources[4].about_us.ru`)}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={3}>
              <Form.Item formik={formik} name="en" label={t("en")}>
                <TextArea
                  size={6}
                  id={`sources[4].about_us.en`}
                  {...formik.getFieldProps(`sources[4].about_us.en`)}
                />
              </Form.Item>
            </Grid>
          </Grid>
        </TabPanel>
      </SwipeableViews>
    </Card>
  );
};

export default AboutTexts;
