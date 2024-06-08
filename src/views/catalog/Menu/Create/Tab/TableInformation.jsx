import React, { useState } from "react";
import { Input } from "alisa-ui";
import Button from "components/Button";
import Card from "components/Card";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";
import { postMenu } from "services/v2";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { useMemo } from "react";
import * as yup from "yup";
import Form from "components/Form/Index";

const TableInformation = () => {
  const { shipper_id } = JSON.parse(localStorage.getItem("persist:auth"));
  const history = useHistory();
  const { t } = useTranslation();
  const [saveLoading, setSaveLoading] = useState(false);
  const onSubmit = (values) => {
    setSaveLoading(true);
    const data = { ...values };
    postMenu(data).finally(() => {
      history.goBack();
      setSaveLoading(false);
    });
  };
  const validationSchema = useMemo(
    () =>
      yup
        .object()
        .shape({ name: yup.mixed().required(t("required.field.error")) }),
    [],
  );
  const initialValues = useMemo(
    () => ({
      name: null,
      shipper_id: JSON.parse(shipper_id),
    }),
    [],
  );

  const formik = useFormik({ initialValues, onSubmit, validationSchema });
  const { handleChange, values, handleSubmit } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "88.5vh" }}
        className="flex flex-col justify-between"
      >
        <Card className="m-4 w-1/2" title={"Общие сведение"}>
          <div>
            <Form.Item name="name" formik={formik}>
              <div className="input-label">Названия меню</div>
              <Input value={values.name} id="name" onChange={handleChange} />
            </Form.Item>
          </div>
        </Card>

        <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-4 gap-5">
          <Button
            icon={CancelIcon}
            color="red"
            shape="outlined"
            onClick={() => history.goBack()}
            size="large"
            borderColor="bordercolor"
          >
            {t("cancel")}
          </Button>

          <Button
            size="large"
            icon={SaveIcon}
            type="submit"
            loading={saveLoading}
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TableInformation;
