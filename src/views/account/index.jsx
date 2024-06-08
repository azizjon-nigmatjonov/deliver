import { useMemo, useState } from "react";
import Header from "components/Header";
import { useTranslation } from "react-i18next";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Filters from "components/Filters";
import Statistics from "./Statistics";
import PersonalData from "./PersonalData";
import Button from "components/Button";
import SaveIcon from "@mui/icons-material/Save";
import { useFormik } from "formik";
import { changePassword, updateOperator } from "services/operator";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "redux/actions/alertActions";

const Account = () => {
  const initialValues = useMemo(
    () => ({
      name: "",
      login: "",
      phone: "",
      old_password: "",
      new_password: "",
      confirm_password: "",
    }),
    [],
  );

  const formik = useFormik({
    // submitData,
    initialValues,
    // validationSchema,
  });

  const { values, setValues, handleChange } = formik;

  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [innerValue, setInnerValue] = useState(0);
  const { shipper_user_id } = useSelector((state) => state.auth);

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleOnChange = (event, newValue) => setValue(newValue);

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  const submitData = () => {
    if (innerValue === 0) {
      updateOperator(shipper_user_id, {
        name: values.name,
        phone: values.phone,
        username: values.login,
        user_role_id: values.user_role_id,
      })
        .then((res) => {
          dispatch(showAlert(t("Успешно изменен"), "success"));
        })
        .catch((error) => console.log(error));
    } else if (innerValue === 1) {
      changePassword({
        new_password: values.new_password,
        password: values.old_password,
      })
        .then((res) => dispatch(showAlert(t(res?.Message), "success")))
        .catch((error) => console.log(error));
    }
  };

  return (
    <div
      style={{ minHeight: "100vh" }}
      className="flex flex-col justify-between"
    >
      <div>
        <Header title={t("personal.profile")} />
        <Filters>
          <StyledTabs
            value={value}
            onChange={handleOnChange}
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab label={tabLabel(t("statistics"))} {...a11yProps(0)} />
            <StyledTab label={tabLabel(t("personal.data"))} {...a11yProps(1)} />
          </StyledTabs>
        </Filters>
        <SwipeableViews
          axis="x"
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0}>
            <Statistics />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PersonalData
              value={innerValue}
              setValue={setInnerValue}
              formik={formik}
              setValues={setValues}
              values={values}
              handleChange={handleChange}
            />
          </TabPanel>
        </SwipeableViews>
      </div>
      {value === 1 && (
        <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-4 gap-5">
          <Button
            icon={SaveIcon}
            size="small"
            onClick={() => submitData()}
            type="submit"
          >
            {innerValue === 0 ? t("change.data") : t("change.password")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Account;
