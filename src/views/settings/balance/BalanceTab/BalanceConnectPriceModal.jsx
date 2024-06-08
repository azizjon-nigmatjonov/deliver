import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import CModal from "components/Modal";
import { BalanceContext } from "./context";
import * as yup from "yup";
import { useFormik } from "formik";
import { Input } from "alisa-ui";
import { useBalance } from "services/v2/balance";

const BalanceModal = () => {
  const { t } = useTranslation();
  const { open, setOpen, data } = useContext(BalanceContext);

  const { postTransaction } = useBalance({
    createReplanishBalanceProps: {
      onSuccess: (res) => {
        setOpen(false);
        data.refetch();
      },
    },
  });

  const initialValues = useMemo(
    () => ({
      amount: 0,
      comment: "",
      transaction_type: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    const amountSchema = yup
      .number()
      .required("An amount is required")
      .moreThan(1000, ``);

    return yup.object().shape({
      amount: amountSchema,
      comment: defaultSchema,
      transaction_type: defaultSchema,
    });
  }, [t]);

  const onSubmit = (values) => {
    const data = {
      ...values,
      transaction_type: values?.transaction_type?.value,
      creator_type: "user",
      payment_status: "pending",
    };
    postTransaction.mutate({ ...data });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, handleSubmit } = formik;

  return (
    <CModal
      onConfirm={handleSubmit}
      title={"Пополнить баланс"}
      open={open}
      onClose={() => setOpen(false)}
      closeIcon={true}
      isWarning={false}
      confirm="Отправить"
      close="Отменить"
    >
      <div className="col-span-2 mb-5">
        <label htmlFor="amount">{t("set_sum")}</label>
        <Input
          id="amount"
          size="large"
          name="amount"
          formik={formik}
          onChange={handleChange}
          value={values.amount}
          type="number"
          addonAfter={<p>{t("sum")}</p>}
          min={10}
        />
      </div>
    </CModal>
  );
};

export default BalanceModal;
