import { cloneElement } from "react";
import { useTranslation } from "react-i18next";
import Form from "components/Form/Index";
import { Switch } from "@mui/material";

function BaseFields({ formik, lang }) {
  const { t } = useTranslation();
  const { values, setFieldValue } = formik;

  return (
    <div className="flex flex-col gap-3 p-4">
      {cloneElement(lang, {
        formik: formik,
      })}
      <Form.Item formik={formik} name="from_date" label={t("status")}>
        <Switch
          checked={values.is_active}
          onChange={(e) => setFieldValue("is_active", e.target.checked)}
        />
      </Form.Item>
    </div>
  );
}

export default BaseFields;
