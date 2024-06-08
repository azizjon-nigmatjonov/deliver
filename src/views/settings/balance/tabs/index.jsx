import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Balance from "../BalanceTab";
import Fare from "../FareTab";
import Button from "components/Button";

export default function Poster() {
  const { t } = useTranslation();
  const theme = useTheme();

  const [value, setValue] = useState(0);
  const [isTable, setIsTable] = useState(false);

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
      <Header title={t("balance")} />
      <Filters
        extra={
          value === 1 && isTable === false ? (
            <Button size="medium" onClick={() => setIsTable(!isTable)}>
              {t("change")}
            </Button>
          ) : value === 1 && isTable === true ? (
            <Button size="medium" onClick={() => setIsTable(!isTable)}>
              {t("cancel")}
            </Button>
          ) : (
            ""
          )
        }
      >
        <StyledTabs
          value={value}
          onChange={handleChange}
          centered={false}
          aria-label="full width tabs example"
          TabIndicatorProps={{ children: <span className="w-2" /> }}
        >
          <StyledTab
            label={tabLabel(t("balance"))}
            {...a11yProps(0)}
            style={{ width: "100px" }}
          />
          <StyledTab
            label={tabLabel(t("fares"))}
            {...a11yProps(1)}
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
          <Balance />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Fare isTable={isTable} />
        </TabPanel>
      </SwipeableViews>
    </>
  );
}
