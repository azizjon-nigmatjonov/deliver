import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import TextArea from "components/Textarea";
import { useTranslation } from "react-i18next";

export default function English({ formik }) {
  const { t } = useTranslation();
  const { values, handleChange } = formik;

  return (
    <>
      <div>
        <Form.Item formik={formik} name="title_en" label={t("name")} required>
          <Input
            size="large"
            id="title_en"
            value={values.title_en}
            onChange={handleChange}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item
          formik={formik}
          name="description_en"
          label={t("description")}
          required
        >
          <TextArea
            id="description_en"
            {...formik.getFieldProps("description_en")}
          />
        </Form.Item>
      </div>
    </>
  );
}
