import React, { useMemo, useState } from "react";
import styles from "./styles.module.scss";
import Payments from "./Cards/Payments";
import Colours from "./Cards/Colours";
import Links from "./Cards/Links";
import OrderTypes from "./Cards/OrderTypes";
import AboutTexts from "./Cards/AboutTexts";
import Header from "components/Header";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import {
  useSourceSettings,
  useSourceSettingsMutations,
} from "services/v2/sourceSettings";
import { Grid } from "@mui/material";
import { showAlert } from "redux/actions/alertActions";
import { useDispatch } from "react-redux";
import Button from "components/Button";
import SaveIcon from "@mui/icons-material/Save";

const sources = ["admin_panel", "website", "app", "hall", "webapp"];
const payments = ["cash", "payme", "click", "apelsin", "transfer"];
const orderTypes = ["delivery", "self_pickup"];
const socialLinks = ["Instagram", "Telegram", "Facebook"];

const ContentSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveLoading, setSaveLoading] = useState(false);

  const { data } = useSourceSettings({
    props: {
      enabled: true,
      retry: 0,
      onSuccess: (data) => {
        setValues({
          colours: {
            primary: data?.colours?.primary || "#fff",
            secondary: data?.colours?.secondary || "#fff",
            brand: data?.colours?.brand || "#fff",
          },
          sources: data?.sources?.map((source) => ({
            links: source?.links?.map((link) => ({
              ...link,
              value: link?.value ? String(link?.value) : "",
              is_used: Boolean(link?.is_used),
            })),
            payment_types: source?.payment_types?.map((payment) => ({
              ...payment,
            })),
            order_types: source?.order_types?.map((type) => ({
              ...type,
              is_used: Boolean(type?.is_used),
            })),
            source: source?.source,
            image: source?.image,
            about_us: source?.about_us,
          })),
        });
      },
    },
  });

  const { putSourceSetting } = useSourceSettingsMutations({
    props: {
      onSuccess: (res) => {
        dispatch(showAlert(t("successfully_updated"), "success"));
        setSaveLoading(false);
      },
    },
  });

  const { postSourceSetting } = useSourceSettingsMutations({
    props: {
      onSuccess: (res) => {
        dispatch(showAlert(t("successfully_created"), "success"));
        setSaveLoading(false);
      },
    },
  });

  const initialValues = useMemo(
    () => ({
      colours: {
        brand: "#fff",
        primary: "#fff",
        secondary: "#fff",
      },
      shipper_id: "",
      sources: sources.map((source) => ({
        about_us: {
          en: "",
          ru: "",
          uz: "",
        },
        image: "",
        links: socialLinks.map((type) => ({
          is_used: true,
          label: type,
          value: "",
        })),
        order_types: orderTypes.map((type) => ({
          is_used: false,
          label: t(type),
          value: type,
        })),
        payment_types: payments.map((type) => ({
          is_used: false,
          label: t(type),
          value: type,
        })),

        source: source,
      })),
    }),
    [t],
  );

  const onSubmit = (values) => {
    setSaveLoading(true);
    data?.created_at
      ? putSourceSetting.mutate(values)
      : postSourceSetting.mutate(values);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  const { handleSubmit, setValues } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <Header title={t("ContentSettings")} />
        <div className={styles.container}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Payments
                className={styles.box}
                formik={formik}
                sources={sources}
                payments={payments}
              />
            </Grid>
            <Grid item xs={6}>
              <Colours className={styles.box} formik={formik} />
            </Grid>
            <Grid item xs={6}>
              <Links
                className={styles.box}
                formik={formik}
                socialLinks={socialLinks}
              />
            </Grid>
            <Grid item xs={6}>
              <OrderTypes
                className={styles.box}
                formik={formik}
                orderTypes={orderTypes}
              />
            </Grid>
            <Grid item xs={12}>
              <AboutTexts className={styles.box} formik={formik} />
            </Grid>
          </Grid>
        </div>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          <Button
            icon={SaveIcon}
            size="large"
            type="submit"
            loading={saveLoading}
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ContentSettings;
