import { useMemo, useState, useEffect, useRef } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik, FieldArray, FormikProvider } from "formik";
import Header from "components/Header";
import Select from "components/Select";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import SaveIcon from "@mui/icons-material/Save";
import { getFare, postFare, updateFare } from "services";
import DeleteIcon from "@mui/icons-material/Delete";
import { isNumber } from "helpers/inputHelpers";
// import Rainbow from "rainbowvis.js";
import Tag from "components/Tag";
import { getRegions } from "services/region";
import { tariffTimers } from "helpers/tariffHelpers";

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

export default function TariffCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const typeSelectRef = useRef();
  const [saveLoading, setSaveLoading] = useState(false);
  const [timer, setTimer] = useState([]);
  const [isSchedule, setIsSchedule] = useState(false);
  const [max, setMax] = useState(100);
  const [min, setMin] = useState(1);
  // var rainbow = new Rainbow();
  // rainbow.setSpectrum("#EBFFF1", "#E4FCFC", "#FFFCC2", "#FED6CD");
  // rainbow.setNumberRange(min, max);

  useEffect(() => {
    if (params.id) {
      let regions = [];
      getRegions({ limit: 200 }).then((res) => {
        regions = res?.regions?.map((elm) => ({
          label: elm.name,
          value: elm.id,
        }));
      });
      getFare(params.id).then((res) => {
        setValues({
          base_price: res?.base_price,
          type: findType.find((elm) => elm.value === res?.type),
          base_distance: res?.base_distance ?? null,
          price_per_km: res?.price_per_km ?? null,
          name: res?.name,
          fare_values: res?.fare_values,
        });
        setFieldValue(
          "region_ids",
          res?.region_ids?.map((item) =>
            regions.find((val) => val.value === item),
          ),
        );
        let maximum = Math.max(...res?.dynamic_price_per_km);
        let minimum = Math.min(...res?.dynamic_price_per_km);
        if (maximum !== minimum) {
          setMax(maximum);
          setMin(minimum);
        }
        setIsSchedule(res?.is_price_dynamic);
        setTimer(tariffTimers(res?.dynamic_price_per_km));
      });
    }
  }, []);

  const initialValues = {
    name: "",
    base_price: null,
    type: "",
    base_distance: null,
    price_per_km: null,
    fare_values: [
      {
        from_price: null,
        to_price: null,
        from_distance: null,
        to_distance: null,
        delivery_price: null,
        id: "",
      },
    ],
  };

  // const initialValues = useMemo(
  //   () => (
  //     {
  //       name: "",
  //       base_price: null,
  //       type: "",
  //       base_distance: null,
  //       price_per_km: null,
  //       fare_values: [
  //         {
  //           from_price: null,
  //           to_price: null,
  //           from_distance: null,
  //           to_distance: null,
  //           delivery_price: null,
  //           id: "",
  //         },
  //         //
  //       ],
  //     },
  //     []
  //   ),
  // );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      base_price: defaultSchema,
      type: defaultSchema,
    });
  }, [t]);

  const handlefareValues = (values) => {
    if (
      values?.type?.value === "alternative" ||
      values?.type?.value === "alternative_by_km"
    ) {
      return values?.type?.value === "alternative"
        ? values.fare_values.map((el) => ({
            delivery_price: el.delivery_price,
            from_price: el.from_price,
            id: el.id,
            to_price: el.to_price,
          }))
        : values.fare_values.map((el) => ({
            from_distance: el.from_distance,
            to_distance: el.to_distance,
            id: el.id,
            delivery_price: el.delivery_price,
          }));
    }
    return null;
  };

  const onSubmit = (values) => {
    const data = {
      fare_values: handlefareValues(values),
      type: values?.type?.value,
      name: values.name,
      base_price: values.base_price,
      base_distance:
        values?.type?.value === "not-fixed" ? values.base_distance : null,
      price_per_km:
        values?.type?.value === "not-fixed" ? values.price_per_km : null,
    };

    params.id
      ? updateFare(params.id, data).then((res) => history.goBack())
      : postFare(data)
          .then((res) => {
            history.goBack();
          })
          .finally(() => {
            setSaveLoading(false);
          });

    const dynamic_price_per_km = timer.flatMap((row) => row.slice(1));

    data?.type === "fixed" && delete data.base_distance;
    data?.type === "fixed" && delete data.price_per_km;
    data?.type === "fixed" && delete data.fare_value;
    data.is_price_dynamic = isSchedule;
    data.dynamic_price_per_km = dynamic_price_per_km;
    data.region_ids = values.region_ids.map((item) => item.value);

    setSaveLoading(true);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik;

  useEffect(() => {
    if (isSchedule && !params.id) {
      setTimer(tariffTimers(values.price_per_km));
    }
  }, [isSchedule, params.id, values.price_per_km]);

  useEffect(() => {
    const newTimers = [];
    if (timer.length > 0) {
      timer.forEach((item) => {
        item.forEach((el) => {
          if (el && typeof el !== "string" && !isNaN(el)) newTimers.push(el);
        });
      });
      let maximum = Math.max(...newTimers);
      let minimum = Math.min(...newTimers);
      if (maximum !== minimum) {
        setMax(maximum);
        setMin(minimum);
      }
    }
  }, [timer]);

  // ****** CONSTANTS ******
  const findType = [
    {
      label: `${t("fixed")}`,
      value: "fixed",
    },
    {
      label: `${t("not-fixed")}`,
      value: "not-fixed",
    },
    {
      label: `${t("alternative")}`,
      value: "alternative",
    },
    {
      label: `${t("alternative_by_km")}`,
      value: "alternative_by_km",
    },
  ];

  const routes = [
    {
      title: t(`fares`),
      link: true,
      route: `/home/settings/fares`,
    },
    {
      title: t("create"),
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <div>
          <Header startAdornment={<Breadcrumb routes={routes} />} />
          <div className="m-4 flex flex-col w-4/5">
            <Card
              title={t("general.information")}
              bodyClass="flex flex-col gap-2"
            >
              <Form.Item formik={formik} name="name" label={t("name")}>
                <Input
                  size="large"
                  value={values.name}
                  onChange={handleChange}
                  name="name"
                />
              </Form.Item>
              <Form.Item formik={formik} name="type" label={t("type")}>
                <Select
                  id="type"
                  height={40}
                  options={findType}
                  value={values.type}
                  openMenuOnFocus={true}
                  ref={typeSelectRef}
                  defaultValue={findType[0]}
                  onChange={(val) => {
                    setFieldValue("type", val);
                  }}
                />
              </Form.Item>
              <Form.Item
                formik={formik}
                name="base_price"
                label={t("base.price")}
              >
                <Input
                  type="number"
                  id="base_price"
                  onKeyPress={isNumber}
                  size="large"
                  defaultValue={0}
                  value={values.base_price}
                  onChange={handleChange}
                />
              </Form.Item>
              {values?.type?.value === "not-fixed" && (
                <>
                  <Form.Item
                    formik={formik}
                    name="base_distance"
                    label={t("included.kilometers")}
                  >
                    <Input
                      type="number"
                      id="base_distance"
                      size="large"
                      onKeyPress={isNumber}
                      value={values.base_distance}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item
                    formik={formik}
                    name="price_per_km"
                    label={t("further.amount.per.km")}
                  >
                    <Input
                      type="number"
                      id="price_per_km"
                      size="large"
                      name="price_per_km"
                      min="1"
                      onKeyPress={isNumber}
                      value={values.price_per_km}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </>
              )}
              {values?.type?.value === "alternative" && (
                <FormikProvider value={formik}>
                  <FieldArray name="fare_values">
                    {({ push, remove }) => (
                      <>
                        {values?.fare_values?.map((fare_value, index) => (
                          <div
                            className="flex items-center justify-between"
                            key={index}
                          >
                            <div className="w-2/8">
                              <div className="input-label">
                                {t("from_price")}
                              </div>
                              <div className="">
                                <Form.FieldArrayItem
                                  formik={formik}
                                  name="from_price"
                                  index={index}
                                >
                                  <Input
                                    type="number"
                                    id="from_price"
                                    size="large"
                                    name="from_price"
                                    min="1"
                                    placeholder="0"
                                    onKeyPress={isNumber}
                                    value={values.fare_values[index].from_price}
                                    onChange={(val) => {
                                      setFieldValue(
                                        `fare_values[${index}].from_price`,
                                        val.target.value,
                                      );
                                    }}
                                  />
                                </Form.FieldArrayItem>
                              </div>
                            </div>
                            <div className="w-2/8">
                              <div className="input-label">{t("to_price")}</div>
                              <div className="">
                                <Form.FieldArrayItem
                                  formik={formik}
                                  name="to_price"
                                >
                                  <Input
                                    type="number"
                                    id="to_price"
                                    size="large"
                                    name="to_price"
                                    min="1"
                                    placeholder="0"
                                    onKeyPress={isNumber}
                                    value={values.fare_values[index].to_price}
                                    onChange={(val) => {
                                      setFieldValue(
                                        `fare_values[${index}].to_price`,
                                        val.target.value,
                                      );
                                    }}
                                  />
                                </Form.FieldArrayItem>
                              </div>
                            </div>
                            <div className="w-2/8">
                              <div className="input-label">
                                {t("delivery_price")}
                              </div>
                              <div className="">
                                <Form.FieldArrayItem
                                  formik={formik}
                                  name="delivery_price"
                                >
                                  <Input
                                    type="number"
                                    id="delivery_price"
                                    size="large"
                                    name="delivery_price"
                                    min="0"
                                    placeholder="0"
                                    onKeyPress={isNumber}
                                    value={
                                      values.fare_values[index].delivery_price
                                    }
                                    onChange={(val) => {
                                      setFieldValue(
                                        `fare_values[${index}].delivery_price`,
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
                        <Button
                          variant="outlined"
                          onClick={() =>
                            push({
                              from_price: "",
                              to_price: "",
                              delivery_price: "",
                            })
                          }
                        >
                          +
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </FormikProvider>
              )}
              {values?.type?.value === "alternative_by_km" && (
                <FormikProvider value={formik}>
                  <FieldArray name="fare_values">
                    {({ push, remove }) => (
                      <>
                        {values?.fare_values?.map((fare_value, index) => (
                          <div
                            className="flex items-center justify-between"
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
                                    suffix={t("km")}
                                    value={
                                      values.fare_values[index].from_distance
                                    }
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
                              <div className="input-label">
                                {t("to_distance")}
                              </div>
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
                                    min="1"
                                    placeholder="0"
                                    suffix={t("km")}
                                    onKeyPress={isNumber}
                                    value={
                                      values.fare_values[index].to_distance
                                    }
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
                            <div className="w-2/8">
                              <div className="input-label">
                                {t("delivery_price")}
                              </div>
                              <div className="">
                                <Form.FieldArrayItem
                                  formik={formik}
                                  name="delivery_price"
                                >
                                  <Input
                                    type="number"
                                    id="delivery_price"
                                    size="large"
                                    name="delivery_price"
                                    min="0"
                                    placeholder="0"
                                    onKeyPress={isNumber}
                                    value={
                                      values.fare_values[index].delivery_price
                                    }
                                    onChange={(val) => {
                                      setFieldValue(
                                        `fare_values[${index}].delivery_price`,
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
                        <Button
                          variant="outlined"
                          onClick={() =>
                            push({
                              from_distance: "",
                              to_distance: "",
                              delivery_price: "",
                              id: "",
                            })
                          }
                        >
                          +
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </FormikProvider>
              )}
            </Card>
          </div>
        </div>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          <Button
            icon={SaveIcon}
            size="large"
            type="submit"
            loading={saveLoading}
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </form>
  );
}
