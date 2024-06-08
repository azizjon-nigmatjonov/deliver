import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import AboutCompany from "./tabs/Company";
import CompanyBranches from "./tabs/Branches";
import Regions from "./tabs/Regions";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import parseQuery from "helpers/parseQuery";
import AddIcon from "@mui/icons-material/Add";
import Button from "components/Button";
import { useHistory } from "react-router-dom";
import FreeGeozone from "./tabs/FreeGeozone";

export default function Company() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { tab } = parseQuery();
  const history = useHistory();
  const [value, setValue] = useState(0);

  // When redirected, this works
  useEffect(() => {
    if (tab === "1") {
      setValue(1);
    } else if (tab === "2") {
      setValue(2);
    } else if (tab === "3") {
      setValue(3);
    } else if (tab === "4") {
      setValue(4);
    } else setValue(0);
  }, [tab]);

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  return (
    <>
      <Header
        title={t("company.settings")}
        endAdornment={
          value === 1 ? (
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() =>
                history.push("/home/settings/company/branches/create")
              }
            >
              {t("add")}
            </Button>
          ) : value === 2 ? (
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() =>
                history.push("/home/settings/company/regions/create")
              }
            >
              {t("add")}
            </Button>
          ) : (
            value === 3 && (
              <Button
                icon={AddIcon}
                size="medium"
                onClick={() =>
                  history.push("/home/settings/company/free-geozone/create")
                }
              >
                {t("add")}
              </Button>
            )
          )
        }
      />
      <Filters>
        <StyledTabs
          value={value}
          onChange={handleChange}
          centered={false}
          aria-label="full width tabs example"
          TabIndicatorProps={{ children: <span className="w-2" /> }}
        >
          <StyledTab label={tabLabel(t("about.company"))} {...a11yProps(0)} />
          <StyledTab
            label={tabLabel(t("company.branches"))}
            {...a11yProps(1)}
          />
          <StyledTab label={tabLabel(t("regions"))} {...a11yProps(2)} />
          <StyledTab label={tabLabel(t("free_geofence"))} {...a11yProps(3)} />
        </StyledTabs>
      </Filters>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <AboutCompany />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <CompanyBranches />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <Regions />
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <FreeGeozone />
      </TabPanel>
    </>
  );
}
