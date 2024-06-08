import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
import Card from "components/Card";
import Header from "components/Header";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import { useTranslation } from "react-i18next";
import SwipeableViews from "react-swipeable-views";
import LanguageTab from "./langTabs";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import Button from "components/Button";
import { postBanner, updateBanner, useBannerById } from "services/banner";
import { useHistory, useParams } from "react-router-dom";
import { IconButton } from "@mui/material";

//! Optimization required
const CreateBanner = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const params = useParams();
  const history = useHistory();

  let initialData = {
    image: "",
    title_in_uz: "",
    title_in_ru: "",
    title_in_en: "",
    url: "",
    active: true,
  };
  const [data, setData] = useState(initialData);
  const handleTabChange = (event, newValue) => setValue(newValue);
  const handleChangeIndex = (index) => setValue(index);

  useBannerById({
    id: params?.id,
    props: {
      enabled: !!params?.id,
      onSuccess: (data) => {
        let n = data?.image?.lastIndexOf("/");
        let result = data?.image?.substring(n + 1);
        setData({
          active: data?.active,
          image: result,
          title_in_ru: data?.title?.ru,
          title_in_uz: data?.title?.uz,
          title_in_en: data?.title?.en,
          url: data?.url,
        });
      },
    },
  });

  const updateABanner = () => {
    updateBanner(params?.id, {
      active: data.active,
      image: data.image,
      position: "website",
      url: data.url,
      title: {
        uz: data.title_in_uz,
        ru: data.title_in_ru,
        en: data.title_in_en,
      },
    }).then(() => history.push("/home/marketing/banners"));
  };

  const onSubmit = () => {
    postBanner({
      image: data.image,
      position: "website",
      title: {
        uz: data.title_in_uz,
        ru: data.title_in_ru,
        en: data.title_in_en,
      },
      url: data.url,
    }).then(() => history.push("/home/marketing/banners"));
  };

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  return (
    <div
      style={{ minHeight: "100vh" }}
      className="flex flex-col justify-between"
    >
      <div>
        <Header
          title={
            <div className="flex items-center gap-3">
              <IconButton onClick={() => history.goBack()}>
                <ArrowBackIcon />
              </IconButton>
              <p>Добавить баннер</p>
            </div>
          }
        />
        <div className="grid">
          <Card
            className="m-4 mr-2"
            bodyStyle={{ padding: "0 1rem" }}
            title={t("general.information")}
          >
            <StyledTabs
              value={value}
              onChange={handleTabChange}
              className="border-b"
              centered={false}
              aria-label="full width tabs example"
              TabIndicatorProps={{ children: <span className="w-2" /> }}
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
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <LanguageTab
                  image={data?.image}
                  setData={setData}
                  title={data?.title_in_ru}
                  lang="title_in_ru"
                  url={data?.url}
                  active={data?.active}
                />
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <LanguageTab
                  image={data?.image}
                  setData={setData}
                  title={data?.title_in_uz}
                  lang="title_in_uz"
                  url={data?.url}
                  active={data?.active}
                />
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                <LanguageTab
                  image={data?.image}
                  setData={setData}
                  title={data?.title_in_en}
                  lang="title_in_en"
                  url={data?.url}
                  active={data?.active}
                />
              </TabPanel>
            </SwipeableViews>
          </Card>
        </div>
      </div>
      <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
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
          // loading={buttonLoader}
          onClick={() => {
            params?.id ? updateABanner() : onSubmit();
          }}
        >
          {t("create")}
        </Button>
      </div>
    </div>
  );
};

export default CreateBanner;
