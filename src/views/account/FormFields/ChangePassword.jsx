import React from "react";
import Form from "components/Form/Index";
import { useTranslation } from "react-i18next";
import { Input } from "alisa-ui";

const ChangePassword = ({ formik, handleChange, values }) => {
  const { t } = useTranslation();

  return (
    <div>
      <form>
        <>
          <div className="input-label">
            <span>{t("old_password")}</span>
          </div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="old_password">
              <Input
                size="large"
                id="old_password"
                type="password"
                value={values.old_password}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </>

        <>
          <div className="input-label">
            <span>{t("new.password")}</span>
          </div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="new_password">
              <Input
                size="large"
                id="new_password"
                type="password"
                value={values.new_password}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </>

        <>
          <div className="input-label">
            <span>{t("confirm.password")}</span>
          </div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="confirm_password">
              <Input
                size="large"
                id="confirm_password"
                type="password"
                value={values.confirm_password}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </>
      </form>
    </div>
  );
};

export default ChangePassword;
