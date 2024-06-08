import { useTranslation } from "react-i18next";
import SwipeableViews from "react-swipeable-views";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
import { useTheme } from "@mui/material/styles";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import TextArea from "components/Textarea";

export default function useMultiLanguage() {
  return [Tabs, Views];
}

function Tabs({ value, setValue, formik }) {
  const { t } = useTranslation();
  const { errors, isValid } = formik;
  return (
    <StyledTabs
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
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
            {!isValid &&
              errors?.options?.map((error) => (
                <span className="text-red-600 text-lg animate-pulse">
                  {error?.title?.ru && "!"}
                </span>
              ))}
            {errors?.description_ru || errors?.title_ru ? (
              <span className="text-red-600 text-lg animate-pulse">!</span>
            ) : null}
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
            {errors?.description_en || errors?.title_en ? (
              <span className="text-red-600 text-lg animate-pulse">!</span>
            ) : null}
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
            {!isValid &&
              errors?.options?.map((error) => (
                <span className="text-red-600 text-lg animate-pulse">
                  {error?.title?.uz && "!"}
                </span>
              ))}
            {errors?.description_uz || errors?.title_uz ? (
              <span className="text-red-600 text-lg animate-pulse">!</span>
            ) : null}
          </span>
        }
        {...a11yProps(2)}
        style={{ width: "150px" }}
      />
    </StyledTabs>
  );
}

function Views({ children, value, setValue, formik }) {
  const theme = useTheme();
  return (
    <SwipeableViews
      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
      index={value}
      onChangeIndex={setValue}
    >
      <TabPanel value={value} index={0} dir={theme.direction}>
        {children(<Language lang="ru" formik={formik} />)}
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        {children(<Language lang="en" formik={formik} />)}
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        {children(<Language lang="uz" formik={formik} />)}
      </TabPanel>
    </SwipeableViews>
  );
}

function Language({
  formik,
  lang = "ru",
  firstLabel = "name",
  firstFormikId = "name",
  secondLabel = "description",
  secondFormikId = "description",
}) {
  const { t } = useTranslation();
  const { values, handleChange } = formik;

  return (
    <>
      <div className="input-label">
        <span>{t(firstLabel)}</span>
      </div>
      <div className="col-span-2">
        <Form.Item formik={formik} name={`${firstFormikId}_${lang}`}>
          <Input
            size="large"
            id={`${firstFormikId}_${lang}`}
            value={values[`${firstFormikId}_${lang}`]}
            onChange={handleChange}
          />
        </Form.Item>
      </div>

      {secondLabel && secondFormikId ? (
        <>
          <div className="input-label">
            <span>{t(secondLabel)}</span>
          </div>
          <div className="col-span-2">
            <Form.Item formik={formik} name={`${secondFormikId}_${lang}`}>
              <TextArea
                id={`${secondFormikId}_${lang}`}
                {...formik.getFieldProps(`${secondFormikId}_${lang}`)}
              />
            </Form.Item>
          </div>
        </>
      ) : null}
    </>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function tabLabel(text, isActive = false) {
  return <span className="px-1">{text}</span>;
}
