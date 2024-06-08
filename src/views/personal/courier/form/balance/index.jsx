import Card from "../../../../../components/Card";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import Widgets from "components/Widgets";
import Form from "components/Form/Index";
import { useFormik } from "formik";
import Button from "components/Button";
import Input from "components/Input";
import {
  getCourierBalance,
  postCourierTransaction,
} from "services/courierBalance";
import CourierBalanceTable from "./Table";
import { showAlert } from "redux/actions/alertActions";
import { useDispatch } from "react-redux";
import Select from "components/Select";

export default function Balance() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [courierBalance, setCourierBalance] = useState({});
  const [refetch, setRefetch] = useState(false);

  //FORMIK
  const initialValues = useMemo(
    () => ({
      amount: "",
      comment: "",
      transaction_type: "",
    }),
    [],
  );

  const onSubmit = (values) => {
    if (values.amount > 0 && values.comment) {
      const data = {
        ...values,
        courier_id: id,
        transaction_type: values?.transaction_type?.value,
      };
      values?.transaction_type?.value &&
        postCourierTransaction(data).then((res) => {
          setRefetch(!refetch);
          setValues({ amount: "", comment: "" });
          dispatch(showAlert(t("successfully_updated"), "success"));
        });
    } else {
      dispatch(showAlert(t("fill_inputs"), "warning"));
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });
  const { values, handleChange, handleSubmit, setValues, setFieldValue } =
    formik;

  //REQUEST

  const getCourier = () => {
    getCourierBalance(id).then((res) => {
      setCourierBalance(res);
    });
  };

  useEffect(() => {
    getCourier();
  }, [refetch]);

  //WIDGET DATA
  const computedWidgetsData = useMemo(
    () => [
      {
        number: +courierBalance?.balance,
        title: t("balance"),
        key: "balance",
      },
    ],
    [t, courierBalance],
  );

  return (
    <>
      <div className="p-4">
        <div className="flex gap-4 h-full">
          <Widgets data={computedWidgetsData} removeMargin={true} />
          <div>
            <Card className="h-full">
              <div className="flex flex-row items-start gap-3 p-6">
                <Form.Item formik={formik} name="amount" label={t("payee")}>
                  <Input
                    type="number"
                    id="amount"
                    value={values.amount}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item formik={formik} name="comment" label={t("comment")}>
                  <Input
                    type="text"
                    id="comment"
                    value={values.comment}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  formik={formik}
                  name="transaction_type"
                  label={t("type")}
                >
                  <Select
                    width={150}
                    height={30}
                    id="tag_ids"
                    options={[
                      { value: "withdraw", label: t("withdraw") },
                      { value: "bonus", label: t("bonus") },
                      { value: "penalty", label: t("penalty") },
                    ]}
                    value={values.transaction_type}
                    onChange={(val) => {
                      setFieldValue("transaction_type", val);
                    }}
                  />
                </Form.Item>
                <div>
                  <label
                    className="input-label mb-1"
                    style={{ lineHeight: "24px", opacity: 0 }}
                  >
                    style uchun required
                  </label>
                  <Button size="medium" onClick={handleSubmit}>
                    {t("pay")}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <CourierBalanceTable refetch={refetch} />
      </div>
    </>
  );
}
