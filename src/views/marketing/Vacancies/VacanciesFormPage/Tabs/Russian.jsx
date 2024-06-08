import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import MDEditor from '@uiw/react-md-editor';

export default function Russian({ formik }) {
  const { t } = useTranslation();
  const { values, handleChange, setFieldValue } = formik;

  return (
    <>
      <Form.Item formik={formik} name="title.ru" label={"Называния позиции"}>
        <Input
          size="large"
          id="title.ru"
          placeholder={t("enter_title")}
          value={values.title.ru}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item formik={formik} name="description.ru" label={t("description")}>
        {/* <ReactQuill
          theme="snow"
          value={values.description.ru}
          onChange={}
        /> */}
        <MDEditor
        value={values.description.ru}
        onChange={(val) => setFieldValue("description.ru", val)}
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
