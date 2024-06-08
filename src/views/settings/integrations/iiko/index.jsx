import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import Powers from "./tabs/Powers";
import Branches from "./tabs/Branches/index";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Products from "./tabs/Products";
import Terminal from "./tabs/Terminal";
import Couriers from "./tabs/Couriers/index";
import Discounts from "./tabs/Discount";
import Aggregators from "./tabs/Aggregators";

export default function Iiko() {
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
      <Header title={t("Iiko")} />
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
          <StyledTab
            label={tabLabel(t("terminal"))}
            {...a11yProps(3)}
            style={{ width: "100px" }}
          />
          <StyledTab
            label={tabLabel(t("couriers"))}
            {...a11yProps(4)}
            style={{ width: "100px" }}
          />
          <StyledTab
            label={tabLabel(t("discount"))}
            {...a11yProps(5)}
            style={{ width: "100px" }}
          />
          <StyledTab
            label={tabLabel(t("aggregators"))}
            {...a11yProps(6)}
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
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Branches />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Products />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <Terminal />
        </TabPanel>
        <TabPanel value={value} index={4} dir={theme.direction}>
          <Couriers />
        </TabPanel>
        <TabPanel value={value} index={5} dir={theme.direction}>
          <Discounts />
        </TabPanel>
        <TabPanel value={value} index={6} dir={theme.direction}>
          <Aggregators />
        </TabPanel>
      </SwipeableViews>
    </>
  );
}
