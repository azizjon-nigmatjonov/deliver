import Card from "components/Card";
import React from "react";
import Form from "components/Form/Index";
import { useTranslation } from "react-i18next";
import { Input } from "alisa-ui";
import Select from "components/Select";
import Switch from "components/Switch";

const GeneralInf = ({ formik }) => {
  const { values, handleChange, setFieldValue } = formik;

  const { t } = useTranslation();
  return (
    <Card
      title={t("general.information")}
      className="w-12/12 flex flex-col gap-4 mb-4"
    >
      <div className="w-12/12 flex gap-4 pb-2">
        <div className="w-4/12">
          <Form.Item
            formik={formik}
            name="name.en"
            label={`${t("name")} ${t("(en)")}`}
          >
            <Input
              size="large"
              id="name.en"
              value={values.name?.en}
              onChange={handleChange}
              required
            />
          </Form.Item>
        </div>
        <div className="w-4/12">
          <Form.Item
            formik={formik}
            name="name.ru"
            label={`${t("name")} ${t("(ru)")}`}
          >
            <Input
              size="large"
              id="name.ru"
              value={values.name?.ru}
              onChange={handleChange}
              required
            />
          </Form.Item>
        </div>
        <div className="w-4/12">
          <Form.Item
            formik={formik}
            name="name.uz"
            label={`${t("name")} ${t("(uz)")}`}
          >
            <Input
              size="large"
              id="name.uz"
              value={values.name?.uz}
              onChange={handleChange}
              required
            />
          </Form.Item>
        </div>
      </div>
      <div className="w-12/12 flex gap-4">
        <div className="w-4/12">
          <Form.Item formik={formik} name="type" label={t("type")}>
            <Select
              className="z-40"
              height={40}
              id="type"
              options={[
                { value: "bonus", label: t("bonus") },
                { value: "penalty", label: t("penalty") },
              ]}
              value={values.type}
              onChange={(val) => {
                setFieldValue("type", val);
              }}
            />
          </Form.Item>
        </div>
        <div className="w-4/12">
          <Form.Item
            formik={formik}
            name="bonus_penalty_for"
            label={t("courier.bp.type")}
          >
            <Select
              height={40}
              id="bonus_penalty_for"
              options={[
                {
                  value: "order_delivered_time",
                  label: t("order_delivered_time"),
                },
                {
                  value: "courier_attendance",
                  label: t("courier_attendance"),
                },
                {
                  value: "top_courier_orders_count",
                  label: t("top_courier_orders_count"),
                },
                {
                  value: "top_courier_delivered_time",
                  label: t("top_courier_delivered_time"),
                },
                {
                  value: "orders_count",
                  label: t("orders_count"),
                },
              ]}
              value={values.bonus_penalty_for}
              onChange={(val) => {
                setFieldValue("bonus_penalty_for", val);
              }}
            />
          </Form.Item>
        </div>
        <div className="w-4/12 pt-2">
          <Form.Item formik={formik} name="status" label={t("status")}>
            <Switch
              checked={values.status}
              onChange={(val) => setFieldValue("status", val)}
            />
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default GeneralInf;
