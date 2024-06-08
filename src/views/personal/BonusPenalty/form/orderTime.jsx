import React from "react";
import Card from "components/Card";
import Form from "components/Form/Index";
import { useTranslation } from "react-i18next";
import { Input } from "alisa-ui";

const OrderTime = ({ formik }) => {
  const { t } = useTranslation();
  const { values, handleChange, setFieldValue, handleSubmit } = formik;

  return (
    <Card
      title={t("order_delivered_time")}
      className="w-4/12 flex flex-col gap-4"
    >
      <div className="flex gap-4">
        <div className="w-3/6">
          <Form.Item
            formik={formik}
            name="bonus_penalty_datas.minute"
            label={t("time.order.delivery")}
          >
            <Input
              size="large"
              id="bonus_penalty_datas.minute"
              value={values?.bonus_penalty_datas?.minute}
              onChange={handleChange}
              placeholder={t("enter.time")}
              type="number"
            />
          </Form.Item>
        </div>
        <div className="w-3/6">
          <Form.Item
            formik={formik}
            name="bonus_penalty_datas.amount"
            label={t("courier.bp.price")}
          >
            <Input
              size="large"
              id="bonus_penalty_datas.amount"
              value={values?.bonus_penalty_datas?.amount}
              onChange={handleChange}
              placeholder={t("set_sum")}
              type="number"
            />
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default OrderTime;
