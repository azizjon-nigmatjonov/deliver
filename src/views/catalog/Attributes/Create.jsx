import React, { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik, FormikProvider, FieldArray } from "formik";
import Form from "components/Form/Index";

import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { getProperty, postProperty, updateProperty } from "services/v2";
import Filters from "components/Filters";
import useMultiLanguage from "hooks/useMultiLanguage";
import Switch from "components/Switch";
import { Input } from "alisa-ui";
import Tag from "components/Tag";
import DeleteIcon from "@mui/icons-material/Delete";

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

export default function AttributesCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [lang, setLang] = useState("ru");

  const initialValues = useMemo(
    () => ({
      title_ru: "",
      title_en: "",
      title_uz: "",
      description_ru: "",
      description_en: "",
      description_uz: "",
      active: false,
      options: [
        {
          id: "",
          title: {
            uz: "",
            ru: "",
            en: "",
          },
        },
      ],
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      title_ru: defaultSchema,
      title_en: defaultSchema,
      title_uz: defaultSchema,
      description_ru: defaultSchema,
      description_en: defaultSchema,
      description_uz: defaultSchema,
      options: yup.array().of(
        yup
          .object()
          .required(t("required.field"))
          .shape({
            title: yup.object().shape({
              uz: defaultSchema,
              ru: defaultSchema,
              en: defaultSchema,
            }),
          }),
      ),
    });
  }, [t]);

  const onSubmit = (values) => {
    const data = {
      title: {
        ru: values.title_ru,
        uz: values.title_uz,
        en: values.title_en,
      },
      description: {
        ru: values.description_ru,
        uz: values.description_uz,
        en: values.description_en,
      },
      active: values.active,
      options: values.options,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateProperty(params.id, data)
      : postProperty(data);
    selectedAction
      .then((res) => {
        history.goBack();
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, setFieldValue, setValues, handleSubmit } = formik;

  const [Tabs, Views] = useMultiLanguage();

  useEffect(() => {
    if (params.id) {
      getProperty(params.id).then((res) => {
        setValues({
          title_ru: res?.title?.ru,
          title_en: res?.title?.en,
          title_uz: res?.title?.uz,
          description_ru: res?.description?.ru,
          description_en: res?.description?.en,
          description_uz: res?.description?.uz,
          active: res?.active,
          options: res?.options.map((option) => ({
            id: option.id,
            title: {
              uz: option.title.uz,
              en: option.title.en,
              ru: option.title.ru,
            },
          })),
        });
      });
    }
  }, [params.id, setValues]);

  const routes = [
    {
      title: t(`attributes`),
      link: true,
      route: `/home/catalog/attributes`,
    },
    {
      title: params.id ? t("edit") : t("create"),
    },
  ];

  const headerButtons = (
    <>
      <Button
        icon={CancelIcon}
        size="large"
        shape="outlined"
        color="red"
        borderColor="bordercolor"
        onClick={() => history.goBack()}
      >
        {t("cancel")}
      </Button>

      <Button icon={SaveIcon} size="large" type="submit" loading={saveLoading}>
        {t("save")}
      </Button>
    </>
  );

  useEffect(() => {
    if (value === 0) setLang("ru");
    else if (value === 1) setLang("en");
    else if (value === 2) setLang("uz");
  }, [value]);

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <div>
          <Header startAdornment={<Breadcrumb routes={routes} />} />
          <Filters>
            <Tabs formik={formik} value={value} setValue={setValue} />
          </Filters>
          <div className="m-4">
            <div>
              <Views value={value} setValue={setValue} formik={formik}>
                {(Language) => (
                  <div className="grid grid-cols-2 gap-5">
                    <Card title={t("general.information")}>
                      <div className="grid grid-cols-3 items-baseline">
                        {React.cloneElement(Language, {
                          firstFormikId: "title",
                          secondLabel: "description.long",
                        })}

                        <div className="input-label">
                          <span>{t("status")}</span>
                        </div>
                        <div className="col-span-2">
                          <Switch
                            checked={values.active}
                            onChange={(status, e) =>
                              setFieldValue("active", status)
                            }
                          />
                        </div>
                      </div>
                    </Card>

                    <Card title={t("options")}>
                      <FormikProvider value={formik}>
                        <FieldArray name="options">
                          {({ push, remove }) => (
                            <>
                              {values?.options?.map((option, index) => (
                                <div
                                  className="flex items-center justify-between"
                                  key={index}
                                >
                                  <div className="w-5/6">
                                    <div className="input-label">
                                      {t("name.option")}
                                    </div>
                                    <div className="">
                                      <Form.FieldArrayItem
                                        formik={formik}
                                        name="title"
                                        index={index}
                                        custom={true}
                                        custom_error={
                                          formik.errors["options"]?.[index]?.[
                                            "title"
                                          ]?.[lang]
                                        }
                                      >
                                        <Input
                                          type="text"
                                          id="title"
                                          size="large"
                                          name="title"
                                          value={
                                            values.options[index]?.title?.[lang]
                                          }
                                          onChange={(val) => {
                                            setFieldValue(
                                              `options[${index}].title.${lang}`,
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
                                    <DeleteIcon
                                      onClick={() => remove(index)}
                                      style={{ color: "red" }}
                                    />
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
                    </Card>
                  </div>
                )}
              </Views>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          {headerButtons}
        </div>
      </div>
    </form>
  );
}
