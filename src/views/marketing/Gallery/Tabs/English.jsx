import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import TextArea from "components/Textarea";
import { useTranslation } from "react-i18next";

export default function English({ formik }) {
  const { t } = useTranslation();
  const { values, handleChange } = formik;

  return (
    <>
      <Form.Item formik={formik} name="title.en" label={t("name")}>
        <Input
          size="large"
          id="title.en"
          placeholder={t("enter_title")}
          value={values.title.en}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item formik={formik} name="description.en" label={t("description")}>
        <TextArea
          id="description.en"
          placeholder={t("enter.description")}
          {...formik.getFieldProps("description.en")}
        />
      </Form.Item>
    </>
  );
}
