import Header from "components/Header";
import Filters from "components/Filters";
import { useTranslation } from "react-i18next";
import TabPanel from "components/Tab/TabPanel";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import Powers from "./tabs/powers";
import Branches from "./tabs/branches";
import Products from "./tabs/products";
import Aggregators from "./tabs/Aggregators";

const RKeeper = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const theme = useTheme();

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
    <div>
      <Header title={t("RKeeper")} />
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
            label={tabLabel(t("aggregators"))}
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
          <Powers />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Branches />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Products />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <Aggregators />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
};

export default RKeeper;
