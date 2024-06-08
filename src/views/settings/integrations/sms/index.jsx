import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import SaveIcon from "@mui/icons-material/Save";
import {
  getSmsProvider,
  postSmsProvider,
  putSmsProvider,
} from "services/smsProvider";
import Select from "components/Select";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "redux/actions/alertActions";

export default function AggregateCreate() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [saveLoading, setSaveLoading] = useState(false);
  const [checkMethod, setCheckMethod] = useState({});

  const { shipper_id } = useSelector((state) => state.auth);

  const initialValues = useMemo(
    () => ({
      name: "",
      login: "",
      password: "",
      nickname: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      name: defaultSchema,
      login: defaultSchema,
      password: defaultSchema,
    });
  }, [t]);

  const onSubmit = (values) => {
    const data = {
      name: values.name,
      login: values.login,
      password: values.password,
      nickname: values.nickname,
    };

    setSaveLoading(true);
    if (
      checkMethod.name?.toString().length &&
      checkMethod.login?.toString().length &&
      checkMethod.password?.toString().length
    ) {
      putSmsProvider(data, shipper_id)
        .then(() => dispatch(showAlert(t("successfully_updated"), "success")))
        .finally(() => setSaveLoading(false));
    } else {
      postSmsProvider(data)
        .then(() => dispatch(showAlert(t("successfully_updated"), "success")))
        .finally(() => setSaveLoading(false));
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, setValues, handleSubmit, setFieldValue } =
    formik;

  const headerButtons = (
    <>
      <Button
        icon={SaveIcon}
        size="large"
        onClick={handleSubmit}
        loading={saveLoading}
      >
        {t("save")}
      </Button>
    </>
  );

  useEffect(() => {
    shipper_id &&
      getSmsProvider(shipper_id).then((res) => {
        setValues(res);
        setCheckMethod(res);
      });
  }, [shipper_id, setValues]);

  return (
    <form>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <div>
          <Header title={t("sms")} />
          <Card
            title={"Заполните поля"}
            className="m-4"
            bodyClass="flex flex-col gap-2"
          >
            <Form.Item formik={formik} name="name" label={t("provider")}>
              <Select
                value={{ label: values.name, value: values.name }}
                options={[
                  { label: "Playmobile", value: "Playmobile" },
                  { label: "Eskiz", value: "Eskiz" },
                  { label: "Twilio", value: "Twilio" },
                ]}
                onChange={({ value }) => setFieldValue("name", value)}
              />
            </Form.Item>
            <Form.Item formik={formik} name="login" label={t("login")}>
              <Input
                id="login"
                value={values?.login}
                placeholder="Логин"
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item formik={formik} name="password" label={t("password")}>
              <Input
                id="password"
                value={values?.password}
                onChange={handleChange}
                placeholder="Пароль"
              />
            </Form.Item>
            <Form.Item
              formik={formik}
              name="nickname"
              label={`${t("nickname")} (nickname)`}
            >
              <Input
                id="nickname"
                value={values?.nickname}
                onChange={handleChange}
                placeholder={t("nickname")}
              />
            </Form.Item>
          </Card>
        </div>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          {headerButtons}
        </div>
      </div>
    </form>
  );
}
