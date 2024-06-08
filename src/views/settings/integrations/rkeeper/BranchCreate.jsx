import { useMemo, useState, useCallback, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import Form from "components/Form/Index";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import { customStyles } from "components/Select";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { getBranches } from "services";
import CustomSkeleton from "components/Skeleton";
import { Input } from "alisa-ui";
import {
  getRkeeperOneBranchCredentials,
  postRKeeperBranchCredentials,
  updateRKeeperBranchCredentials,
} from "services/v2/rkeeper_credentials";
import * as yup from "yup";
import AsyncSelect from "components/Select/Async";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import Filters from "components/Filters";
import RkeeperDiscounts from "./discounts/RkeeperDiscounts";
import { updateCrmDiscount } from "services/v2/crm";

const BranchCreate = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [addDiscountModalStatus, setAddDiscountModalStatus] = useState(false);

  const initialValues = useMemo(
    () => ({
      rkeeper_url: "",
      branch_id: null,
      station_code: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      branch_id: defaultSchema,
      rkeeper_url: defaultSchema,
    });
  }, [t]);

  const onSubmit = (values) => {
    const data = {
      branch_id: values.branch_id.value,
      rkeeper_url: values.rkeeper_url,
      station_code: values.station_code,
      order_category_code: values.order_category_code,
    };

    setSaveLoading(true);

    const checkSubmit = params.id
      ? updateRKeeperBranchCredentials(data)
      : postRKeeperBranchCredentials(data);

    checkSubmit
      .then(() => {
        history.goBack();
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, setFieldValue, handleSubmit } = formik;

  useEffect(() => {
    if (params.id) {
      setLoader(true);
      getRkeeperOneBranchCredentials(params.id).then((res) => {
        setFieldValue("station_code", res?.station_code);
        setFieldValue("rkeeper_url", res?.rkeeper_url);
        setFieldValue("order_category_code", res?.order_category_code);
        setFieldValue("branch_id", {
          label: res?.branch_name,
          value: res?.branch_id,
        });
        setLoader(false);
      });
    }
  }, [params.id, setFieldValue]);

  const routes = [
    {
      title: t(`Rkeeper`),
      link: true,
      route: `/home/settings/integrations/rkeeper`,
    },
    {
      title: t("create"),
    },
  ];

  const headerButtons = (
    <>
      <Button
        icon={CancelIcon}
        size="large"
        shape="outlined"
        color="red"
        borderColor="bordercolor"
        onClick={() => history.goBack()}
      >
        {t("cancel")}
      </Button>
      <Button icon={SaveIcon} size="large" type="submit" loading={saveLoading}>
        {t("save")}
      </Button>
    </>
  );

  const loadBranches = useCallback((input, cb) => {
    getBranches({ page: 1, limit: 10, search: input })
      .then((response) => {
        let branches = response?.branches?.map((branch) => ({
          label: branch.name,
          value: branch.id,
        }));
        cb(branches);
      })
      .catch((error) => console.log(error));
  }, []);

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  if (loader) return <CustomSkeleton />;

  return (
    <>
      <Header startAdornment={[<Breadcrumb routes={routes} />]} />

      <Filters
        extra={
          value === 1 && (
            <div className="flex gap-4">
              <Button
                style={{
                  backgroundColor: "white",
                  color: "#0E73F6",
                  border: "1px solid #E5E9EB",
                }}
                onClick={() => updateCrmDiscount({ crm_type: "rkeeper" })}
              >
                {t("refresh")}
              </Button>
              <Button onClick={() => setAddDiscountModalStatus(true)}>
                {t("add")}
              </Button>
            </div>
          )
        }
      >
        <StyledTabs
          value={value}
          onChange={handleChange}
          centered={false}
          aria-label="full width tabs example"
          TabIndicatorProps={{ children: <span className="w-2" /> }}
        >
          <StyledTab
            label={tabLabel(t("branch"))}
            {...a11yProps(0)}
            style={{ width: "100px" }}
          />
          {params.id && (
            <StyledTab
              label={tabLabel(t("allowances"))}
              {...a11yProps(1)}
              style={{ width: "100px" }}
            />
          )}
        </StyledTabs>
      </Filters>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <form onSubmit={handleSubmit}>
            <div
              style={{ minHeight: "100vh" }}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="m-4">
                  <div className="grid grid-cols-2 gap-5">
                    <Card title={t("general.information")}>
                      <div className="grid grid-cols-4 gap-5 items-baseline">
                        <div className="col-span-2">
                          <Form.Item formik={formik} name="branch_id">
                            <div className="input-label">
                              <span style={{ color: "red" }}>*</span>{" "}
                              {t("branches")}
                            </div>
                            <AsyncSelect
                              id="aggregator-select"
                              defaultOptions
                              cacheOptions
                              isSearchable
                              isClearable
                              onChange={(val) =>
                                setFieldValue("branch_id", val)
                              }
                              value={values.branch_id}
                              loadOptions={loadBranches}
                              placeholder={t("branches")}
                              styles={customStyles({
                                control: (base) => ({
                                  ...base,
                                  minHeight: "2rem",
                                  height: "2rem",
                                  border: "1px solid #E5E9EB",
                                }),
                                indicatorSeparator: (base) => ({
                                  ...base,
                                  height: "1rem",
                                }),
                              })}
                            />
                          </Form.Item>
                        </div>

                        <div className="col-span-2">
                          <Form.Item formik={formik} name="key">
                            <div className="input-label">
                              <span style={{ color: "red" }}>*</span>{" "}
                              {t("RKeeper URL")}
                            </div>
                            <Input
                              placeholder={t("URL")}
                              value={values.rkeeper_url}
                              onChange={(el) =>
                                setFieldValue("rkeeper_url", el.target.value)
                              }
                              height={200}
                            />
                          </Form.Item>
                        </div>

                        <div className="col-span-2">
                          <Form.Item formik={formik} name="key">
                            <div className="input-label">
                              <span style={{ color: "red" }}>*</span>{" "}
                              {t("Код станции")}
                            </div>
                            <Input
                              placeholder={t("Код станции")}
                              value={values.station_code}
                              onChange={(el) =>
                                setFieldValue("station_code", el.target.value)
                              }
                              height={200}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-span-2">
                          <Form.Item formik={formik} name="order_category_code">
                            <div className="input-label">
                              <span style={{ color: "red" }}>*</span>{" "}
                              {t("Код категории заказа")}
                            </div>
                            <Input
                              value={values.order_category_code}
                              onChange={(el) =>
                                setFieldValue(
                                  "order_category_code",
                                  el.target.value,
                                )
                              }
                              name="order_category_code"
                              placeholder={t("Код категории заказа")}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
                {headerButtons}
              </div>
            </div>
          </form>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <RkeeperDiscounts
            addDiscountModalStatus={addDiscountModalStatus}
            setAddDiscountModalStatus={setAddDiscountModalStatus}
          />
        </TabPanel>
      </SwipeableViews>
    </>
  );
};

export default BranchCreate;
