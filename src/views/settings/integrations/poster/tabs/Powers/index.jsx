import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import Button from "components/Button";
import {
  getCrmCredentials,
  postCrmCredentials,
  updateCrmCredentials,
} from "services/v2/poster";
import { showAlert } from "redux/actions/alertActions";
import { useDispatch } from "react-redux";

export default function Powers() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [btnLoading, setBtnLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const id = "poster";

  const onSubmit = (values) => {
    const data = {
      crm_data: {
        token: values.token,
        secret_key: values.secret_key,
        account: values.account,
      },
      crm_type: "poster",
    };

    errorStatus === 404
      ? postCrmCredentials(data).finally(() => {
          dispatch(showAlert(t("successfully_created"), "success"));
        })
      : updateCrmCredentials(data).finally(() => {
          dispatch(showAlert(t("successfully_updated"), "success"));
        });
  };

  const formik = useFormik({
    initialValues: {
      token: "",
      secret_key: "",
      account: "",
    },
    validationSchema: yup.object().shape({
      token: yup.mixed().required(t("required.field.error")),
      secret_key: yup.mixed().required(t("required.field.error")),
      account: yup.mixed().required(t("required.field.error")),
    }),
    onSubmit,
  });

  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  useEffect(() => {
    if (id === "poster") {
      getCrmCredentials(id)
        .then((res) => {
          setFieldValue("token", res?.crm_data?.token);
          setFieldValue("secret_key", res?.crm_data?.secret_key);
          setFieldValue("account", res?.crm_data?.account);
        })
        .catch((err) => {
          setErrorStatus(err?.status);
        });
    }
  }, []);

  return (
    <form
      className="flex flex-col justify-between"
      style={{ minHeight: "calc(100vh - 112px)" }}
    >
      <div className="flex-1">
        <Card className="m-4" title={"Добавить новую компанию"}>
          <div className="grid grid-cols-2 gap-4 items-baseline">
            <div className="">
              <div className="input-label">{t("token")}</div>
              <Form.Item formik={formik} name="token">
                <Input
                  size="large"
                  value={values.token}
                  onChange={handleChange}
                  name="token"
                  placeholder={t("token")}
                />
              </Form.Item>
            </div>
            <div className="">
              <div className="input-label">{t("secret_key")}</div>
              <Form.Item formik={formik} name="token">
                <Input
                  size="large"
                  value={values.secret_key}
                  onChange={handleChange}
                  name="secret_key"
                  placeholder={t("secret_key")}
                />
              </Form.Item>
            </div>
            <div className="">
              <div className="input-label">{t("account")}</div>
              <Form.Item formik={formik} name="account">
                <Input
                  size="large"
                  value={values.account}
                  onChange={handleChange}
                  name="account"
                  placeholder={t("account")}
                />
              </Form.Item>
            </div>
          </div>
        </Card>
      </div>
      <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-4">
        <Button
          size="large"
          loading={btnLoading}
          type="submit"
          onClick={handleSubmit}
        >
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
