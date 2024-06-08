import { useTheme } from "@mui/material/styles";
import Card from "components/Card";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import { getOperator } from "services/operator";
import ChangePassword from "./FormFields/ChangePassword";
import PersonalInfo from "./FormFields/PersonalInfo";

const PersonalData = ({
  value,
  setValue,
  formik,
  setValues,
  values,
  handleChange,
}) => {
  // const [value, setValue] = useState(0);
  const { t } = useTranslation();

  const theme = useTheme();

  const { shipper_user_id } = useSelector((state) => state.auth);

  useEffect(() => {
    getOperator(shipper_user_id)
      .then((res) => {
        setValues({
          name: res?.name,
          login: res?.username,
          phone: res?.phone,
          user_role_id: res?.user_role_id,
        });
      })
      .catch((error) => console.log(error));
  }, [setValues, shipper_user_id]);

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChangeValue = (event, newValue) => setValue(newValue);

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  // const submitData = () => {
  //   if (value === 0) {
  //     updateOperator(shipper_user_id, {
  //       name: values.name,
  //       phone: values.phone,
  //       username: values.login,
  //       user_role_id: values.user_role_id,
  //     })
  //       .then((res) => {
  //         dispatch(showAlert(t("Успешно изменен"), "success"));
  //       })
  //       .catch((error) => console.log(error));
  //   } else if (value === 1) {
  //     changePassword({
  //       new_password: values.new_password,
  //       password: values.old_password,
  //     })
  //       .then((res) => dispatch(showAlert(t(res?.Message), "success")))
  //       .catch((error) => console.log(error));
  //   }
  // };

  // const validationSchema = useMemo(() => {
  //   const defaultSchema = yup.mixed().required(t("required.field.error"));
  //   return yup.object().shape({
  //     name: defaultSchema,
  //     login: defaultSchema,
  //     phone: defaultSchema,
  //     old_password: defaultSchema,
  //     new_password: defaultSchema,
  //     confirm_password: defaultSchema,
  //   });
  // }, []);

  return (
    <div className="flex flex-col justify-between">
      <div>
        <Card title={t("general.information")} className="m-4 w-2/3">
          <div>
            <StyledTabs
              value={value}
              onChange={handleChangeValue}
              centered={false}
              aria-label="full width tabs example"
              TabIndicatorProps={{ children: <span className="w-2" /> }}
              className="mb-4"
            >
              <StyledTab
                label={tabLabel(t("personal.data"))}
                {...a11yProps(0)}
                style={{ width: "155px" }}
                className="w-1/3"
              />
              <StyledTab
                label={tabLabel(t("change.password"))}
                {...a11yProps(1)}
                style={{ width: "155px" }}
                className="w-1/3"
              />
            </StyledTabs>
          </div>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <PersonalInfo
                formik={formik}
                values={values}
                handleChange={handleChange}
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <ChangePassword
                formik={formik}
                values={values}
                handleChange={handleChange}
              />
            </TabPanel>
          </SwipeableViews>
        </Card>
      </div>
      {/* <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-4 gap-5">
        <Button
          icon={SaveIcon}
          size="small"
          onClick={() => submitData()}
          type="submit"
          // onSubmit={submitData()}
          loading={saveLoading}
        >
          {value === 0 ? t("change.data") : t("change.password")}
        </Button>
      </div> */}
    </div>
  );
};

export default PersonalData;
