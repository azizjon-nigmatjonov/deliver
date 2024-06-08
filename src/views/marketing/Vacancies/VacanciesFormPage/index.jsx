import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

import Header from "components/Header";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import Filters from "components/Filters";
import Candidates from "./Tabs/Candidates";
import Details from "./Tabs/Details";

const VacanciesFormPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const { t } = useTranslation();
  const history = useHistory();
  const { id } = useParams();

  const headerTitle = useMemo(() => {
    return (
      <div className="flex gap-3 items-center">
        <IconButton variant="outlined" onClick={() => history.goBack()}>
          <ArrowBackIcon />
        </IconButton>
        <p>{id ? t("edit_vacancy") : t("add_vacancy")}</p>
      </div>
    );
  }, [history, t, id]);

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  return (
    <div className="flex flex-col h-screen">
      <Header title={headerTitle} />
      <Filters>
        <StyledTabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          centered={false}
          aria-label="full width tabs example"
        >
          <StyledTab label={tabLabel(t("details"))} {...a11yProps(0)} />
          {id && (
            <StyledTab label={tabLabel(t("candidates"))} {...a11yProps(1)} />
          )}
        </StyledTabs>
      </Filters>

      <TabPanel
        flex="1"
        display={tabValue === 0 ? "flex" : "none"}
        value={tabValue}
        index={1}
      >
        <Details />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Candidates />
      </TabPanel>
    </div>
  );
};

export default VacanciesFormPage;
