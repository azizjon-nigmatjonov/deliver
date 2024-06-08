import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import TextArea from "components/Textarea";
import { useTranslation } from "react-i18next";

export default function Uzbek({ formik }) {
  const { t } = useTranslation();
  const { values, handleChange } = formik;

  return (
    <>
      <div>
        <Form.Item formik={formik} name="title_uz" label={t("name")} required>
          <Input
            size="large"
            id="title_uz"
            value={values.title_uz}
            onChange={handleChange}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item
          formik={formik}
          name="description_uz"
          label={t("description")}
          required
        >
          <TextArea
            id="description_uz"
            {...formik.getFieldProps("description_uz")}
          />
        </Form.Item>
      </div>
    </>
  );
}
