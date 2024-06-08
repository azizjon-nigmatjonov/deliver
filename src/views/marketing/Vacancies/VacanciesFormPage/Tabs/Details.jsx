import React, { useMemo, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
import Button from "components/Button/Buttonv2";
import Card from "components/Card";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import BaseFields from "./BaseFields";
import English from "./English";
import Russian from "./Russian";
import Uzbek from "./Uzbek";
import { showAlert } from "redux/actions/alertActions";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import vacancyService, {
  useVacancyById,
} from "services/v2/marketing/vacancies";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import TabPanel from "components/Tab/TabPanel";
import { useTranslation } from "react-i18next";

function Details() {
  const [tabValue, setTabValue] = useState(0);

  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const { t } = useTranslation();

  const initialValues = useMemo(
    () => ({
      description: {
        en: "",
        ru: "",
        uz: "",
      },
      is_active: true,
      title: {
        en: "",
        ru: "",
        uz: "",
      },
    }),
    [],
  );

  const onSubmit = (values) => {
    const data = values;

    // Validation
    if (!data.title.ru || !data.title.en || !data.title.uz) {
      dispatch(showAlert(t("enter_title_in_all_langs")));
    } else {
      if (id) return update(data);
      create(data);
    }
  };

  const update = (values) => {
    vacancyService
      .update(id, values)
      .then(() => history.goBack())
      .catch((err) => console.log(err));
  };
  const create = (values) => {
    vacancyService
      .create(values)
      .then(() => history.goBack())
      .catch((err) => console.log(err));
  };

  const formik = useFormik({ initialValues, onSubmit });

  const { handleSubmit, setValues } = formik;

  useVacancyById({
    id,
    props: {
      enabled: !!id,
      onSuccess: (data) => {
        setValues(data);
      },
    },
  });

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleChangeIndex = (index) => setTabValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );
  return (
    <div className="flex-1 flex justify-between flex-col">
      <div className="p-4">
        <Card className="w-full" style={{ maxWidth: 720 }}>
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
            className="border-b"
          >
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={RuIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("russian"))}
                </span>
              }
              {...a11yProps(0)}
            />
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={EnIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("english"))}
                </span>
              }
              {...a11yProps(1)}
            />
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={UzIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("uzbek"))}
                </span>
              }
              {...a11yProps(2)}
            />
          </StyledTabs>
          <SwipeableViews index={tabValue} onChangeIndex={handleChangeIndex}>
            <TabPanel
              value={tabValue}
              index={0}
              style={{ minHeight: "400px", overflowX: "visible" }}
            >
              <BaseFields lang={<Russian />} formik={formik} />
            </TabPanel>
            <TabPanel
              value={tabValue}
              index={1}
              style={{ minHeight: "400px", overflowX: "visible" }}
            >
              <BaseFields lang={<English />} formik={formik} />
            </TabPanel>
            <TabPanel
              value={tabValue}
              index={2}
              style={{ minHeight: "400px", overflowX: "visible" }}
            >
              <BaseFields lang={<Uzbek />} formik={formik} />
            </TabPanel>
          </SwipeableViews>
        </Card>
      </div>
      <div className="sticky bottom-0 flex justify-end items-center w-full bg-white border-t py-2 px-4 gap-3">
        <Button
          size="large"
          variant="outlined"
          color="error"
          onClick={() => history.goBack()}
          startIcon={<CancelIcon />}
        >
          {t("cancel")}
        </Button>
        <Button
          size="large"
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          {t(id ? "save" : "create")}
        </Button>
      </div>
    </div>
  );
}

export default Details;
