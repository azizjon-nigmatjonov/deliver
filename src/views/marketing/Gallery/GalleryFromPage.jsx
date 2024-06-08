import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";

import Card from "components/Card";
import Header from "components/Header";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";

import newsService, { useNewsById } from "services/v2/marketing/news";
import BaseFields from "./Tabs/BaseFields";
import Russian from "./Tabs/Russian";
import Uzbek from "./Tabs/Uzbek";
import English from "./Tabs/English";
import Button from "components/Button/Buttonv2";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import moment from "moment";

const GalleryFormPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const history = useHistory();
  const { id } = useParams();

  const initialValues = useMemo(
    () => ({
      description: {
        en: "",
        ru: "",
        uz: "",
      },
      from_date: "",
      images: [],
      title: {
        en: "",
        ru: "",
        uz: "",
      },
      to_date: "",
      type: "events",
    }),
    [],
  );

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    // Validation
    if (!data.from_date || !data.to_date) {
      dispatch(showAlert(t("enter.date")));
    } else if (!data.title.ru || !data.title.en || !data.title.uz) {
      dispatch(showAlert(t("enter_title_in_all_langs")));
    } else {
      if (id) return update(data);
      create(data);
    }
  };

  const update = (values) => {
    newsService
      .update(id, values)
      .then(() => history.goBack())
      .catch((err) => console.log(err));
  };
  const create = (values) => {
    newsService
      .create(values)
      .then(() => history.goBack())
      .catch((err) => console.log(err));
  };

  const formik = useFormik({ initialValues, onSubmit });

  const { handleSubmit, setValues } = formik;

  useNewsById({
    id,
    props: {
      enabled: !!id,
      onSuccess: (data) => {
        setValues({
          ...data,
          from_date: moment(data.form_date).format("YYYY-MM-DD"),
          to_date: moment(data.to_date).format("YYYY-MM-DD"),
        });
      },
    },
  });

  const headerTitle = useMemo(() => {
    return (
      <div className="flex gap-3 items-center">
        <IconButton variant="outlined" onClick={() => history.goBack()}>
          <ArrowBackIcon />
        </IconButton>
        <p>{id ? t("edit_events") : t("add_events")}</p>
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

  const handleChangeIndex = (index) => setTabValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-screen">
      <Header title={headerTitle} />
      <div className="flex-1 flex justify-between flex-col">
        <Card className="m-4 w-1/2">
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
              style={{ width: "150px" }}
            />
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={EnIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("english"))}
                </span>
              }
              {...a11yProps(1)}
              style={{ width: "150px" }}
            />
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={UzIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("uzbek"))}
                </span>
              }
              {...a11yProps(2)}
              style={{ width: "150px" }}
            />
          </StyledTabs>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={tabValue}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={tabValue} index={0} dir={theme.direction}>
              <BaseFields lang={<Russian />} formik={formik} />
            </TabPanel>
            <TabPanel value={tabValue} index={1} dir={theme.direction}>
              <BaseFields lang={<English />} formik={formik} />
            </TabPanel>
            <TabPanel value={tabValue} index={2} dir={theme.direction}>
              <BaseFields lang={<Uzbek />} formik={formik} />
            </TabPanel>
          </SwipeableViews>
        </Card>
        <div className="sticky bottom-0 flex justify-end items-center w-full bg-white border-t py-2 px-4 gap-3">
          <Button
            variant="outlined"
            color="error"
            onClick={() => history.goBack()}
            startIcon={<CancelIcon />}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            {t(id ? "save" : "create")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default GalleryFormPage;
