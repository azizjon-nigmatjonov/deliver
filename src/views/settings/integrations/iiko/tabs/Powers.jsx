import React, { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { updateIikoId, getIikoId, postIikoId, getIikoBranches } from "services";
import {
  getCRMDiscounts,
  getDiscounts,
  updateCrmDiscount,
} from "services/v2/crm";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import AsyncSelect from "components/Select/Async";
import Button from "components/Button";
import { getIikoCities, getIikoStreets } from "services/v2/Iiko";
import { Update } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";

export default function Powers() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let debounce = setTimeout(() => {}, 0);

  const [btnLoading, setBtnLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [streetsOfCity, setStreetsOfCity] = useState(null);

  const onSubmit = (values) => {
    const data = {
      ...values,
      dispatcher_id: values?.dispatcher_id?.value,
      discount_id: values?.discount_id?.value,
      discount_id_for_product: values?.discount_id_for_product?.value,
      surcharge_id_for_product: values?.surcharge_id_for_product?.value,
    };

    setBtnLoading(true);
    errorStatus === 404
      ? postIikoId(data)
          .then(() => dispatch(showAlert("successfully.saved", "success")))
          .finally(() => {
            setBtnLoading(false);
          })
      : updateIikoId(data)
          .then(() => dispatch(showAlert("successfully_updated", "success")))
          .finally(() => {
            setBtnLoading(false);
          });
  };

  const formik = useFormik({
    initialValues: {
      api_login: "",
      dispatcher_id: "",
      discount_id: "",
      discount_id_for_product: "",
      surcharge_id_for_product: "",
      address: {
        city_name: "",
        street_name: "",
        city_id: "",
        street_id: "",
      },
    },
    validationSchema: yup.object().shape({
      api_login: yup.mixed().required(t("required.field.error")),
    }),
    onSubmit,
  });

  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  useEffect(() => {
    getIikoId()
      .then(
        ({
          dispatcher_id,
          discount_id,
          discount_id_for_product,
          surcharge_id_for_product,
          ...res
        }) => {
          formik.setValues({
            ...res,
            dispatcher_id: { value: dispatcher_id, label: dispatcher_id },
            discount_id: { value: discount_id, label: discount_id },
            discount_id_for_product: {
              value: discount_id_for_product,
              label: discount_id_for_product,
            },
            surcharge_id_for_product: {
              value: surcharge_id_for_product,
              label: surcharge_id_for_product,
            },
          });
        },
      )
      .catch((err) => {
        setErrorStatus(err.status);
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // if u put formik here, it will be infinite loop

  const loadDispatchers = useCallback((inputValue, callback) => {
    getIikoBranches({ search: inputValue })
      .then((res) => {
        let branches = res?.branches?.map((elm) => ({
          label: elm.name,
          value: elm.id,
        }));
        callback(branches);
      })
      .catch((error) => console.log(error));
  }, []);

  // const loadDiscounts = useCallback((inputValue, callback) => {
  //   getDiscounts({ crm_type: "iiko", search: inputValue })
  //     .then((res) => {
  //       let discounts = res?.discounts?.map((elm) => ({
  //         label: elm.name,
  //         value: elm.code,
  //       }));
  //       callback(discounts);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  const loadCRMDiscounts = useCallback((inputValue, callback) => {
    getCRMDiscounts("iiko", { page: 1, limit: 20, search: inputValue })
      .then((res) => {
        let discounts = res?.discounts?.map((elm) => ({
          label: elm?.discount_data?.name,
          value: elm?.discount_data?.id,
        }));
        callback(discounts);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadCities = (inputValue, callback) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      getIikoCities({ search: inputValue })
        .then((res) => {
          let cities = res?.cities?.map((elm) => ({
            label: elm.name,
            value: elm.id,
          }));
          callback(cities);
        })
        .catch((error) => console.log(error));
    }, 300);
  };

  const loadStreets = (inputValue, callback) => {
    if (values?.address?.city_id) {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        getIikoStreets({
          city_id: values?.address?.city_id,
          search: inputValue,
        })
          .then((res) => {
            let streets = res?.streets?.map((elm) => ({
              label: elm.name,
              value: elm.id,
            }));
            callback(streets);
          })
          .catch((error) => console.log(error));
      }, 300);
    }
  };

  const updateHandler = () => {
    updateCrmDiscount({ crm_type: "iiko" }).then(() => {
      dispatch(showAlert(t("successfully_updated"), "success"));
      window.location.reload();
    });
  };

  useEffect(() => {
    if (values?.address?.city_id) {
      getIikoStreets({
        city_id: values?.address?.city_id,
      })
        .then((res) => {
          let streets = res?.streets?.map((elm) => ({
            label: elm.name,
            value: elm.id,
          }));
          setStreetsOfCity(streets);
        })
        .catch((error) => console.log(error));
    }
  }, [values?.address?.city_id]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-between"
      style={{ minHeight: "calc(100vh - 112px)" }}
    >
      <div className="flex-1">
        <Card
          className="m-4"
          extra={
            <Button
              shape="outlined"
              icon={Update}
              size="medium"
              onClick={updateHandler}
            >
              {t("update_discounts")}
            </Button>
          }
        >
          <div className="input-label">{t("api_login")}</div>
          <div className="col-span-1">
            <Form.Item formik={formik} name="api_login">
              <Input
                size="large"
                value={values.api_login}
                onChange={handleChange}
                name="api_login"
                placeholder={t("api_login")}
              />
            </Form.Item>
          </div>
          <div className="flex justify-between gap-4 flex-wrap mt-4">
            <div className="flex-1">
              <div className="input-label">{t("dispatcher")}</div>
              <Form.Item formik={formik} name="dispatcher_id">
                <AsyncSelect
                  id="dispatcher_id"
                  defaultOptions
                  cacheOptions
                  isSearchable
                  isClearable
                  value={values.dispatcher_id}
                  loadOptions={loadDispatchers}
                  placeholder={t("choose.dispatcher")}
                  onChange={(val) => setFieldValue("dispatcher_id", val)}
                />
              </Form.Item>
            </div>
            <div className="flex-1">
              <div className="input-label">{t("surcharge_id_for_product")}</div>
              <Form.Item formik={formik} name="surcharge_id_for_product">
                <AsyncSelect
                  id="surcharge_id_for_product"
                  defaultOptions
                  cacheOptions
                  isSearchable
                  isClearable
                  value={values.surcharge_id_for_product}
                  loadOptions={loadCRMDiscounts}
                  placeholder={t("choose.discount")}
                  onChange={(val) =>
                    setFieldValue("surcharge_id_for_product", val)
                  }
                />
              </Form.Item>
            </div>
            <div className="flex-1">
              <div className="input-label">{t("discount_id_for_product")}</div>
              <Form.Item formik={formik} name="discount_id_for_product">
                <AsyncSelect
                  id="discount_id_for_product"
                  defaultOptions
                  cacheOptions
                  isSearchable
                  isClearable
                  value={values.discount_id_for_product}
                  loadOptions={loadCRMDiscounts}
                  placeholder={t("choose.discount")}
                  onChange={(val) =>
                    setFieldValue("discount_id_for_product", val)
                  }
                />
              </Form.Item>
            </div>
            <div className="flex-1">
              <div className="input-label">{t("city")}</div>
              <Form.Item formik={formik} name="city">
                <AsyncSelect
                  id="city"
                  defaultOptions
                  cacheOptions
                  isSearchable
                  isClearable
                  value={{
                    label: values.address?.city_name,
                    value: values.address?.city_id,
                  }}
                  loadOptions={loadCities}
                  placeholder={t("choose.city")}
                  onChange={(val) =>
                    setFieldValue("address", {
                      ...values.address,
                      city_name: val.label,
                      city_id: val.value,
                    })
                  }
                />
              </Form.Item>
            </div>
            <div className="flex-1">
              <div className="input-label">{t("discount")}</div>
              <Form.Item formik={formik} name="discount_id">
                <AsyncSelect
                  id="discount_id"
                  defaultOptions
                  cacheOptions
                  isSearchable
                  isClearable
                  value={values.discount_id}
                  loadOptions={loadCRMDiscounts}
                  placeholder={t("choose.discount")}
                  onChange={(val) => setFieldValue("discount_id", val)}
                />
              </Form.Item>
            </div>
            <div className="flex-1">
              <div className="input-label">{t("street")}</div>
              <Form.Item formik={formik} name="street">
                <AsyncSelect
                  id="street"
                  defaultOptions={streetsOfCity}
                  cacheOptions
                  isSearchable
                  isClearable
                  value={{
                    label: values.address?.street_name,
                    value: values.address?.street_id,
                  }}
                  loadOptions={loadStreets}
                  placeholder={t("choose.street")}
                  onChange={(val) =>
                    setFieldValue("address", {
                      ...values.address,
                      street_name: val.label,
                      street_id: val.value,
                    })
                  }
                />
              </Form.Item>
            </div>
          </div>
        </Card>
      </div>
      <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-4">
        <Button size="large" loading={btnLoading} type="submit">
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
