import React, { useMemo } from "react";
import GeneralInf from "./general";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Button from "components/Button";
import { useHistory, useParams } from "react-router-dom";

import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import Header from "components/Header";
import Breadcrumb from "components/Breadcrumb";
import OrderTime from "./orderTime";
import Attendance from "./attendance";
import { useBP, useBPMutations } from "services/v2/courier-bonus-penalty";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import TopOrders from "./topOrders";
import TopDelivered from "./topDelivered";
import TopOrdersCount from "./TopOrdersCount";

const BPForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const { postBP } = useBPMutations({
    props: {
      onSuccess: () => {
        dispatch(showAlert(t("successfully_created"), "success"));
        history.push("/home/personal/couriers/courier-bonus-penalty");
      },
    },
  });
  const { putBP } = useBPMutations({
    id: id,
    props: {
      onSuccess: () => {
        dispatch(showAlert(t("successfully_updated"), "success"));
        history.push("/home/personal/couriers/courier-bonus-penalty");
      },
    },
  });

  useBP({
    id: id,
    props: {
      enabled: id ? true : false,
      onSuccess: (res) => {
        setValues({
          bonus_penalty_datas: {
            amount: res?.bonus_penalty_datas?.amount,
            frequency_days: res?.bonus_penalty_datas?.frequency_days,
            minute: res?.bonus_penalty_datas?.minute,
            order_count: res?.bonus_penalty_datas?.order_count,
            every_month: res?.bonus_penalty_datas?.every_month,
            starting_date: res?.bonus_penalty_datas?.starting_date,
            amount_for_top: res?.bonus_penalty_datas?.amount_for_top?.map(
              (data) => ({
                amount: data,
              }),
            ),
          },
          bonus_penalty_for: {
            value: res?.bonus_penalty_for,
            label: t(res?.bonus_penalty_for),
          },
          name: res?.name,
          status: res?.status,
          type: {
            value: res?.type,
            label: t(res?.type),
          },
        });
      },
    },
  });

  const initialValues = useMemo(
    () => ({
      bonus_penalty_datas: {
        amount: "",
        frequency_days: "",
        minute: "",
        order_count: "",
        starting_date: "",
        every_month: false,
        amount_for_top: [],
      },
      bonus_penalty_for: "",
      name: {
        en: "",
        ru: "",
        uz: "",
      },
      status: false,
      type: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      amount: defaultSchema,
      frequency_days: defaultSchema,
      minute: defaultSchema,
      order_count: defaultSchema,
      type: defaultSchema,
      status: defaultSchema,
      every_month: defaultSchema,
      starting_date: defaultSchema,
      bonus_penalty_for: defaultSchema,
      name: yup.object().required(t("required.field")).shape({
        uz: defaultSchema,
        ru: defaultSchema,
        en: defaultSchema,
      }),
    });
  }, [t]);

  const languages = ["en", "ru", "uz"];
  // Object to store error messages for each field
  const fieldErrorMessages = {
    name: t("enter.name"),
    type: t("choose.type"),
    bonus_penalty_for: t("choose.bp.type"),
  };
  // Main validation function
  const validateForm = (values) => {
    for (const field in fieldErrorMessages) {
      if (Array.isArray(values[field]) && !values[field]?.length) {
        dispatch(showAlert(fieldErrorMessages[field], "error"));
        return false;
      } else if (
        typeof values[field] === "object" &&
        !Array.isArray(values[field])
      ) {
        const names = languages.map((lang) => values[field][lang]);
        const isValidNames = names.every((link) => !!link);
        if (!isValidNames) {
          dispatch(showAlert(fieldErrorMessages[field], "error"));
          return false;
        }
      } else if (!values[field]) {
        dispatch(showAlert(fieldErrorMessages[field], "error"));
        return false;
      }
    }
    return true;
  };

  const onSubmit = (values) => {
    const data = {
      bonus_penalty_datas: {
        amount: values?.bonus_penalty_datas?.amount || 0,
        frequency_days:
          values?.bonus_penalty_datas?.every_month === false
            ? values?.bonus_penalty_datas?.frequency_days || 0
            : 0,
        minute: values?.bonus_penalty_datas?.minute || 0,
        order_count: values?.bonus_penalty_datas?.order_count || 0,
        every_month: values?.bonus_penalty_datas?.every_month,
        starting_date: values?.bonus_penalty_datas?.starting_date,
        amount_for_top: values?.bonus_penalty_datas?.amount_for_top?.map(
          (data) => data?.amount,
        ),
      },
      bonus_penalty_for: values?.bonus_penalty_for?.value,
      name: values?.name,
      status: values?.status,
      type: values?.type?.value,
    };

    if (!validateForm(data)) return;
    id ? putBP.mutate(data) : postBP.mutate(data);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, setValues, handleSubmit } = formik;

  const routes = [
    {
      title: t("personal"),
      link: true,
      route: `/home/personal/couriers/list`,
    },
    {
      title: t("courier.bp"),
      link: true,
      route: `/home/personal/couriers/courier-bonus-penalty`,
    },
    {
      title: id ? t("edit") : t("create"),
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      style={{ minHeight: "100vh" }}
      className="flex flex-col"
    >
      <Header startAdornment={[<Breadcrumb routes={routes} />]} />
      <div className="p-4 w-full flex-1">
        <GeneralInf formik={formik} />
        {values?.bonus_penalty_for?.value === "order_delivered_time" && (
          <OrderTime formik={formik} />
        )}
        {values?.bonus_penalty_for?.value === "courier_attendance" && (
          <Attendance formik={formik} />
        )}
        {values?.bonus_penalty_for?.value === "top_courier_orders_count" && (
          <TopOrders formik={formik} />
        )}
        {values?.bonus_penalty_for?.value === "top_courier_delivered_time" && (
          <TopDelivered formik={formik} />
        )}
        {values?.bonus_penalty_for?.value === "orders_count" && (
          <TopOrdersCount formik={formik} />
        )}
      </div>
      <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-4 gap-5">
        <Button
          icon={CancelIcon}
          size="large"
          shape="outlined"
          color="red"
          borderColor="bordercolor"
          onClick={(e) => history.go(-1)}
        >
          {t("cancel")}
        </Button>
        <Button icon={SaveIcon} size="large" onClick={() => onSubmit(values)}>
          {t(id ? "edit" : "create")}
        </Button>
      </div>
    </form>
  );
};

export default BPForm;
