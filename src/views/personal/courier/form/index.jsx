import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

//components and functions
import Breadcrumb from "../../../../components/Breadcrumb";
import Header from "../../../../components/Header";
import Button from "../../../../components/Button";
import {
  getCourier,
  getCourierTransport,
  postCourier,
  postCourierTransport,
  updateCourier,
  updateCourierTransport,
} from "../../../../services/courier";
import { getCourierTypes } from "../../../../services/courierType";
import CustomSkeleton from "../../../../components/Skeleton";
import CreateCourier from "./Create";
//icons
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { StyledTab, StyledTabs } from "../../../../components/StyledTabs";
import Filters from "../../../../components/Filters";
import CreateTransport from "./transport";
import TransactionTable from "./transactions";
import OrderCourier from "./orders";
import AddIcon from "@mui/icons-material/Add";
import { phoneValidation } from "utils/phoneValidator";
import Balance from "./balance";

export default function MainCourier() {
  const history = useHistory();
  const { id } = useParams();
  const { t } = useTranslation();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [courierTypes, setCourierTypes] = useState([]);
  const [selectedTab, setSelectedTab] = useState("courier");
  const [transportID, setTransportID] = useState("");
  const [courierId, setCourierId] = useState({
    id: "",
    type: "",
  });

  useEffect(() => {
    fetchData();
    getItem();
  }, []);

  const TabBody = useCallback(
    ({ tab, children }) => {
      if (tab === selectedTab) return children;
      return <></>;
    },
    [selectedTab],
  );

  const tabLabel = (text, isActive = false) => {
    return <span className="px-1">{text}</span>;
  };

  const headersByTab = useMemo(() => {
    switch (selectedTab) {
      case "courier":
      case "transport":
        return [
          <Button
            icon={CancelIcon}
            size="large"
            shape="outlined"
            color="red"
            borderColor="bordercolor"
            onClick={(e) => history.go(-1)}
          >
            {t("cancel")}
          </Button>,
          <Button
            icon={SaveIcon}
            size="large"
            type="submit"
            loading={saveLoading}
            onClick={() => console.log()}
          >
            {t(id ? "save" : "create")}
          </Button>,
        ];
      case "transactions":
        return [
          <Button icon={AddIcon} size="medium" onClick={() => console.log("c")}>
            {t("add")}
          </Button>,
        ];
      case "orders":
        return [
          <Button icon={AddIcon} size="medium" onClick={() => console.log("c")}>
            {t("add")}
          </Button>,
        ];
      default:
        return [];
    }
  }, [selectedTab]);

  const getItem = () => {
    if (!id) return setLoader(false);
    setLoader(true);
    getCourier(id)
      .then((res) => {
        setCourierId((prev) => ({
          ...prev,
          id: res?.courier_type?.id,
        }));
        setValues({
          first_name: res?.first_name,
          last_name: res?.last_name,
          max_orders_count: res?.max_orders_count,
          phone: res?.phone,
          region: {
            label: res?.region_name,
            value: res?.region_id,
          },
          courier_type: {
            label: res?.courier_type?.name,
            value: res?.courier_type?.id,
          },
          is_active: res?.is_active,
          is_working: res?.is_working,
          login: res?.login,
          fare_id: {
            value: res?.fare_id,
            lable: res?.fare_name,
          },
        });
        res?.courier_type?.type !== "velo" &&
          res?.courier_type?.type !== "unmounted" &&
          getCourierTransport(id).then((res) => {
            setFieldValue("brand", res?.brand);
            setFieldValue("model", res?.model);
            setFieldValue("color", res?.color);
            setFieldValue("vehicle_number", res?.vehicle_number);
            setTransportID(res?.id);
          });
      })
      .finally(() => setLoader(false));
  };

  const fetchData = async () => {
    setLoader(true);
    try {
      const { courier_type } = await getCourierTypes({ limit: 200 });
      setCourierTypes(
        courier_type
          ? courier_type.map((elm) => ({
              label: elm.name,
              value: elm.id,
              type: elm.type,
            }))
          : [],
      );
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
  };

  console.log(courierId);
  const initialValues = useMemo(
    () => ({
      first_name: "",
      last_name: "",
      login: "",
      phone: "",
      max_orders_count: "",
      courier_type: "",
      fare_id: "",
      is_active: false,
      is_working: false,
      brand: "",
      model: "",
      color: "",
      vehicle_number: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      first_name: defaultSchema,
      last_name: defaultSchema,
      login: defaultSchema,
      max_orders_count: defaultSchema,
      phone: phoneValidation(),
      courier_type: defaultSchema,
      // brand: defaultSchema,
      // model: defaultSchema,
      // color: defaultSchema,
      // vehicle_number: defaultSchema,
    });
  }, []);

  const saveChanges = (data) => {
    setSaveLoading(true);
    const selectedAction = id ? updateCourier(id, data) : postCourier(data);
    selectedAction
      .then(() => {
        history.goBack();
      })
      .finally(() => setSaveLoading(false));
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
      courier_type_id: values.courier_type.value,
      phone: values.phone,
      is_acitve: values.is_acitve,
      is_working: values.is_working,
      fare_id: values.fare_id.value,
    };
    delete data.courier_type;
    delete data.brand;
    delete data.model;
    delete data.color;
    delete data.vehicle_number;
    delete data.region;
    saveChanges(data);

    const transportData = {
      brand: values?.brand,
      model: values?.model,
      color: values?.color,
      vehicle_number: values?.vehicle_number,
      courier_id: id,
    };

    transportID && delete transportData.courier_id;

    id && transportID
      ? updateCourierTransport(transportID, transportData)
      : id && !transportID && postCourierTransport(transportData);
  };

  let ID = courierId.id;
  useEffect(() => {
    let filteredID = courierTypes?.find((type) => type.value === courierId.id);
    setCourierId((prev) => ({
      ...prev,
      type: filteredID?.type,
    }));
    setCourierId((prev) => ({
      ...prev,
      type: filteredID?.type,
    }));
  }, [ID]);

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  const { setValues, setFieldValue, values } = formik;
  if (loader) return <CustomSkeleton />;

  const routes = [
    {
      title: t("personal"),
      link: true,
      route: `/home/personal/couriers/list`,
    },
    {
      title: t("couriers"),
      link: true,
      route: `/home/personal/couriers/list`,
    },
    {
      title: id ? formik.values?.courier_type?.label : t("create"),
    },
  ];

  const { handleSubmit } = formik;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div
          style={{ minHeight: "100vh" }}
          className="flex flex-col justify-between"
        >
          <div>
            <Header startAdornment={[<Breadcrumb routes={routes} />]} />
            <Filters className="mb-0">
              <StyledTabs
                value={selectedTab}
                onChange={(_, value) => {
                  setSelectedTab(value);
                }}
                indicatorColor="primary"
                textColor="primary"
                centered={false}
                aria-label="full width tabs example"
                TabIndicatorProps={{ children: <span className="w-2" /> }}
              >
                <StyledTab label={tabLabel(t("main.page"))} value="courier" />
                {id &&
                  courierId?.type !== "velo" &&
                  courierId?.type !== "unmounted" && (
                    <StyledTab
                      label={tabLabel(t("transport"))}
                      value="transport"
                    />
                  )}
                {id && (
                  <StyledTab
                    label={tabLabel(t("transactions"))}
                    value="transactions"
                  />
                )}
                {id && (
                  <StyledTab label={tabLabel(t("orders"))} value="orders" />
                )}
                {id && (
                  <StyledTab label={tabLabel(t("balance"))} value="balance" />
                )}
              </StyledTabs>
            </Filters>

            <TabBody tab="courier">
              <CreateCourier
                formik={formik}
                courierTypes={courierTypes}
                setCourierId={setCourierId}
              />
            </TabBody>
            {courierId?.type !== "velo" && courierId?.type !== "unmounted" && (
              <TabBody tab="transport">
                <CreateTransport formik={formik} />
              </TabBody>
            )}
            <TabBody tab="transactions">
              <TransactionTable />
            </TabBody>
            <TabBody tab="orders">
              <OrderCourier courier_id={id} />
            </TabBody>
            <TabBody tab="balance">
              <Balance />
            </TabBody>
          </div>
          <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-4 gap-5">
            {headersByTab}
          </div>
        </div>
      </form>
    </div>
  );
}
