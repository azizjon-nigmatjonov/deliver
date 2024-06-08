import React from "react";
import Form from "components/Form/Index";
import { useTranslation } from "react-i18next";
import { Input } from "alisa-ui";

const PersonalInfo = ({ formik, handleChange, values }) => {
  const { t } = useTranslation();

  return (
    <div>
      <form>
        <>
          <div className="input-label">
            <span>{t("name")}</span>
          </div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="name">
              <Input
                size="large"
                id="name"
                value={values.name}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </>

        <>
          <div className="input-label">
            <span>{t("login")}</span>
          </div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="login">
              <Input
                size="large"
                id="login"
                value={values.login}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </>

        <>
          <div className="input-label">
            <span>{t("phone.number")}</span>
          </div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="phone">
              <Input
                size="large"
                id="phone"
                value={values.phone}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </>
      </form>
    </div>
  );
};

export default PersonalInfo;
