import Filters from "components/Filters";
import Header from "components/Header";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import TableGood from "./Table/TableGood";
import TableInformation from "./Table/TableInformation";
import { ArrowBack } from "@mui/icons-material";
import { useHistory } from "react-router-dom";

const EditMenu = () => {
  const [tabValue, setTabValue] = useState(0);
  const history = useHistory();
  const { t } = useTranslation();

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <div>
      <Header
        startAdornment={
          <div className="flex items-center gap-1 font-semibold text-xl">
            <ArrowBack
              onClick={() => history.push("/home/catalog/menu")}
              className="cursor-pointer"
            />
            <p>{t("edit_menu")}</p>
          </div>
        }
      />
      <Filters
        children={
          <StyledTabs
            className="pb-2"
            value={tabValue}
            onChange={handleChange}
            indicatorColor="primary"
            centered={false}
            aria-label="full width tabs example"
          >
            <StyledTab label={tabLabel(t("goods"))} {...a11yProps(0)} />
            <StyledTab
              label={tabLabel(t("Общие сведение"))}
              {...a11yProps(1)}
            />
          </StyledTabs>
        }
      />
      <TabPanel value={tabValue} index={1}>
        <TableInformation />
      </TabPanel>
      <TabPanel value={tabValue} index={0}>
        <TableGood />
      </TabPanel>
    </div>
  );
};

export default EditMenu;
