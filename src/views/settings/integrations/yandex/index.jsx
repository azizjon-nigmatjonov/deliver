import Header from "components/Header";
import { useTranslation } from "react-i18next";
import Powers from "./tabs/powers";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Filters from "components/Filters";

const YandexDelivery = () => {
  const { t } = useTranslation();

  const theme = useTheme();

  const [value, setValue] = useState(0);

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChange = (event, newValue) => setValue(newValue);

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  return (
    <>
      <Header title={t("yandex_delivery")} />
      <Filters>
        <StyledTabs
          value={value}
          onChange={handleChange}
          centered={false}
          aria-label="full width tabs example"
          TabIndicatorProps={{ children: <span className="w-2" /> }}
        >
          <StyledTab
            label={tabLabel(t("powers"))}
            {...a11yProps(0)}
            style={{ width: "100px" }}
          />
        </StyledTabs>
      </Filters>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Powers />
        </TabPanel>
      </SwipeableViews>
    </>
  );
};

export default YandexDelivery;
