import ClientsTable from "./ClientsTable";
import Header from "components/Header";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import Button from "components/Button";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import RfmCustomersList from "views/clients/Segments/RfmCustomersList";
import Birthdays from "./Birthdays";

export default function Clients() {
  const { t } = useTranslation();
  const history = useHistory();
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  return (
    <div>
      <Header
        title={
          <div className="flex">
            <p>{t("clients")}</p>
          </div>
        }
        startAdornment={
          <StyledTabs
            value={value}
            onChange={handleChange}
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab label={tabLabel(t("clients"))} {...a11yProps(0)} />
            <StyledTab label={tabLabel(t("segments"))} {...a11yProps(1)} />
            <StyledTab label={tabLabel(t("birthdays"))} {...a11yProps(2)} />
          </StyledTabs>
        }
        endAdornment={
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => history.push("/home/clients/create")}
          >
            {t("add")}
          </Button>
        }
      />
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <ClientsTable />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <RfmCustomersList tab={value} />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Birthdays active={value === 2} />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
