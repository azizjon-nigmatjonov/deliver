import React, { useState, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import Client from "./Client";
import { useCustomerById } from "services";
import CustomSkeleton from "components/Skeleton";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import Filters from "components/Filters";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import { phoneValidation } from "utils/phoneValidator";
import TabPanel from "components/Tab/TabPanel";
import ClientOrders from "./Orders";
import customerService from "services/customer";

export default function CreateClient() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const [buttonLoader, setButtonLoader] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const initialValues = useMemo(
    () => ({
      name: "",
      phone: "",
      image: "",
      customer_type_id: "",
    }),
    [],
  );

  const validationSchema = () => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));

    return yup.object().shape({
      customer_type_id: defaultSchema,
      phone: phoneValidation(),
    });
  };

  const onSubmit = (values) => {
    const data = {
      name: values.name,
      phone: values.phone,
      image: values.image
        ? process.env.REACT_APP_MINIO_URL + "/" + values.image
        : undefined,
      customer_type_id: values.customer_type_id?.value,
    };
    saveChanges(data);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { setValues, handleSubmit } = formik;

  const { isFetching } = useCustomerById({
    id,
    props: {
      enabled: !!id,
      onSuccess: (data) => {
        setValues({
          name: data?.name,
          phone: data?.phone,
          image: data?.image?.split("/")[4],
          customer_type_id: {
            label: data?.client_type,
            value: data?.customer_type_id,
          },
        });
      },
    },
  });

  const saveChanges = (data) => {
    setButtonLoader(true);
    if (id) {
      customerService.update(id, data)
        .then(() => history.push("/home/clients"))
        .catch((err) =>
          console.log(
            dispatch(showAlert(t(err.data.Error?.Message ?? err.data.Error))),
          ),
        )
        .finally(() => setButtonLoader(false));
    } else {
      customerService.create(data)
        .then(() => history.push("/home/clients"))
        .catch((err) =>
          console.log(
            dispatch(showAlert(t(err.data.Error?.Message ?? err.data.Error))),
          ),
        )
        .finally(() => setButtonLoader(false));
    }
  };

  const routes = [
    {
      title: t("clients"),
      link: true,
      route: "/home/clients",
    },
    {
      title: id ? formik?.values.name : t("create"),
    },
  ];

  if (isFetching) return <CustomSkeleton />;

  return (
    <form
      onSubmit={handleSubmit}
      style={{ minHeight: "100vh" }}
      className="flex flex-col justify-between"
    >
      <div>
        <Header startAdornment={<Breadcrumb routes={routes} />} />
        <Filters>
          <StyledTabs
            value={tabValue}
            onChange={(_, value) => setTabValue(value)}
            indicatorColor="primary"
            textColor="primary"
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab label={t("about.client")} value={0} />
            {id && <StyledTab label={t("orders")} value={1} />}
          </StyledTabs>
        </Filters>

        <TabPanel value={tabValue} index={0}>
          <Client formik={formik} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ClientOrders customer_id={id} />
        </TabPanel>
      </div>
      <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
        <Button
          icon={CancelIcon}
          size="large"
          shape="outlined"
          color="red"
          iconClassName="red"
          borderColor="bordercolor"
          onClick={() => history.goBack()}
        >
          {t("cancel")}
        </Button>
        <Button
          icon={SaveIcon}
          size="large"
          type="submit"
          loading={buttonLoader}
        >
          {t(id ? "save" : "create")}
        </Button>
      </div>
    </form>
  );
}
