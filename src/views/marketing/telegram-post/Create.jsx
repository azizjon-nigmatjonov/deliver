import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "components/Button/Buttonv2";
import Card from "components/Card";
import Gallery from "components/Gallery";
import Header from "components/Header";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { postTelegramContent } from "services/telegram";
import { IconButton } from "@mui/material";
import { SendRounded } from "@mui/icons-material";

const TgPostFormPage = () => {
  const [tebValue, setTabValue] = useState(0);
  const [message, setMessage] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [media, setMedia] = useState({
    image: [],
    video: [],
    animation: [],
  });

  const theme = useTheme();
  const history = useHistory();
  const { t } = useTranslation();

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleChangeIndex = (index) => setTabValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  // const routes = [
  //   {
  //     title: t("telegram.post"),
  //     link: true,
  //     route: `/home/marketing/telegram-post`,
  //   },
  //   {
  //     title: t("add"),
  //     // link: true,
  //     // route: `/home/settings/content/telegram-post`,
  //   },
  // ];

  const onSubmit = () => {
    setDisabledBtn(true);
    const data = {
      animation: media.animation || "",
      photo: media.image || "",
      text: message,
      video: media.video || "",
      file: "",
    };

    postTelegramContent(data)
      .then(() => history.goBack())
      .catch((err) => console.log(err))
      .finally(() => setDisabledBtn(true));
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        title={
          <div className="flex items-center gap-3">
            <IconButton onClick={() => history.goBack()}>
              <ArrowBackIcon />
            </IconButton>
            <p>{t("telegram.post")}</p>
          </div>
        }
      />
      <div className="flex-1 flex justify-between flex-col">
        <Card
          className="m-4"
          filters={
            <StyledTabs
              value={tebValue}
              onChange={handleTabChange}
              centered={false}
              aria-label="full width tabs example"
              TabIndicatorProps={{
                children: <span className="w-2" />,
              }}
            >
              <StyledTab label={tabLabel(t("photo"))} {...a11yProps(0)} />
              <StyledTab label={tabLabel(t("Video"))} {...a11yProps(1)} />
              <StyledTab label={tabLabel("GIF")} {...a11yProps(1)} />
            </StyledTabs>
          }
        >
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={tebValue}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={tebValue} index={0} dir={theme.direction}>
              <Gallery
                bottomText={false}
                multiple={false}
                width={300}
                height={300}
                gallery={media?.image?.length ? [media.image] : []}
                setGallery={(elm) => setMedia({ image: elm[0] })}
              />
            </TabPanel>
            <TabPanel value={tebValue} index={1} dir={theme.direction}>
              {media?.video?.length ? (
                <h2 className="text-primary">Video loaded</h2>
              ) : (
                <Gallery
                  bottomText={false}
                  multiple={false}
                  width={300}
                  height={300}
                  isVideo={true}
                  gallery={media?.video?.length ? [media?.video] : []}
                  setGallery={(elm) => setMedia({ video: elm[0] })}
                />
              )}
            </TabPanel>
            <TabPanel value={tebValue} index={2} dir={theme.direction}>
              <Gallery
                bottomText={false}
                multiple={false}
                width={300}
                height={300}
                isGif={true}
                gallery={media?.animation?.length ? [media.animation] : []}
                setGallery={(elm) => setMedia({ animation: elm[0] })}
              />
            </TabPanel>
          </SwipeableViews>
          <textarea
            rows={4}
            className="w-full border border-lightgray-1 rounded p-4"
            style={{ margin: "1rem 0" }}
            placeholder={t("write.your.message.here")}
            value={message}
            onChange={({ target: { value } }) => setMessage(value)}
          />
        </Card>
        <div className="sticky bottom-0 flex justify-end items-center w-full bg-white border-t py-2 px-4 gap-3">
          <Button
            variant="contained"
            size="large"
            endIcon={<SendRounded />}
            onClick={onSubmit}
            disabled={
              (!media.animation?.length &&
                !media.image?.length &&
                !media.video?.length &&
                !message) ||
              disabledBtn
            }
          >
            {t("send")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TgPostFormPage;
