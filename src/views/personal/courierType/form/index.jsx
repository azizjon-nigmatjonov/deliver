import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input } from "alisa-ui";

//components and functions
import Form from "../../../../components/Form/Index";
import Breadcrumb from "../../../../components/Breadcrumb";
import Header from "../../../../components/Header";
import Card from "../../../../components/Card";
import Button from "../../../../components/Button";
import {
  getCourierType,
  postCourierType,
  updateCourierType,
} from "../../../../services/courierType";
import LoaderComponent from "../../../../components/Loader";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Switch from "components/Switch";
import TimePicker from "components/TimePicker";
import moment from "moment";
import Select from "components/Select";

export default function CreateCourierType() {
  const history = useHistory();
  const { id } = useParams();
  const { t } = useTranslation();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const types = [
    { value: "auto", label: "Автокурьер" },
    { value: "moto", label: "Мотокурьер" },
    { value: "velo", label: "Велокурьер" },
    { value: "cargo", label: "Грузовой курьер" },
    { value: "unmounted", label: "Пеший курьер" },
  ];

  const initialValues = useMemo(
    () => ({
      name: "",
      distance_from: "",
      distance_to: "",
      starting_minute: "",
      working_hours: [
        {
          day_number: "",
          end_time: "",
          is_active: "",
          start_time: "",
        },
      ],
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      name: defaultSchema,
      distance_from: defaultSchema,
      distance_to: defaultSchema,
      // working_hours: yup.array().of(
      //   yup.object().required(t("required.field")).shape({
      //     day_number: defaultSchema,
      //     end_time: defaultSchema,
      //     is_active: defaultSchema,
      //     start_time: defaultSchema,
      //   }),
      // ),
    });
  }, [t]);

  const onSubmit = (values) => {
    const data = { ...values, type: values?.type?.value };
    saveChanges(data);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  const { values, setValues, handleChange, handleSubmit, setFieldValue } =
    formik;

  const fetchData = useCallback(() => {
    setLoader(true);

    getCourierType(id)
      .then((res) => {
        setValues({
          name: res?.name,
          distance_from: res?.distance_from,
          distance_to: res?.distance_to,
          working_hours: res?.working_hours,
          starting_minute: res?.starting_minute,
          type: {
            value: res?.type,
            label: t(res?.type),
          },
        });
      })
      .finally(() => setLoader(false));
  }, [setValues, id]);

  useEffect(() => {
    if (!id) {
      setFieldValue("working_hours", [
        {
          day_number: 0,
          end_time: "23:00",
          is_active: false,
          start_time: "00:00",
        },
        {
          day_number: 1,
          end_time: "23:00",
          is_active: false,
          start_time: "00:00",
        },
        {
          day_number: 2,
          end_time: "23:00",
          is_active: false,
          start_time: "00:00",
        },
        {
          day_number: 3,
          end_time: "23:00",
          is_active: false,
          start_time: "00:00",
        },
        {
          day_number: 4,
          end_time: "23:00",
          is_active: false,
          start_time: "00:00",
        },
        {
          day_number: 5,
          end_time: "23:00",
          is_active: false,
          start_time: "00:00",
        },
        {
          day_number: 6,
          end_time: "23:00",
          is_active: false,
          start_time: "00:00",
        },
      ]);
    } else fetchData();
  }, [id, setFieldValue, fetchData]);

  const saveChanges = (data) => {
    setSaveLoading(true);
    const selectedAction = id
      ? updateCourierType(id, data)
      : postCourierType(data);
    selectedAction
      .then(() => {
        history.goBack();
      })
      .finally(() => setSaveLoading(false));
  };

  const routes = [
    {
      title: id ? formik.values?.name : t("create"),
    },
  ];

  const weekDay = (i) => {
    switch (i) {
      case 0:
        return t("sunday");
      case 1:
        return t("monday");
      case 2:
        return t("tuesday");
      case 3:
        return t("wednesday");
      case 4:
        return t("thursday");
      case 5:
        return t("friday");
      case 6:
        return t("saturday");
      default:
        return t("sunday");
    }
  };

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (
        <div>{weekDay(id ? record?.day_number + 1 : index + 1)}</div>
      ),
    },
    {
      title: t("start_date"),
      key: "start_date",
      render: (record, index) => (
        <div>
          <span className="mr-2">Начало :</span>
          <TimePicker
            style={{ width: 150 }}
            value={moment(record.start_time, "HH:mm")}
            onChange={(val) => {
              val !== null
                ? setFieldValue(
                    `working_hours[${index}.start_time]`,
                    moment(val).format("HH:mm"),
                  )
                : setFieldValue(`working_hours[${index}.start_time]`, "00:00");
            }}
          />
        </div>
      ),
    },
    {
      title: t("end_date"),
      key: "end_date",
      render: (record, index) => (
        <div>
          <span className="mr-2">Конец :</span>
          <TimePicker
            style={{ width: 150 }}
            value={moment(record.end_time, "HH:mm")}
            onChange={(val) => {
              val !== null
                ? setFieldValue(
                    `working_hours[${index}.end_time]`,
                    moment(val).format("HH:mm"),
                  )
                : setFieldValue(`working_hours[${index}.end_time]`, "23:00");
            }}
          />
        </div>
      ),
    },
    {
      title: "is_active",
      key: "is_active",
      render: (record, index) => (
        <>
          <Switch
            defaultChecked={record.is_active}
            onChange={(e) =>
              setFieldValue(`working_hours[${index}].is_active`, e)
            }
          />
        </>
      ),
    },
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div
          style={{ minHeight: "100vh" }}
          className="flex flex-col justify-between"
        >
          <div>
            <Header startAdornment={<Breadcrumb routes={routes} />} />
            <div className="w-3/4 p-4  font-body text-sm">
              <Card title={id ? "Курьерское обновление" : t("add.new.courier")}>
                {!loader && (
                  <div>
                    <div className="grid grid-cols-4 gap-8">
                      <div className="mb-4">
                        <Form.Item
                          formik={formik}
                          name="name"
                          label={t("name")}
                        >
                          <Input
                            id="name"
                            value={values.name}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                      <div className="mb-4">
                        <Form.Item
                          formik={formik}
                          name="distance_from"
                          label={t("distance.from")}
                        >
                          <Input
                            id="distance_from"
                            type="number"
                            value={values.distance_from}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                      <div>
                        <Form.Item
                          formik={formik}
                          name="type"
                          label={t("type")}
                        >
                          <Select
                            height={32}
                            id="type"
                            options={types}
                            value={values.type}
                            onChange={(val) => {
                              setFieldValue("type", val);
                            }}
                          />
                        </Form.Item>
                      </div>
                      <div className="mb-4">
                        <Form.Item
                          formik={formik}
                          name="distance_to"
                          label={t("distance.to")}
                        >
                          <Input
                            id="distance_to"
                            type="number"
                            value={values.distance_to}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                      <div className="mb-4">
                        <Form.Item
                          formik={formik}
                          name="starting_minute"
                          label={t("starting.minute")}
                        >
                          <Input
                            id="starting_minute"
                            type="number"
                            value={values.starting_minute}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="input-label my-2">Режим работы</div>
                    <TableContainer
                      key="table-container"
                      className="rounded-md  border border-bordercolor"
                    >
                      <Table aria-label="simple tabs">
                        <TableBody key="table-body">
                          {values?.working_hours?.map((elm, index) => (
                            <TableRow
                              className={index % 2 === 1 ? "bg-gray-50" : ""}
                              style={{ marginTop: "10px !important" }}
                            >
                              {columns.map((column) => (
                                <TableCell
                                  style={{ boxShadow: "none", borderTop: "0" }}
                                  className="text-center"
                                >
                                  {column.render
                                    ? column.render(elm, index)
                                    : ""}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
                <LoaderComponent isLoader={loader} />
              </Card>
            </div>
          </div>
          <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
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
              type="submit"
              loading={saveLoading}
              onClick={() => console.log()}
            >
              {t(id ? "save" : "create")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
