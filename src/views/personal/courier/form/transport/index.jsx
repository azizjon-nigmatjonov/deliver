import Card from "../../../../../components/Card";
import Form from "../../../../../components/Form/Index";
import { Input } from "alisa-ui";
import React from "react";
import { useTranslation } from "react-i18next";

export default function CreateTransport({ formik }) {
  const { t } = useTranslation();

  const { handleChange, values } = formik;

  return (
    <div className="p-4 w-full">
      <Card title={t("transport")} className="w-7/12">
        <div className="flex items-baseline mb-4">
          <span className="w-1/4 input-label">{t("brand.cars")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik} name="brand">
              <Input
                size="large"
                id="brand"
                value={values.brand}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex items-baseline mb-4">
          <span className="w-1/4 input-label">{t("model")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik} name="model">
              <Input
                size="large"
                id="model"
                value={values.model}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex items-baseline mb-4">
          <span className="w-1/4 input-label">{t("car.color")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik} name="color">
              <Input
                size="large"
                id="color"
                value={values.color}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex items-baseline mb-4">
          <span className="w-1/4 input-label">{t("car.number")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik} name="vehicle_number">
              <Input
                size="large"
                id="vehicle_number"
                value={values.vehicle_number}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
      </Card>
    </div>
  );
}
