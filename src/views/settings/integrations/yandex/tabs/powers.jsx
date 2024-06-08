import { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import { showAlert } from "redux/actions/alertActions";
import {
  postCrmCredentials,
  updateCrmCredentials,
  useCrmCredentials,
} from "services/v2/poster";
import Switch from "components/Switch";
import Button from "components/Button";
import { useDispatch } from "react-redux";

export default function Powers() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");

  useCrmCredentials({
    id: "yandex",
    props: {
      enabled: true,
      onSuccess: (res) => {
        setFieldValue("token", res?.crm_data?.token);
        setFieldValue("from_door_to_door", res?.crm_data?.from_door_to_door);
        setFieldValue(
          "as_order_delivery_price",
          res?.crm_data?.as_order_delivery_price,
        );
        setFieldValue("with_bag", res?.crm_data?.with_bag);
      },
      onError: (err) => setErrorStatus(err.status),
    },
  });

  const onSubmit = (values) => {
    const data = {
      crm_data: {
        token: values?.token,
        as_order_delivery_price: values?.as_order_delivery_price,
        with_bag: values?.with_bag,
        from_door_to_door: values?.from_door_to_door,
      },
      crm_type: "yandex",
    };

    setSaveLoading(true);
    errorStatus === 404
      ? postCrmCredentials(data)
          .then((res) =>
            dispatch(showAlert(t("successfully_created"), "success")),
          )
          .catch((error) => console.log(error))
          .finally(() => {
            setSaveLoading(false);
          })
      : updateCrmCredentials(data)
          .then((res) =>
            dispatch(showAlert(t("successfully_updated"), "success")),
          )
          .catch((error) => console.log(error))
          .finally(() => {
            setSaveLoading(false);
          });
  };

  const formik = useFormik({
    initialValues: {
      token: "",
      with_bag: false,
      as_order_delivery_price: false,
      from_door_to_door: false,
    },
    validationSchema: yup.object().shape({
      token: yup.mixed().required(t("required.field.error")),
    }),
    onSubmit,
  });

  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <Card className="m-4 w-1/2">
        <div className="flex flex-col gap-4 mb-4">
          <Form.Item formik={formik} name="token" label={t("token")}>
            <Input
              size="large"
              value={values.token}
              onChange={handleChange}
              name="token"
              placeholder={t("token")}
            />
          </Form.Item>
          <div className="flex items-center justify-between">
            <div className="input-label">{t("as_order_delivery_price")}</div>
            <Form.Item formik={formik} name="as_order_delivery_price">
              <Switch
                id="as_order_delivery_price"
                checked={values.as_order_delivery_price}
                onChange={(e) => setFieldValue("as_order_delivery_price", e)}
              />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between">
            <div className="input-label">{t("with_bag")}</div>
            <Form.Item formik={formik} name="with_bag">
              <Switch
                id="with_bag"
                checked={values.with_bag}
                onChange={(e) => setFieldValue("with_bag", e)}
              />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between">
            <div className="input-label">{t("from_door_to_door")}</div>
            <Form.Item formik={formik} name="from_door_to_door">
              <Switch
                id="from_door_to_door"
                checked={values.from_door_to_door}
                onChange={(e) => setFieldValue("from_door_to_door", e)}
              />
            </Form.Item>
          </div>
        </div>
        <Button type="submit" loading={saveLoading}>
          {t("save")}
        </Button>
      </Card>
    </form>
  );
}
