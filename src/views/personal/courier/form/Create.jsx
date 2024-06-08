import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import Select, { customStyles } from "components/Select";
import Switch from "components/Switch";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "components/PhoneInput";
import { useParams } from "react-router-dom";
import Async from "components/Select/Async";
import { getCourierFares } from "services/courierFare";

export default function CreateCourier({
  formik,
  fares,
  courierTypes,
  setCourierId,
}) {
  const { t } = useTranslation();
  const { values, handleChange, setFieldValue } = formik;
  const { id } = useParams();

  const loadFares = useCallback((input, callback) => {
    getCourierFares({ limit: 100, page: 1, search: input }).then((res) => {
      var fares = res?.courierFares?.map((fare) => ({
        value: fare?.id,
        label: fare?.name,
      }));
      callback(fares);
    });
  }, []);

  return (
    <div className="p-4 w-full">
      <Card title={t("general.information")} className="w-7/12">
        <div className="flex items-baseline mb-4">
          <span className="w-1/4 input-label">{t("first.name")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik} name="first_name">
              <Input
                size="large"
                id="first_name"
                value={values.first_name}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex items-baseline mb-4">
          <span className="w-1/4 input-label">{t("last.name")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik} name="last_name">
              <Input
                size="large"
                id="last_name"
                value={values.last_name}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex items-baseline mb-4">
          <span className="w-1/4 input-label">{t("login")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik} name="login">
              <Input
                size="large"
                id="login"
                value={values.login}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
        {!id && (
          <div className="flex items-baseline mb-4">
            <span className="w-1/4 input-label">{t("password")}</span>
            <div className="w-3/4">
              <Form.Item formik={formik} name="password">
                <Input
                  size="large"
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>
        )}
        <div className="flex items-baseline mb-4">
          <span className="w-1/4 input-label">{t("phone.number")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik} name="phone">
              <PhoneInput value={values.phone} onChange={handleChange} />
            </Form.Item>
          </div>
        </div>
        <div className="flex items-baseline mb-4">
          <span className="w-1/4 input-label">{t("Выберите тариф")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik} name="fare_id">
              <Async
                isSearchable
                isClearable
                cacheOptions
                name="fare_id"
                loadOptions={loadFares}
                defaultOptions={true}
                value={values.fare_id}
                onChange={(val) => {
                  formik.setFieldValue("fare_id", val);
                }}
                placeholder={""}
                styles={customStyles({
                  control: (base) => ({
                    ...base,
                    minHeight: "2rem",
                    height: "2rem",
                    border: "1px solid #E5E9EB",
                  }),
                  indicatorSeparator: (base) => ({
                    ...base,
                    height: "1rem",
                  }),
                })}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex items-baseline mb-4">
          <span className="w-1/4 input-label">{t("courier.type")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik} name="courier_type">
              <Select
                height={40}
                id="courier_type"
                options={courierTypes}
                value={values.courier_type}
                onChange={(val) => {
                  setCourierId((prev) => ({
                    ...prev,
                    id: val?.value,
                  }));
                  setFieldValue("courier_type", val);
                }}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex items-baseline mb-4">
          <span className="w-1/4 input-label">{t("max.orders.count")}</span>
          <div className="w-3/4">
            <Form.Item formik={formik} name="max_orders_count">
              <Input
                size="large"
                id="max_orders_count"
                type="number"
                value={values.max_orders_count}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex mb-4">
          <div className="flex item-baseline w-1/2">
            <div className="w-2/4 input-label">
              <span className="mr-4">{t("status")}</span>
            </div>
            <div className="w-3/4">
              <Form.Item formik={formik} name="is_active">
                <Switch
                  checked={values.is_active}
                  onChange={(val) => setFieldValue("is_active", val)}
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex item-baseline w-1/2">
            <div className="w-1/4 input-label mr-4">
              <span className="mr-4">{t("is.working")}</span>
            </div>
            <div className="w-3/4">
              <Form.Item formik={formik} name="is_working">
                <Switch
                  checked={values.is_working}
                  onChange={(val) => setFieldValue("is_working", val)}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
