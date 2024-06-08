import { FormikProvider, FieldArray } from "formik";
import Form from "components/Form/Index";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { Input } from "alisa-ui";
import Tag from "components/Tag";
import Button from "components/Button";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& > button": {
//       width: "100%",
//       fontSize: "14px",
//       borderColor: "#E5E9EB",
//       backgroundColor: "#fff",
//       color: "#4094f7",
//       padding: "8px 0 8px 0",
//     },
//     "& > *:hover": {
//       borderColor: "#ecf4fe",
//       backgroundColor: "#ecf4fe",
//     },
//     "& > span": {
//       fontSize: "26px",
//     },
//   },
// }));

const Russian = ({ formik }) => {
  const { t } = useTranslation();

  const { values, setFieldValue } = formik;

  return (
    <div className="mt-4 mb-4">
      <FormikProvider value={formik}>
        <FieldArray name="options">
          {({ push, remove }) => (
            <>
              {values?.options?.map((option, index) => (
                <div
                  className="flex items-center justify-between gap-2 mb-4"
                  key={index}
                >
                  <div className="flex-1">
                    <div title={t("name.option")}>
                      <Form.FieldArrayItem
                        formik={formik}
                        name="title"
                        index={index}
                        custom={true}
                        custom_error={
                          formik.errors["options"]?.[index]?.["title"]?.["ru"]
                        }
                      >
                        <Input
                          type="text"
                          id="title"
                          size="large"
                          name="title"
                          value={values.options[index]?.title?.ru}
                          onChange={(val) => {
                            setFieldValue(
                              `options[${index}].title.ru`,
                              val.target.value,
                            );
                          }}
                        />
                      </Form.FieldArrayItem>
                    </div>
                  </div>
                  <Tag
                    color="error"
                    lightMode={true}
                    size="large"
                    shape="subtle"
                    className="cursor-pointer"
                  >
                    <DeleteIcon color="error" onClick={() => remove(index)} />
                  </Tag>
                </div>
              ))}
              <Button
                variant="outlined"
                onClick={() =>
                  push({
                    id: "",
                    title: {
                      uz: "",
                      ru: "",
                      en: "",
                    },
                  })
                }
              >
                {t("add")}
              </Button>
            </>
          )}
        </FieldArray>
      </FormikProvider>
    </div>
  );
};

export default Russian;
