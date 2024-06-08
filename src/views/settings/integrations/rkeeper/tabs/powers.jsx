import React, { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import Button from "components/Button";
import {
  getRKeeperBranchCredentials,
  getRKeeperCredentials,
  postRKeeperCredentials,
  updateRKeeperCredentials,
} from "services/v2/rkeeper_credentials";
import AsyncSelect from "components/Select/Async";
import { customStyles } from "components/Select";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";

export default function Powers() {
  const { t } = useTranslation();
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const dispatch = useDispatch()

  const onSubmit = (values) => {
    const data = {
      branch_id: values.branch.value,
      ...values,
    };
    delete data.branch;

    setSaveLoading(true);
    errorStatus === 404
      ? postRKeeperCredentials(data).finally(() => {
          setSaveLoading(false);
        })
      : updateRKeeperCredentials(data)
          .finally(() => {
            setSaveLoading(false);
          })
          .then((res) => dispatch(showAlert("Успешно обновлено!", "success")));
  };

  const formik = useFormik({
    initialValues: {
      username: null,
      password: null,
      branch: null,
      cashier_code: null,
      delivery_code: null,
      // order_category_code: null,
      // order_type_code: null,
      self_pickup_code: null,
      table_code: null
    },
    validationSchema: yup.object().shape({
      username: yup.mixed().required(t("required.field.error")),
      password: yup.mixed().required(t("required.field.error")),
    }),
    onSubmit,
  });

  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  useEffect(() => {
    getRKeeperCredentials()
      .then(
        (res) => {
          // formik.setValues({
          //   username,
          //   password,
          //   branch: {
          //     label: branch_name,
          //     value: branch_id,
          //   },
          //   cashier_code,
          //   delivery_code,
          //   order_category_code,
          //   order_type_code,
          //   self_pickup_code,
          //   table_code
          // });
          setFieldValue("username", res?.username);
          setFieldValue("password", res?.password);
          setFieldValue("branch", {
            label: res?.branch_name,
            value: res?.branch_id,
          });
          setFieldValue("cashier_code", res?.cashier_code);
          setFieldValue("delivery_code", res?.delivery_code);
          // setFieldValue("order_category_code", res?.order_category_code);
          // setFieldValue("order_type_code", res?.order_type_code);
          setFieldValue("self_pickup_code", res?.self_pickup_code);
          setFieldValue("table_code", res?.table_code);
        },
      )
      .catch((err) => {
        setErrorStatus(err.status);
      });
  }, []);

  const loadBranches = useCallback((input, cb) => {
    getRKeeperBranchCredentials({ search: input })
      .then((response) => {
        let branchesRes = response?.branches?.map((res) => ({
          label: res?.branch_name,
          value: res?.branch_id,
        }));
        cb(branchesRes);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Card className="m-4 w-1/2">
        {/* API Login */}
        <div className="grid grid-cols-4 gap-4 mb-4 items-baseline">
          <div className="col-span-2">
            <div className="input-label">{t("name")}</div>
            <div className="col-span-1">
              <Form.Item formik={formik} name="username">
                <Input
                  size="large"
                  value={values.username}
                  onChange={handleChange}
                  name="username"
                  placeholder={t("username")}
                />
              </Form.Item>
            </div>
          </div>
          {/* Dispatcher ID */}
          <div className="col-span-2">
            <div className="input-label">{t("password")}</div>
            <div className="col-span-1">
              <Form.Item formik={formik} name="password">
                <Input
                  size="large"
                  value={values.password}
                  onChange={handleChange}
                  name="password"
                  placeholder={t("password")}
                />
              </Form.Item>
            </div>
          </div>
          <div className="col-span-2">
            <div className="input-label">{t("branches")}</div>
            <div className="col-span-1">
              <Form.Item formik={formik} name="branches">
                <AsyncSelect
                  defaultOptions
                  cacheOptions
                  isSearchable
                  isClearable
                  onChange={(val) => {
                    setFieldValue("branch", val);
                  }}
                  value={values.branch}
                  loadOptions={loadBranches}
                  placeholder={t("aggregator")}
                  styles={customStyles({
                    control: (base, state) => ({
                      ...base,
                      minHeight: "4rem",
                      height: "2rem",
                      border: "1px solid #E5E9EB",
                    }),
                    indicatorSeparator: (base, state) => ({
                      ...base,
                      height: "1rem",
                    }),
                  })}
                />
              </Form.Item>
            </div>
          </div>
          <div className="col-span-2">
            <div className="input-label">{t("Код кассира")}</div>
            <div className="col-span-1">
              <Form.Item formik={formik} name="cashier_code">
                <Input
                  size="large"
                  value={values.cashier_code}
                  onChange={handleChange}
                  name="cashier_code"
                  placeholder={t("Код кассира")}
                  // type='number'
                />
              </Form.Item>
            </div>
          </div>
          <div className="col-span-2">
            <div className="input-label">{t("Код доставки")}</div>
            <div className="col-span-1">
              <Form.Item formik={formik} name="delivery_code">
                <Input
                  size="large"
                  value={values.delivery_code}
                  onChange={handleChange}
                  name="delivery_code"
                  placeholder={t("Код доставки")}
                  // type='number'
                />
              </Form.Item>
            </div>
          </div>
          {/* <div className="col-span-2">
          <div className="input-label">{t("Код категории заказа")}</div>
          <div className="col-span-1">
            <Form.Item formik={formik} name="order_category_code">
              <Input
                size="large"
                value={values.order_category_code}
                onChange={handleChange}
                name="order_category_code"
                placeholder={t("Код категории заказа")}
                // type='number'
              />
            </Form.Item>
          </div>
          </div> */}

          {/* <div className="col-span-2">
          <div className="input-label">{t("Код типа заказа")}</div>
          <div className="col-span-1">
            <Form.Item formik={formik} name="order_type_code">
              <Input
                size="large"
                value={values.order_type_code}
                onChange={handleChange}
                name="order_type_code"
                placeholder={t("Код типа заказа")}
                // type='number'
              />
            </Form.Item>
          </div>
          </div> */}
          <div className="col-span-2">
            <div className="input-label">{t("Код самовывоза")}</div>
            <div className="col-span-1">
              <Form.Item formik={formik} name="self_pickup_code">
                <Input
                  size="large"
                  value={values.self_pickup_code}
                  onChange={handleChange}
                  name="self_pickup_code"
                  placeholder={t("Код самовывоза")}
                  // type='number'
                />
              </Form.Item>
            </div>
          </div>
          <div className="col-span-4">
            <div className="input-label">{t("Код таблицы")}</div>
            <div className="col-span-1">
              <Form.Item formik={formik} name="table_code">
                <Input
                  size="large"
                  value={values.table_code}
                  onChange={handleChange}
                  name="table_code"
                  placeholder={t("Код таблицы")}
                  // type='number'
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <Button type="submit" loading={saveLoading}>
          {t("save")}
        </Button>
      </Card>
    </form>
  );
}
