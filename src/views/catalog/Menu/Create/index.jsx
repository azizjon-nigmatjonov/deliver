import Breadcrumb from "components/Breadcrumb";
import Filters from "components/Filters";
import Header from "components/Header";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import TableInformation from "./Tab/TableInformation";

const AddMenu = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);

  const routes = [
    {
      title: t("add"),
      link: true,
      route: `/home/catalog/menu`,
    },
  ];
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
      <Header startAdornment={<Breadcrumb routes={routes} />} />
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
            <StyledTab
              label={tabLabel(t("Общие сведение"))}
              {...a11yProps(0)}
            />
          </StyledTabs>
        }
      />
      <TabPanel value={tabValue} tabValue={tabValue} index={0}>
        <TableInformation />
      </TabPanel>
    </div>
  );
};

export default AddMenu;
