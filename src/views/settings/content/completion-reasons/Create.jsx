import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import {
  getCompletionReason,
  postCompletionReason,
  updateCompletionReason,
} from "services";
import CustomSkeleton from "components/Skeleton";

export default function CompletionReasonsCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const initialValues = useMemo(
    () => ({
      text: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      text: defaultSchema,
    });
  }, [t]);

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateCompletionReason(params.id, data)
      : postCompletionReason(data);
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

  const { values, handleChange, setValues, handleSubmit } = formik;

  const routes = [
    {
      title: t(`completion-reasons`),
      link: true,
      route: `/home/settings/content/cancel-reasons`,
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
    if (params.id) {
      getCompletionReason(params.id)
        .then((res) => {
          setValues({
            text: res?.text,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [params.id, setValues]);

  return !isLoading ? (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <div>
          <Header
            title={params.id ? t("edit") : t("add")}
            startAdornment={<Breadcrumb routes={routes} />}
          />
          <div className="m-4">
            <div className="grid grid-cols-2 gap-5">
              <Card title={t("general.information")}>
                <div className="flex flex-col items-baseline">
                  <div className="input-label">{t("reason.name")}</div>
                  <div className="w-full">
                    <Form.Item formik={formik} name="text">
                      <Input
                        size="large"
                        value={values.text}
                        onChange={handleChange}
                        name="text"
                        placeholder={t("input")}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          {headerButtons}
        </div>
      </div>
    </form>
  ) : (
    <CustomSkeleton />
  );
}
