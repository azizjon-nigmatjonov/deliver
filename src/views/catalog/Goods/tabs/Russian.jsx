import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import TextArea from "components/Textarea";
import { useTranslation } from "react-i18next";

export default function Russian({ formik }) {
  const { t } = useTranslation();
  const { values, handleChange } = formik;

  return (
    <>
      <div>
        <Form.Item formik={formik} name="title_ru" required label={t("name")}>
          <Input
            size="large"
            id="title_ru"
            value={values.title_ru}
            onChange={handleChange}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item
          formik={formik}
          name="description_ru"
          label={t("description")}
          required
        >
          <TextArea
            id="description_ru"
            {...formik.getFieldProps("description_ru")}
          />
        </Form.Item>
      </div>
    </>
  );
}
