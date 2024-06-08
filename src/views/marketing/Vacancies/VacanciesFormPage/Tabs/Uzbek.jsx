import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import MDEditor from '@uiw/react-md-editor';

export default function Uzbek({ formik }) {
  const { t } = useTranslation();
  const { values, handleChange, setFieldValue } = formik;

  return (
    <>
      <Form.Item formik={formik} name="title.uz" label={"Называния позиции"}>
        <Input
          size="large"
          id="title.uz"
          placeholder={t("enter_title")}
          value={values.title.uz}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item formik={formik} name="description.uz" label={t("description")}>
      <MDEditor
        value={values.description.uz}
        onChange={(val) => setFieldValue("description.uz", val)}
        preview="edit"
        components={{
          toolbar: (command, disabled, executeCommand) => {
            if (command.keyCommand === 'code' || command.keyCommand === 'image' ||command.keyCommand === 'codeBlock' ||command.keyCommand === 'hr' ||command.keyCommand === 'comment' || command.name === 'checked-list'|| command.keyCommand === 'preview' || command.keyCommand === 'fullscreen'  ) {
              return <></>
            }
          }
        }}
      />
      </Form.Item>
    </>
  );
}
