import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { getAggregator, postAggregator, updateAggregator } from "services";

export default function AggregateCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      getAggregator(params.id).then((res) => {
        setValues({
          name: res?.name,
          phone_number: res?.phone_number,
        });
      });
    }
  }, []);

  const initialValues = useMemo(
    () => ({
      name: null,
      phone_number: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      name: defaultSchema,
      phone_number: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateAggregator(params.id, data)
      : postAggregator(data);
    selectedAction
      .then((res) => {
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

  const { setValues, handleSubmit } = formik;

  const routes = [
    {
      title: t(`integrations`),
      link: true,
      route: `/home/settings/integrations`,
    },
    {
      title: t("create"),
    },
  ];

  const headerButtons = [
    <Button
      icon={CancelIcon}
      size="large"
      shape="outlined"
      color="red"
      borderColor="bordercolor"
      onClick={() => history.goBack()}
    >
      {t("cancel")}
    </Button>,
    <Button icon={SaveIcon} size="large" type="submit" loading={saveLoading}>
      {t("save")}
    </Button>,
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />
      Сейчас в разработке
    </form>
  );
}
