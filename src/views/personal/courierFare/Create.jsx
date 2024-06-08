import Card from "components/Card";
import Form from "components/Form/Index";
import Select from "components/Select";
import { Input } from "alisa-ui";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import {
  getCourierFare,
  postCourierFare,
  updateCourierFare,
} from "services/courierFare";
import { useFormik, FormikProvider, FieldArray } from "formik";
import CustomSkeleton from "components/Skeleton";
import * as yup from "yup";
import Header from "components/Header";
import Breadcrumb from "components/Breadcrumb";
import { isNumber } from "helpers/inputHelpers";
import Tag from "components/Tag";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import Button from "components/Button";
import { useBPs } from "services/v2/courier-bonus-penalty";
import { useSelector } from "react-redux";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& > *": {
//       width: "100%",
//       fontSize: "1.5rem",
//       padding: "0",
//       borderColor: "#ecf4fe",
//       backgroundColor: "#ecf4fe",
//       color: "#4094f7",
//     },
//     "& > *:hover": {
//       borderColor: "#ecf4fe",
//       backgroundColor: "#ecf4fe",
//     },
//   },
// }));

export default function CreateFare() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [loader, setLoader] = useState(true);
  const history = useHistory();
  const lang = useSelector((state) => state.lang.current);
  const [saveLoading, setSaveLoading] = useState(false);

  const intervals = [
    { value: "hour", label: "Час" },
    { value: "day", label: "День" },
    { value: "month", label: "Месяц" },
  ];
  const types = [
    { value: "standard", label: t("standard") },
    { value: "alternative", label: t("alternative") },
  ];

  useEffect(() => {
    getItem();
  }, []);

  const getItem = () => {
    if (!id) return setLoader(false);
    setLoader(true);
    getCourierFare(id)
      .then((res) => {
        formik.setValues({
          fix_price: res?.fix_price,
          included_distance: res?.included_distance,
          name: res?.name,
          payment_interval: {
            value: res?.payment_interval,
            label: t(res?.payment_interval),
          },
          price_per_km: res?.price_per_km,
          price_per_order: res?.price_per_order,
          type: {
            value: res?.type,
            label: t(res?.type),
          },
          fare_values: res?.fare_values,
          bonus_penalty: res?.bonus_penalty.map((data) => ({
            value: data?.id,
            label: data?.name?.[lang],
          })),
        });
      })
      .finally(() => setLoader(false));
  };

  const initialValues = useMemo(
    () => ({
      fix_price: "",
      included_distance: "",
      name: "",
      payment_interval: "",
      price_per_km: "",
      price_per_order: "",
      type: "",
      fare_values: [
        {
          from_distance: "",
          price: "",
          to_distance: "",
        },
      ],
      bonus_penalty: [],
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    const defaultNumberSchema = yup
      .number()
      .required(t("required.field.error"));
    return yup.object().shape({
      fix_price: defaultNumberSchema,
      included_distance: defaultNumberSchema,
      price_per_km: defaultNumberSchema,
      price_per_order: defaultNumberSchema,
      type: defaultSchema,
      name: defaultSchema,
      payment_interval: defaultSchema,
      bonus_penalty: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const data = {
      fix_price: values?.fix_price,
      included_distance: values?.included_distance,
      name: values?.name,
      price_per_km: values?.price_per_km,
      price_per_order: values?.price_per_order,
      type: values?.type?.value,
      payment_interval: values?.payment_interval?.value,
      fare_values:
        values?.type?.value === "alternative" ? values.fare_values : [],
      bonus_penalty: values?.bonus_penalty.map((bp) => ({ id: bp.value })),
    };

    id
      ? updateCourierFare(id, data).then((res) => history.goBack())
      : postCourierFare(data)
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

  const { values, handleChange, setFieldValue, handleSubmit } = formik;

  const { data: bps } = useBPs({
    params: {
      page: 1,
      limit: 100,
    },
    props: {
      enabled: true,
      select: (res) => {
        return res?.bonuses_penalties.map((bp) => ({
          value: bp?.id,
          label: bp?.name[lang],
        }));
      },
    },
  });
  if (loader) return <CustomSkeleton />;

  const routes = [
    {
      title: t("personal"),
      link: true,
      route: `/home/personal/couriers/list`,
    },
    {
      title: t("courier.fare"),
      link: true,
      route: `/home/personal/couriers/courier-fare`,
    },
    {
      title: id ? t("edit") : t("create"),
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      style={{ minHeight: "100vh" }}
      className="flex flex-col"
    >
      <Header startAdornment={[<Breadcrumb routes={routes} />]} />
      <div className="p-4 w-full flex-1">
        <Card title={t("general.information")} className="w-8/12">
          <div className="flex-col items-baseline mb-2">
            <span className="w-4/4 input-label">{t("name")}</span>
            <div className="w-4/4">
              <Form.Item formik={formik} name="name">
                <Input
                  size="large"
                  id="name"
                  value={values.name}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex-col items-baseline mb-2">
            <span className="w-4/4 input-label">{t("payment.interval")}</span>
            <div className="w-4/4">
              <div>
                <Form.Item formik={formik} name="payment_interval">
                  <Select
                    height={40}
                    id="payment_interval"
                    options={intervals}
                    value={values.payment_interval}
                    onChange={(val) => {
                      setFieldValue("payment_interval", val);
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mb-2">
            <div className="w-6/12">
              <span className="input-label">{t("fare.type")}</span>
              <div>
                <div>
                  <Form.Item formik={formik} name="type">
                    <Select
                      height={40}
                      id="type"
                      options={types}
                      value={values.type}
                      onChange={(val) => {
                        setFieldValue("type", val);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="w-6/12">
              <span className="input-label">{t("courier.bp")}</span>
              <div>
                <div>
                  <Form.Item formik={formik} name=" ">
                    <Select
                      isMulti
                      isSearchable
                      height={40}
                      id="type"
                      options={bps}
                      value={values.bonus_penalty}
                      onChange={(val) => {
                        setFieldValue("bonus_penalty", val);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mb-2">
            <Form.Item
              formik={formik}
              name="fix_price"
              label={t("fixed_price")}
              className="flex-1"
            >
              <Input
                size="large"
                id="fix_price"
                value={values.fix_price}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              formik={formik}
              name="price_per_order"
              label={t("price_per_order")}
              className="flex-1"
            >
              <Input
                size="large"
                id="price_per_order"
                value={values.price_per_order}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
          <div className="flex gap-4 mb-2">
            <Form.Item
              formik={formik}
              name="included_distance"
              label={t("included_distance")}
              className="flex-1"
            >
              <Input
                size="large"
                id="included_distance"
                value={values.included_distance}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              formik={formik}
              name="price_per_km"
              label={t("price_per_km")}
              className="flex-1"
            >
              <Input
                size="large"
                id="price_per_km"
                value={values.price_per_km}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
          {values?.type?.value === "alternative" && (
            <FormikProvider value={formik}>
              <FieldArray name="fare_values">
                {({ push, remove }) => (
                  <>
                    {values?.fare_values?.map((fare_value, index) => (
                      <div
                        className="flex items-center justify-between gap-2"
                        key={index}
                      >
                        <div className="w-2/8">
                          <div className="input-label">
                            {t("from_distance")}
                          </div>
                          <div className="">
                            <Form.FieldArrayItem
                              formik={formik}
                              name="from_distance"
                              index={index}
                            >
                              <Input
                                type="number"
                                id="from_distance"
                                size="large"
                                name="from_distance"
                                min="1"
                                placeholder="0"
                                onKeyPress={isNumber}
                                value={fare_value?.from_distance}
                                onChange={(val) => {
                                  setFieldValue(
                                    `fare_values[${index}].from_distance`,
                                    val.target.value,
                                  );
                                }}
                              />
                            </Form.FieldArrayItem>
                          </div>
                        </div>
                        <div className="w-2/8">
                          <div className="input-label">{t("price")}</div>
                          <div className="">
                            <Form.FieldArrayItem formik={formik} name="price">
                              <Input
                                type="number"
                                id="price"
                                size="large"
                                name="price"
                                min="1"
                                placeholder="0"
                                onKeyPress={isNumber}
                                value={fare_value?.price}
                                onChange={(val) => {
                                  setFieldValue(
                                    `fare_values[${index}].price`,
                                    val.target.value,
                                  );
                                }}
                              />
                            </Form.FieldArrayItem>
                          </div>
                        </div>
                        <div className="w-2/8">
                          <div className="input-label">{t("to_distance")}</div>
                          <div className="">
                            <Form.FieldArrayItem
                              formik={formik}
                              name="to_distance"
                            >
                              <Input
                                type="number"
                                id="to_distance"
                                size="large"
                                name="to_distance"
                                min="0"
                                placeholder="0"
                                onKeyPress={isNumber}
                                value={fare_value?.to_distance}
                                onChange={(val) => {
                                  setFieldValue(
                                    `fare_values[${index}].to_distance`,
                                    val.target.value,
                                  );
                                }}
                              />
                            </Form.FieldArrayItem>
                          </div>
                        </div>
                        <Tag
                          color="error"
                          lightMode={true}
                          size="large"
                          shape="subtle"
                          className="cursor-pointer"
                        >
                          <DeleteIcon
                            onClick={() => remove(index)}
                            style={{ color: "red" }}
                          />
                        </Tag>
                      </div>
                    ))}
                    {/* <div className={styles.root}> */}
                    <Button
                      variant="outlined"
                      onClick={() =>
                        push({
                          from_distance: "",
                          price: "",
                          to_distance: "",
                        })
                      }
                    >
                      +
                    </Button>
                    {/* </div> */}
                  </>
                )}
              </FieldArray>
            </FormikProvider>
          )}
        </Card>
      </div>
      <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-4 gap-5">
        <Button
          icon={CancelIcon}
          size="large"
          shape="outlined"
          color="red"
          borderColor="bordercolor"
          onClick={(e) => history.go(-1)}
        >
          {t("cancel")}
        </Button>
        <Button
          icon={SaveIcon}
          size="large"
          loading={saveLoading}
          onClick={() => onSubmit(values)}
        >
          {t(id ? "edit" : "create")}
        </Button>
      </div>
    </form>
  );
}
