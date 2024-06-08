import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import AboutBranch from "./tabs/AboutBranch";
import Button from "components/Button";
import { useHistory, useParams } from "react-router-dom";
import Breadcrumb from "components/Breadcrumb";
import { postBranch, updateBranch } from "services";
import { useFormik } from "formik";
import * as yup from "yup";
import { phoneValidation } from "utils/phoneValidator";
import { deleteGeozone } from "services/v2/geozone";

export default function Branch() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();

  const [saveLoading, setSaveLoading] = useState(false);
  const [geozonePoints, setGeozonePoints] = useState([]);

  const initialValues = useMemo(
    () => ({
      name: "",
      phone: "",
      destination: "", //not
      logo: "",
      location: {
        lat: "",
        long: "",
      },
      work_hour_start: "07:30",
      work_hour_end: "20:30",
      orders_limit: "",
      menu: "",
      fare_id: "",
      tg_chat_id: "",
      fare: "",
      distance: "",
      is_active: true,
      crm: "",
      geozone_id: "",
    }),
    [],
  );

  const onSubmit = (values) => {
    setSaveLoading(true);

    const data = {
      name: values.name,
      destination: values.destination,
      phone: values.phone,
      address: values.address,
      location: values.location,
      work_hour_end: values.work_hour_end,
      work_hour_start: values.work_hour_start,
      orders_limit: values.orders_limit,
      tg_chat_id: values.tg_chat_id,
      fare_id: values.fare_id?.value ? values.fare_id?.value : null,
      menu_id: values.menu?.value ? values.menu?.value : null,
      is_active: values.is_active,
      iiko_id: values.iiko_id,
      iiko_terminal_id: values.iiko_terminal_id,
      jowi_id: values.jowi_id,
      crm:
        values.crm.value === "R-Keeper"
          ? "rkeeper"
          : values.crm.value === "JOWI"
          ? "jowi"
          : values.crm.value === "Poster"
          ? "poster"
          : values.crm.value === "IIKO"
          ? "iiko"
          : "",
      image: values.image,
      geozone_id:
        values.geozone_id && geozonePoints.length > 0
          ? values.geozone_id
          : null,
    };

    if (values.geozone_id && !geozonePoints.length) {
      deleteGeozone(values.geozone_id);
    }

    params.id
      ? updateBranch(data, params.id)
          .then(
            (res) =>
              res?.answer === "success" &&
              history.push("/home/settings/company?tab=1"),
          )
          .finally(() => setSaveLoading(false))
      : postBranch(data)
          .then(() => history.push("/home/settings/company?tab=1"))
          .catch((error) => console.log(error))
          .finally(() => setSaveLoading(false));
  };

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      name: defaultSchema,
      phone: phoneValidation(),
      address: defaultSchema,
      orders_limit: defaultSchema,
      fare_id: defaultSchema,
    });
  }, [t]);

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { handleSubmit } = formik;

  const routes = [
    {
      title: t(`company.settings`),
      link: true,
      route: `/home/settings/company`,
    },
    {
      title: t(`company.branches`),
      link: true,
      route: `/home/settings/company?tab=1`,
    },
    {
      title: params.id ? t("edit") : t("create"),
    },
  ];

  return (
    <>
      <Header
        title={!params.id ? t("company.settings") : ""}
        startAdornment={<Breadcrumb routes={routes} />}
      />
      <div
        style={{ minHeight: "calc(100vh - 56px)" }}
        className="flex flex-col"
      >
        <AboutBranch
          formik={formik}
          geozonePoints={geozonePoints}
          setGeozonePoints={setGeozonePoints}
        />
        <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-2 gap-4">
          <Button
            color="red"
            shape="outlined"
            onClick={() => history.push("/home/settings/company?tab=1")}
            size="large"
            borderColor="bordercolor"
          >
            {t("cancel")}
          </Button>
          <Button
            size="large"
            type="submit"
            loading={saveLoading}
            onClick={handleSubmit}
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </>
  );
}
