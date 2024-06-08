import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import Settings from "./tabs/Settings";
import Powers from "./tabs/Powers";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import parseQuery from "helpers/parseQuery";

export default function TgBotSettings() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { tab } = parseQuery();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (tab === "1") {
      setValue(1);
    } else if (tab === "2") {
      setValue(2);
    } else setValue(0);
  }, [tab]);

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
      <Header title={t("Настройки бота")} />
      <Filters>
        <StyledTabs
          value={value}
          onChange={handleChange}
          centered={false}
          aria-label="full width tabs example"
          TabIndicatorProps={{ children: <span className="w-2" /> }}
        >
          <StyledTab label={tabLabel(t("Полномочия"))} {...a11yProps(0)} />
          <StyledTab label={tabLabel(t("Настройки"))} {...a11yProps(1)} />
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
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Settings />
        </TabPanel>
      </SwipeableViews>
    </>
  );
}
