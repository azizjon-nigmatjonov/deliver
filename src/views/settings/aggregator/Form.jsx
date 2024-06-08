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
import { getAggregator, postAggregator, updateAggregator } from "services";
import replace from "lodash/replace";
import PhoneInput from "components/PhoneInput";
import { phoneValidation } from "utils/phoneValidator";

export default function AggregateCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);

  const initialValues = useMemo(
    () => ({
      name: null,
      phone_number: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      name: defaultSchema,
      phone_number: phoneValidation(),
      // yup
      //   .string()
      //   .min(13, t("required.field.error"))
      //   .required(t("required.field.error"))
      //   .nullable(),
    });
  }, [t]);

  const onSubmit = (values) => {
    const data = {
      ...values,
      phone_number: replace(
        values.phone_number,
        /\(\d*?\)/g,
        (match, index, string) => {
          return match.slice(1, 4);
        },
      ),
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateAggregator(params.id, data)
      : postAggregator(data);
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
      title: t(`aggregator`),
      link: true,
      route: `/home/settings/aggregator`,
    },
    {
      title: t("create"),
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
      getAggregator(params.id).then((res) => {
        setValues({
          name: res?.name,
          phone_number: res?.phone_number,
        });
      });
    }
  }, [params.id, setValues]);

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <div>
          <Header startAdornment={[<Breadcrumb routes={routes} />]} />
          <div className="m-4">
            <div className="grid grid-cols-2 gap-5">
              <Card title={t("general.information")}>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="input-label">{t("name")}</div>
                    <div className="col-span-2">
                      <Form.Item formik={formik} name="name">
                        <Input
                          size="large"
                          value={values.name}
                          onChange={handleChange}
                          name="name"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div>
                    <div className="input-label">{t("phone.number")}</div>
                    <div className="col-span-2">
                      <Form.Item formik={formik} name="phone_number">
                        <PhoneInput
                          value={values.phone_number}
                          onChange={(e) =>
                            formik.setFieldValue("phone_number", e.target.value)
                          }
                        />
                      </Form.Item>
                    </div>
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
  );
}
