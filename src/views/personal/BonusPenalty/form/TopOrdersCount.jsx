import React from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import DatePicker from "components/DatePicker";
import moment from "moment";
import Switch from "components/Switch";

const TopOrdersCount = ({ formik }) => {
  const { t } = useTranslation();
  const { values, handleChange, setFieldValue } = formik;

  return (
    <Card title={t("orders_count")} className="w-8/12 flex flex-col gap-4">
      <div className="flex gap-4 mb-4">
        <div className="w-3/6">
          <Form.Item
            formik={formik}
            name="bonus_penalty_datas.order_count"
            label={t("count.orders")}
          >
            <Input
              size="large"
              id="bonus_penalty_datas.order_count"
              value={values?.bonus_penalty_datas?.order_count}
              onChange={handleChange}
              placeholder={t("enter.count")}
              type="number"
            />
          </Form.Item>
        </div>
        <div className="w-3/6">
          <Form.Item
            formik={formik}
            name="bonus_penalty_datas.frequency_days"
            label={t("days_count")}
          >
            <Input
              size="large"
              id="bonus_penalty_datas.frequency_days"
              value={values?.bonus_penalty_datas?.frequency_days}
              onChange={handleChange}
              placeholder={t("Введите дней")}
              type="number"
              disabled={
                values.bonus_penalty_datas.every_month === true ? true : false
              }
            />
          </Form.Item>
        </div>
      </div>
      <div className="flex gap-4">
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
        <div className="w-3/6">
          <Form.Item
            formik={formik}
            name="bonus_penalty_datas.starting_date"
            label={t("date")}
          >
            <DatePicker
              className="w-full"
              hideTimePicker
              value={
                values?.bonus_penalty_datas?.starting_date
                  ? moment(values?.bonus_penalty_datas?.starting_date)
                  : ""
              }
              placeholder={t("enter.date")}
              hideTimeBlock
              onChange={(val) => {
                val !== null
                  ? setFieldValue(
                      "bonus_penalty_datas.starting_date",
                      moment(val).format("YYYY-MM-DD"),
                    )
                  : setFieldValue(
                      "bonus_penalty_datas.starting_date",
                      moment().format("YYYY-MM-DD"),
                    );
              }}
            />
          </Form.Item>
        </div>
      </div>
      <div className="w-3/6 mt-4">
        <Form.Item formik={formik} name="status" label={t("every_month")}>
          <Switch
            checked={values.bonus_penalty_datas.every_month}
            onChange={(val) =>
              setFieldValue("bonus_penalty_datas.every_month", val)
            }
          />
        </Form.Item>
      </div>
    </Card>
  );
};

export default TopOrdersCount;
