import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import TextArea from "components/Textarea";
import { useTranslation } from "react-i18next";

export default function Uzbek({ formik }) {
  const { t } = useTranslation();
  const { values, handleChange } = formik;

  return (
    <>
      <Form.Item formik={formik} name="title.uz" label={t("name")}>
        <Input
          size="large"
          id="title.uz"
          placeholder={t("enter_title")}
          value={values.title.uz}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item formik={formik} name="description.uz" label={t("description")}>
        <TextArea
          id="description.uz"
          placeholder={t("enter.description")}
          {...formik.getFieldProps("description.uz")}
        />
      </Form.Item>
    </>
  );
}
