import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import TextArea from "components/Textarea";
import { useTranslation } from "react-i18next";

export default function Russian({ formik }) {
  const { t } = useTranslation();
  const { values, handleChange } = formik;

  return (
    <>
      <Form.Item formik={formik} name="title.ru" label={t("name")}>
        <Input
          size="large"
          id="title.ru"
          placeholder={t("enter_title")}
          value={values.title.ru}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item formik={formik} name="description.ru" label={t("description")}>
        <TextArea
          id="description.ru"
          placeholder={t("enter.description")}
          {...formik.getFieldProps("description.ru")}
        />
      </Form.Item>
    </>
  );
}
