import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { updateJowiId, getJowiId, postJowiId } from "services/v2";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import Button from "components/Button";
import { showAlert } from "redux/actions/alertActions";
import { useDispatch } from "react-redux";

export default function JowiPowers() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    errorStatus === 404
      ? postJowiId(data)
          .then((res) => dispatch(showAlert(t(res?.Message), "success")))
          .catch((error) => console.log(error))
          .finally(() => {
            setSaveLoading(false);
          })
      : updateJowiId(data)
          .then((res) => dispatch(showAlert(t(res?.Message), "success")))
          .catch((error) => console.log(error))
          .finally(() => {
            setSaveLoading(false);
          });
  };

  const formik = useFormik({
    initialValues: {
      dispatcher_id: "",
    },
    validationSchema: yup.object().shape({
      dispatcher_id: yup.mixed().required(t("required.field.error")),
    }),
    onSubmit,
  });

  const { values, handleChange, setFieldValue, handleSubmit } = formik;

  useEffect(() => {
    getJowiId()
      .then((res) => setFieldValue("dispatcher_id", res?.dispatcher_id))
      .catch((err) => setErrorStatus(err.status));
  }, [setFieldValue]);

  return (
    <form onSubmit={handleSubmit}>
      <Card className="m-4">
        {/* Jowi ID Dispatcher */}
        <div className="input-label">{t("jowi_id")}</div>
        <div className="mb-4">
          <Form.Item formik={formik} name="dispatcher_id">
            <Input
              size="large"
              value={values.dispatcher_id}
              onChange={handleChange}
              name="dispatcher_id"
            />
          </Form.Item>
        </div>
        <Button type="submit" loading={saveLoading}>
          {t("save")}
        </Button>
      </Card>
    </form>
  );
}
