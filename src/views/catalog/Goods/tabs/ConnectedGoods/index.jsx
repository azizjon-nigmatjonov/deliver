import { useState } from "react";
import { useTranslation } from "react-i18next";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import Recommended from "./Recommended";
import Variation from "./Variation";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Card from "components/Card";
import { useParams } from "react-router-dom";
import Button from "components/Button/Buttonv2";
import Combo from "./Combo";
import Modifier from "./Modifier";

export default function ConnectedGoods({ formik }) {
  const { t } = useTranslation();
  const params = useParams();
  const theme = useTheme();

  const [value, setValue] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [connectProductsModal, setConnectProductsModal] = useState(false);
  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };
  const ORDER_TYPE = formik?.values?.type?.value;
  const handleChange = (event, newValue) => setValue(newValue);

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  const handleShowTabs = () => {
    if (ORDER_TYPE === "origin") return tabLabel(t("variation"));
    else if (ORDER_TYPE === "variant" || ORDER_TYPE === "simple")
      return tabLabel(t("modifier"));
    else if (ORDER_TYPE === "combo") return tabLabel(t("combo"));
    else if (ORDER_TYPE === "modifier")
      return tabLabel(t("modifier.variation"));
    else return null;
  };

  // const handleTabStyles = () => {
  //   if (ORDER_TYPE === "variant" || ORDER_TYPE === "simple")
  //     return { width: "145px" };
  //   else if (ORDER_TYPE === "modifier") return { width: "220px" };
  //   else return { width: "85px" };
  // };

  return (
    <Card className="m-4">
      <StyledTabs
        value={value}
        onChange={handleChange}
        centered={false}
        aria-label="full width tabs example"
        TabIndicatorProps={{ children: <span className="w-2" /> }}
        className="border-b"
      >
        <StyledTab label={tabLabel(t("recommended"))} {...a11yProps(0)} />

        {params.id && <StyledTab label={handleShowTabs()} {...a11yProps(1)} />}

        {params.id && ORDER_TYPE === "combo" && (
          <StyledTab label={tabLabel(t("modifier"))} {...a11yProps(2)} />
        )}

        {((params.id && ORDER_TYPE === "origin" && value === 1) ||
          (ORDER_TYPE === "modifier" && value === 1)) && (
          <div className="flex flex-1 items-center justify-end gap-3">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setConnectProductsModal(true)}
            >
              {t("connect.goods")}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setAddModal(true)}
            >
              {t("create.variation")}
            </Button>
          </div>
        )}
      </StyledTabs>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Recommended formik={formik} />
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
          {ORDER_TYPE === "origin" ? (
            <Variation
              parentFormik={formik}
              addModal={addModal}
              setAddModal={setAddModal}
              connectProductsModal={connectProductsModal}
              setConnectProductsModal={setConnectProductsModal}
            />
          ) : ORDER_TYPE === "variant" || ORDER_TYPE === "simple" ? (
            <Modifier formik={formik} />
          ) : ORDER_TYPE === "combo" ? (
            <Combo
              parentFormik={formik}
              addModal={addModal}
              setAddModal={setAddModal}
            />
          ) : (
            ORDER_TYPE === "modifier" && (
              <Variation
                parentFormik={formik}
                addModal={addModal}
                setAddModal={setAddModal}
                connectProductsModal={connectProductsModal}
                setConnectProductsModal={setConnectProductsModal}
              />
            )
          )}
        </TabPanel>

        <TabPanel value={value} index={2} dir={theme.direction}>
          {ORDER_TYPE === "combo" ? <Modifier formik={formik} /> : null}
        </TabPanel>
      </SwipeableViews>
    </Card>
  );
}
