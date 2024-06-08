import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import JowiPowers from "./tabs/Powers";
import JowiBranches from "./tabs/Branches";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import JowiProducts from "./tabs/Products";

export default function Jowi() {
  const { t } = useTranslation();
  const theme = useTheme();

  const [value, setValue] = useState(0);

  const extraFilter = (
    <div className="flex gap-4">
      {/* <Button
        icon={FIlterIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => {
          console.log("clicked");
        }}
      >
        {t("filter")}
      </Button>

      <Button
        icon={DownloadIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button> */}
    </div>
  );

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
      <Header title={t("Jowi")} />
      <Filters extra={value !== 0 && extraFilter}>
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
          <StyledTab
            label={tabLabel(t("branches"))}
            {...a11yProps(1)}
            style={{ width: "100px" }}
          />
          <StyledTab
            label={tabLabel(t("goods"))}
            {...a11yProps(2)}
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
          <JowiPowers />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <JowiBranches />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <JowiProducts />
        </TabPanel>
      </SwipeableViews>
    </>
  );
}
